
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ParkingLot from './ParkingLot';
import SearchBar from './SearchBar';
import { MapPin, Navigation, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// Mock data for parking lots
const mockParkingLots = [
  {
    id: 1,
    name: 'Lot 13N',
    location: { lat: 41.6563, lng: -83.6127 },
    availableSpaces: 23,
    totalSpaces: 45,
    distance: '0.3 mi',
    type: 'Student',
    recentlyViewed: true
  },
  {
    id: 2,
    name: 'Lot 16',
    location: { lat: 41.6584, lng: -83.6105 },
    availableSpaces: 8,
    totalSpaces: 30,
    distance: '0.5 mi',
    type: 'Faculty'
  },
  {
    id: 3,
    name: 'Lot 17',
    location: { lat: 41.6612, lng: -83.6089 },
    availableSpaces: 0,
    totalSpaces: 25,
    distance: '0.7 mi',
    type: 'Visitor'
  },
  {
    id: 4,
    name: 'Area 2',
    location: { lat: 41.6598, lng: -83.6076 },
    availableSpaces: 15,
    totalSpaces: 40,
    distance: '0.4 mi',
    type: 'Student'
  },
  {
    id: 5,
    name: 'Area 3',
    location: { lat: 41.6574, lng: -83.6053 },
    availableSpaces: 12,
    totalSpaces: 35,
    distance: '0.6 mi',
    type: 'Mixed'
  }
];

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Default center position (Toledo, OH - approximate)
const center = {
  lat: 41.6564,
  lng: -83.6109
};

interface MapViewProps {
  onSelectLot: (lot: any) => void;
}

const MapView: React.FC<MapViewProps> = ({ onSelectLot }) => {
  const [selectedLot, setSelectedLot] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState('');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  const handleSelectLot = (lot: any) => {
    setSelectedLot(lot);
    setShowInfoWindow(true);
    onSelectLot(lot);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would filter parking lots or make an API call
    console.log('Searching for:', query);
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    console.log('Map initialized');
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Google Maps Container */}
      <LoadScript googleMapsApiKey="AIzaSyBHH8XkyThoJi9K5d7zGpUaxn-lEq1oSwU">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: false,
          }}
        >
          {/* Parking Lot Markers */}
          {mockParkingLots.map((lot) => (
            <Marker
              key={lot.id}
              position={lot.location}
              onClick={() => handleSelectLot(lot)}
              icon={{
                url: lot.availableSpaces > 0 
                  ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" fill="#dcfce7" />
                        <path d="M8 12h8" />
                        <path d="M12 8v8" />
                      </svg>
                    `)
                  : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" fill="#fee2e2" />
                        <path d="M8 12h8" />
                      </svg>
                    `),
                scaledSize: new window.google.maps.Size(36, 36),
              }}
            />
          ))}

          {/* Info Window for Selected Lot */}
          {selectedLot && showInfoWindow && (
            <InfoWindow
              position={selectedLot.location}
              onCloseClick={() => setShowInfoWindow(false)}
            >
              <div className="p-2 min-w-[150px]">
                <h3 className="font-medium text-gray-800">{selectedLot.name}</h3>
                <p className="text-sm text-gray-600">{selectedLot.type}</p>
                <div className="mt-1 text-sm">
                  <span className={selectedLot.availableSpaces > 0 ? "text-green-600" : "text-red-600"}>
                    {selectedLot.availableSpaces} / {selectedLot.totalSpaces} spaces
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {selectedLot.distance} away
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Search Bar */}
      <div className="absolute top-4 left-0 right-0 px-4 z-10">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-24 right-4 flex flex-col space-y-3 z-10">
        <motion.button 
          className="w-12 h-12 rounded-full bg-park-teal text-white flex items-center justify-center shadow-lg"
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setShowTooltip('location')}
          onMouseLeave={() => setShowTooltip('')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MapPin size={22} />
        </motion.button>
        
        {showTooltip === 'location' && (
          <div className="tooltip right-14 bottom-0">
            See your current location
          </div>
        )}

        <motion.button 
          className="w-12 h-12 rounded-full bg-white text-park-teal border border-gray-100 flex items-center justify-center shadow-lg"
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setShowTooltip('navigation')}
          onMouseLeave={() => setShowTooltip('')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Navigation size={22} />
        </motion.button>
        
        {showTooltip === 'navigation' && (
          <div className="tooltip right-14 bottom-0">
            Navigate to selected lot
          </div>
        )}
      </div>

      {/* Bottom Info Panel */}
      <motion.div 
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 glass-panel rounded-xl p-3 max-w-[80%] w-64"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm font-medium text-gray-700 text-center">Click to get notified when your chosen parking spot is available</p>
      </motion.div>
    </div>
  );
};

export default MapView;
