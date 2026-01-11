import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { Incident } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toLocaleDateString('en-US');

  try {
    // Fetch data from Seattle Fire Department
    const url = `https://web.seattle.gov/sfd/realtime911/getRecsForDatePub.asp?incDate=${encodeURIComponent(date)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SeattleResponseMap/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from Seattle Fire Department');
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const incidents: Incident[] = [];
    
    // Parse the table rows
    $('table tr').each((index, element) => {
      // Skip header row
      if (index === 0) return;
      
      const cells = $(element).find('td');
      if (cells.length >= 6) {
        const incident: Incident = {
          dateTime: $(cells[0]).text().trim(),
          incidentNumber: $(cells[1]).text().trim(),
          level: $(cells[2]).text().trim(),
          units: $(cells[3]).text().trim(),
          location: $(cells[4]).text().trim(),
          type: $(cells[5]).text().trim(),
        };
        
        // Only add if we have valid data
        if (incident.dateTime && incident.location) {
          incidents.push(incident);
        }
      }
    });

    // Return incidents immediately - geocoding is optional and done in background
    // This ensures fast page loads regardless of geocoding service availability
    return NextResponse.json({ incidents, date });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

async function geocodeAddress(address: string): Promise<{ latitude?: number; longitude?: number }> {
  try {
    // Add "Seattle, WA" to improve geocoding accuracy
    const fullAddress = `${address}, Seattle, WA`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SeattleResponseMap/1.0',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    
    return {};
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Geocoding timeout:', address);
    } else {
      console.error('Geocoding error:', error);
    }
    return {};
  }
}
