import React, { useState, useEffect, useRef } from 'react';
import ParkingLot from './ParkingLot';
import SearchBar from './SearchBar';
import { MapPin, Navigation, Info } from 'lucide-react';
import { motion } from 'framer-motion';
interface MapViewProps {
  onSelectLot: (lot: any) => void;
}
const MapView: React.FC<MapViewProps> = ({
  onSelectLot
}) => {
  const [selectedLot, setSelectedLot] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState('');
  const [parkingLots, setParkingLots] = useState<any[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const handleSelectLot = (lot: any) => {
    setSelectedLot(lot);
    onSelectLot(lot);
    if (mapInstance.current) {
      mapInstance.current.setCenter(lot.geometry.location);
    }
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (mapInstance.current) {
      searchParkingLots(mapInstance.current.getCenter());
    }
  };

  // Initialize Google Maps
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: {
          lat: 41.6563,
          lng: -83.6127
        },
        // Default center
        zoom: 15
      });
      mapInstance.current = map;

      // Search for parking lots when the map is initialized
      searchParkingLots(map.getCenter());
    }
  }, []);

  // Function to search for parking lots using the Places API
  const searchParkingLots = (location: google.maps.LatLng) => {
    if (!mapInstance.current) return;
    const request = {
      location: location,
      radius: 1000,
      // Search within 1km radius
      type: 'parking',
      // Search for parking lots
      query: 'parking lot' // Optional: Explicitly search for parking lots
    };
    const service = new google.maps.places.PlacesService(mapInstance.current);
    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add new markers for parking lots
        const newMarkers = results.map(place => {
          const marker = new google.maps.Marker({
            position: place.geometry?.location,
            map: mapInstance.current,
            title: place.name
          });

          // Add click event to select the parking lot
          marker.addListener('click', () => {
            handleSelectLot(place);
          });
          return marker;
        });
        markersRef.current = newMarkers;
        setParkingLots(results);
      }
    });
  };
  return <div className="relative h-full w-full overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" style={{
      height: '100vh',
      width: '100%'
    }}></div>

      {/* Search Bar */}
      <div className="absolute top-4 left-0 right-0 px-4 z-10">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-24 right-4 flex flex-col space-y-3 z-10">
        <motion.button className="w-12 h-12 rounded-full bg-park-teal text-white flex items-center justify-center shadow-lg" whileTap={{
        scale: 0.95
      }} onMouseEnter={() => setShowTooltip('location')} onMouseLeave={() => setShowTooltip('')} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }}>
          <MapPin size={22} />
        </motion.button>

        {showTooltip === 'location' && <div className="tooltip right-14 bottom-0">See your current location</div>}

        <motion.button className="w-12 h-12 rounded-full bg-white text-park-teal border border-gray-100 flex items-center justify-center shadow-lg" whileTap={{
        scale: 0.95
      }} onMouseEnter={() => setShowTooltip('navigation')} onMouseLeave={() => setShowTooltip('')} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }}>
          <Navigation size={22} />
        </motion.button>

        {showTooltip === 'navigation' && <div className="tooltip right-14 bottom-0">Navigate to selected lot</div>}
      </div>

      {/* Info Panel */}
      

      {/* Bottom Info Panel */}
      <motion.div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 glass-panel rounded-xl p-3 max-w-[80%] w-64" initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.6
    }}>
        <p className="text-sm font-medium text-gray-700 text-center">
          Click to get notified when your chosen parking spot is available
        </p>
      </motion.div>
    </div>;
};
export default MapView;