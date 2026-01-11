# Seattle Emergency Response Map

An open-source Next.js application that visualizes Seattle Fire Department 911 emergency response incidents on an interactive map in real-time.

![Seattle Emergency Response Map](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🗺️ **Interactive Map** - Leaflet-based map displaying incident locations across Seattle
- 📅 **Date Selection** - View incidents from today or select historical dates
- 🔍 **Advanced Filtering** - Filter by incident type, level, and search by location
- 📊 **Real-time Statistics** - Track total, filtered, and geocoded incidents
- 📱 **Responsive Design** - Mobile-friendly interface built with Tailwind CSS
- 🎯 **Automatic Geocoding** - Converts addresses to map coordinates using Nominatim

## Data Source

This application fetches data from the [Seattle Fire Department Real-Time 911](https://web.seattle.gov/sfd/realtime911/) public API, which provides information about emergency response incidents including:

- Date and time
- Incident number
- Response level
- Units dispatched
- Location
- Incident type (Fire, Medical, Aid Response, etc.)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Map Library**: Leaflet with react-leaflet
- **Data Parsing**: Cheerio

## Known Limitations

### Map Markers
The Seattle Fire Department API provides street addresses but not coordinates. Currently, the application displays incidents in the sidebar/statistics but **map markers are not shown** because:

1. Free geocoding services (Nominatim) have strict rate limits and connection issues
2. Geocoding hundreds of incidents causes slow page loads (20+ seconds)
3. To maintain fast user experience, geocoding has been disabled

**Future Solutions:**
- Integrate a paid geocoding service (Google Maps, Mapbox) with an API key
- Implement a geocoding cache/database to store pre-geocoded locations
- Use client-side geocoding on-demand when users click on incidents
- Contribute coordinates back to Seattle's open data portal

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CamC9/seattle-response-map.git
cd seattle-response-map
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Select a Date** - Use the date picker to view incidents from a specific day (defaults to today)
2. **Filter Incidents** - Use the dropdown menus to filter by incident type or level
3. **Search Location** - Type in the search box to find incidents at specific locations
4. **View Details** - Click on any map marker to see detailed incident information
5. **Clear Filters** - Click the "Clear Filters" button to reset all filters

## Project Structure

```
seattle-response-map/
├── app/
│   ├── api/
│   │   └── incidents/
│   │       └── route.ts      # API endpoint for fetching Seattle data
│   ├── layout.tsx            # Root layout with metadata
│   ├── page.tsx              # Main application page
│   └── globals.css           # Global styles
├── components/
│   ├── Map.tsx               # Leaflet map component
│   └── FilterPanel.tsx       # Filter controls
├── lib/
│   └── types.ts              # TypeScript type definitions
└── README.md
```

## API Endpoints

### GET `/api/incidents`

Fetches and parses incident data from Seattle Fire Department.

**Query Parameters:**
- `date` (optional) - Date in MM/DD/YYYY format (defaults to today)

**Response:**
```json
{
  "incidents": [
    {
      "dateTime": "1/10/2026 09:30:00 PM",
      "incidentNumber": "F260100123",
      "level": "E1",
      "units": "E33",
      "location": "123 Main St",
      "type": "Aid Response",
      "latitude": 47.6062,
      "longitude": -122.3321
    }
  ],
  "date": "1/10/2026"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Data provided by [Seattle Fire Department Real-Time 911](https://web.seattle.gov/sfd/realtime911/)
- Map tiles by [OpenStreetMap](https://www.openstreetmap.org/)
- Geocoding by [Nominatim](https://nominatim.openstreetmap.org/)

## Disclaimer

This application is not affiliated with the Seattle Fire Department. Data is provided as-is from public sources and may not be 100% accurate or complete. For official emergency information, please visit the Seattle Fire Department website.

## Author

**Cameron Cuellar** - [CamC9](https://github.com/CamC9)

---

⭐ If you find this project useful, please consider giving it a star on GitHub!
