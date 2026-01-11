import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { Incident } from '@/lib/types';
import { supabase } from '@/lib/supabase';

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

    // Geocode incidents with caching
    const geocodedIncidents = await geocodeIncidentsWithCache(incidents);
    
    return NextResponse.json({ incidents: geocodedIncidents, date });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

async function geocodeIncidentsWithCache(incidents: Incident[]): Promise<Incident[]> {
  // Geocode first 30 incidents for better map coverage
  const maxGeocode = Math.min(30, incidents.length);
  const geocodedIncidents: Incident[] = [];

  for (let i = 0; i < incidents.length; i++) {
    const incident = incidents[i];
    
    // Only geocode first batch, rest go through without coordinates
    if (i < maxGeocode) {
      try {
        const coords = await getCoordinatesWithCache(incident.location);
        geocodedIncidents.push({
          ...incident,
          ...coords,
        });
      } catch (error) {
        console.error(`Failed to geocode ${incident.location}:`, error);
        geocodedIncidents.push(incident);
      }
    } else {
      geocodedIncidents.push(incident);
    }
  }

  return geocodedIncidents;
}

async function getCoordinatesWithCache(
  address: string
): Promise<{ latitude?: number; longitude?: number }> {
  const normalizedAddress = `${address}, Seattle, WA`.toLowerCase().trim();

  try {
    // Check Supabase cache first
    const { data: cached, error: cacheError } = await supabase
      .from('geocoded_addresses')
      .select('latitude, longitude')
      .eq('address', normalizedAddress)
      .single();

    if (cached && !cacheError) {
      console.log(`Cache hit for: ${address}`);
      return {
        latitude: cached.latitude,
        longitude: cached.longitude,
      };
    }

    // Cache miss - geocode with Mapbox
    console.log(`Cache miss, geocoding: ${address}`);
    const coords = await geocodeWithMapbox(normalizedAddress);

    // Store in cache if successful
    if (coords.latitude && coords.longitude) {
      await supabase.from('geocoded_addresses').insert({
        address: normalizedAddress,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    }

    return coords;
  } catch (error) {
    console.error(`Geocoding error for ${address}:`, error);
    return {};
  }
}

async function geocodeWithMapbox(
  address: string
): Promise<{ latitude?: number; longitude?: number }> {
  try {
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
    
    if (!mapboxToken) {
      console.error('MAPBOX_ACCESS_TOKEN not configured');
      return {};
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}&limit=1&country=US&proximity=-122.3321,47.6062`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SeattleResponseMap/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    }

    return {};
  } catch (error) {
    console.error('Mapbox geocoding error:', error);
    return {};
  }
}
