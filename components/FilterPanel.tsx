'use client';

import { IncidentFilter } from '@/lib/types';

interface FilterPanelProps {
  filter: IncidentFilter;
  onFilterChange: (filter: IncidentFilter) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  incidentTypes: string[];
  incidentLevels: string[];
}

export default function FilterPanel({
  filter,
  onFilterChange,
  selectedDate,
  onDateChange,
  incidentTypes,
  incidentLevels,
}: FilterPanelProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search Location
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search by location..."
          value={filter.search}
          onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Incident Type
        </label>
        <select
          id="type"
          value={filter.type}
          onChange={(e) => onFilterChange({ ...filter, type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          {incidentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
          Incident Level
        </label>
        <select
          id="level"
          value={filter.level}
          onChange={(e) => onFilterChange({ ...filter, level: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Levels</option>
          {incidentLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => onFilterChange({ type: '', level: '', search: '' })}
        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}
