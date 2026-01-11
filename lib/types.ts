export interface Incident {
  dateTime: string;
  incidentNumber: string;
  level: string;
  units: string;
  location: string;
  type: string;
  latitude?: number;
  longitude?: number;
}

export interface IncidentFilter {
  type: string;
  level: string;
  search: string;
}
