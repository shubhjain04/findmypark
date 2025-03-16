import React, { useState, useEffect, useRef } from 'react';
import ParkingLot from './ParkingLot';
import SearchBar from './SearchBar';
import { MapPin, Navigation, Info } from 'lucide-react';
import { motion } from 'framer-motion';

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
    recentlyViewed: true,
  },
  {
    id: 2,
    name: 'Lot 16',
    location: { lat: 41.6584, lng: -83.6105 },
    availableSpaces: 8,
    totalSpaces: 30,
    distance: '0.5 mi',
    type: 'Faculty',
  },
  {
    id: 3,
    name: 'Lot 17',
    location: { lat: 41.6612, lng: -83.6089 },
    availableSpaces: 0,
    totalSpaces: 25,
    distance: '0.7 mi',
    type: 'Visitor',
  },
  {
    id: 4,
    name: 'Area 2',
    location: { lat: 41.6598, lng: -83.6076 },
    availableSpaces: 15,
    totalSpaces: 40,
    distance: '0.4 mi',
    type: 'Student',
  },
  {
    id: 5,
    name: 'Area 3',
    location: { lat: 41.6574, lng: -83.6053 },
    availableSpaces: 12,
    totalSpaces: 35,
    distance: '0.6 mi',
    type: 'Mixed',
  },
];

interface MapViewProps {
  onSelectLot: (lot: any) => void;
}

const MapView: React.FC<MapViewProps> = ({ onSelectLot }) => {
  const [selectedLot, setSelectedLot] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  const handleSelectLot = (lot: any) => {
    setSelectedLot(lot);
    onSelectLot(lot);
    // Center the map on the selected lot
    if (mapInstance.current) {
      mapInstance.current.setCenter(lot.location);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would filter parking lots or make an API call
    console.log('Searching for:', query);
  };

  // Initialize Google Maps
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 41.6563, lng: -83.6127 }, // Default center
        zoom: 15,
        mapId: 'YOUR_MAP_ID', // Optional: Add a custom map ID if you have one
      });

      mapInstance.current = map;

      // Add markers for parking lots
      mockParkingLots.forEach((lot) => {
        new google.maps.Marker({
          position: lot.location,
          map: map,
          title: lot.name,
        });
      });
    }
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ height: '100vh', width: '100%' }}
      ></div>

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
          <div className="tooltip right-14 bottom-0">See your current location</div>
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
          <div className="tooltip right-14 bottom-0">Navigate to selected lot</div>
        )}
      </div>

      {/* Info Panel */}
      <motion.div
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 glass-panel rounded-xl p-4 max-w-[80%] w-64"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center mb-2">
          <Info size={16} className="text-park-teal mr-2" />
          <p className="text-sm font-medium text-gray-700">
            Click to see parking availability near any building
          </p>
        </div>
        <div className="w-full flex justify-center">
          <motion.div
            className="w-8 h-8 rounded-full bg-park-teal/20 flex items-center justify-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <motion.div
              animate={{ rotate: 180 }}
              transition={{ repeat: 1, duration: 1, delay: 1 }}
            >
              <MapPin size={18} className="text-park-teal" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Info Panel */}
      <motion.div
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 glass-panel rounded-xl p-3 max-w-[80%] w-64"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm font-medium text-gray-700 text-center">
          Click to get notified when your chosen parking spot is available
        </p>
      </motion.div>
    </div>
  );
};

export default MapView;
