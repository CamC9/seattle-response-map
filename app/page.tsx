'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Incident, IncidentFilter } from '@/lib/types';
import FilterPanel from '@/components/FilterPanel';

// Dynamically import Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [filter, setFilter] = useState<IncidentFilter>({
    type: '',
    level: '',
    search: '',
  });

  useEffect(() => {
    fetchIncidents();
  }, [selectedDate]);

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const dateFormatted = new Date(selectedDate).toLocaleDateString('en-US');
      const response = await fetch(`/api/incidents?date=${encodeURIComponent(dateFormatted)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }
      
      const data = await response.json();
      setIncidents(data.incidents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique incident types and levels for filter dropdowns
  const incidentTypes = useMemo(() => {
    const types = new Set(incidents.map(i => i.type).filter(Boolean));
    return Array.from(types).sort();
  }, [incidents]);

  const incidentLevels = useMemo(() => {
    const levels = new Set(incidents.map(i => i.level).filter(Boolean));
    return Array.from(levels).sort();
  }, [incidents]);

  // Filter incidents based on current filter state
  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      if (filter.type && incident.type !== filter.type) return false;
      if (filter.level && incident.level !== filter.level) return false;
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return incident.location.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }, [incidents, filter]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Seattle Emergency Response Map</h1>
          <p className="text-sm text-blue-100">Real-time 911 incident tracking</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-80 bg-gray-50 p-4 overflow-y-auto border-r border-gray-200">
          <FilterPanel
            filter={filter}
            onFilterChange={setFilter}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            incidentTypes={incidentTypes}
            incidentLevels={incidentLevels}
          />

          {/* Stats */}
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-gray-700 mb-2">Statistics</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Incidents:</span>
                <span className="font-semibold">{incidents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Filtered:</span>
                <span className="font-semibold">{filteredIncidents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Geocoded:</span>
                <span className="font-semibold">
                  {filteredIncidents.filter(i => i.latitude && i.longitude).length}
                </span>
              </div>
            </div>
          </div>

          {loading && (
            <div className="mt-4 text-center text-gray-500">
              <p>Loading incidents...</p>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Incidents List */}
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
            <h2 className="font-semibold text-gray-700 mb-3">Incidents</h2>
            {filteredIncidents.length > 0 ? (
              <div className="space-y-2">
                {filteredIncidents.slice(0, 50).map((incident, index) => (
                  <div key={`${incident.incidentNumber}-${index}`} className="border-b border-gray-200 pb-2 last:border-0">
                    <div className="text-sm">
                      <p className="font-semibold text-gray-800">{incident.type}</p>
                      <p className="text-xs text-gray-600">{incident.dateTime}</p>
                      <p className="text-xs text-gray-600">{incident.location}</p>
                      <p className="text-xs text-gray-500">Level: {incident.level} | Units: {incident.units}</p>
                    </div>
                  </div>
                ))}
                {filteredIncidents.length > 50 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    Showing first 50 of {filteredIncidents.length} incidents
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No incidents to display</p>
            )}
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          {!loading && filteredIncidents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="text-center text-gray-500">
                <p className="text-lg font-semibold">No incidents found</p>
                <p className="text-sm">Try adjusting your filters or selecting a different date</p>
              </div>
            </div>
          )}
          <Map incidents={filteredIncidents} />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-2 text-xs">
        <p>
          Data source:{' '}
          <a
            href="https://web.seattle.gov/sfd/realtime911/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Seattle Fire Department Real-Time 911
          </a>
          {' | '}
          <a
            href="https://github.com/CamC9/seattle-response-map"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
