'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Incident } from '@/lib/types';

// Fix Leaflet default icon issue with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  incidents: Incident[];
}

function RecenterMap({ incidents }: { incidents: Incident[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (incidents.length > 0) {
      const validIncidents = incidents.filter(i => i.latitude && i.longitude);
      if (validIncidents.length > 0) {
        const bounds = L.latLngBounds(
          validIncidents.map(i => [i.latitude!, i.longitude!])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [incidents, map]);
  
  return null;
}

export default function Map({ incidents }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  const validIncidents = incidents.filter(i => i.latitude && i.longitude);

  return (
    <MapContainer
      center={[47.6062, -122.3321]} // Seattle coordinates
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {validIncidents.map((incident, index) => (
        <Marker
          key={`${incident.incidentNumber}-${index}`}
          position={[incident.latitude!, incident.longitude!]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-2">{incident.type}</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Time:</strong> {incident.dateTime}</p>
                <p><strong>Incident #:</strong> {incident.incidentNumber}</p>
                <p><strong>Level:</strong> {incident.level}</p>
                <p><strong>Units:</strong> {incident.units}</p>
                <p><strong>Location:</strong> {incident.location}</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      
      <RecenterMap incidents={validIncidents} />
    </MapContainer>
  );
}
