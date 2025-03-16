
import React, { useState, useEffect, useRef } from 'react';
import ParkingLot from './ParkingLot';
import SearchBar from './SearchBar';
import { MapPin, Navigation, Info, Locate } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from './ui/button';

interface MapViewProps {
  onSelectLot: (lot: any) => void;
}

// Mock parking lots for when Maps API isn't working
const mockParkingLots = [
  {
    id: 1,
    name: "Lot 13N - Student Parking",
    geometry: { location: { lat: 41.6583, lng: -83.6137 } },
    availableSpaces: 23,
    totalSpaces: 50,
    distance: "0.3 miles",
    type: "Student"
  },
  {
    id: 2,
    name: "Lot 9 - Faculty Parking",
    geometry: { location: { lat: 41.6553, lng: -83.6147 } },
    availableSpaces: 5,
    totalSpaces: 30,
    distance: "0.5 miles",
    type: "Faculty"
  },
  {
    id: 3,
    name: "Lot 4 - Visitor Parking",
    geometry: { location: { lat: 41.6533, lng: -83.6107 } },
    availableSpaces: 0,
    totalSpaces: 15,
    distance: "0.8 miles",
    type: "Visitor"
  }
];

const MapView: React.FC<MapViewProps> = ({
  onSelectLot
}) => {
  const navigate = useNavigate();
  const [selectedLot, setSelectedLot] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState('');
  const [parkingLots, setParkingLots] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiError, setApiError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const handleSelectLot = (lot: any) => {
    setSelectedLot(lot);
    onSelectLot(lot);
    if (mapInstance.current) {
      mapInstance.current.setCenter(lot.geometry.location);
    }
    
    toast.success(`Selected ${lot.name}`, {
      description: "View details or get directions",
      action: {
        label: "Navigate",
        onClick: () => navigateToDirections()
      }
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (mapInstance.current && !apiError) {
      searchParkingLots(mapInstance.current.getCenter() || new google.maps.LatLng(41.6563, -83.6127));
    } else {
      // Filter mock parking lots based on query
      const filteredLots = mockParkingLots.filter(lot => 
        lot.name.toLowerCase().includes(query.toLowerCase())
      );
      setParkingLots(filteredLots.length > 0 ? filteredLots : mockParkingLots);
    }
  };

  // Navigate to directions page
  const navigateToDirections = () => {
    navigate('/directions');
  };

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.info("Getting your location...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          if (mapInstance.current) {
            mapInstance.current.setCenter(userLocation);
            toast.success("Location found!");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  // Initialize Google Maps
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      try {
        const map = new google.maps.Map(mapRef.current, {
          center: {
            lat: 41.6563,
            lng: -83.6127
          },
          zoom: 15
        });
        
        mapInstance.current = map;
        setMapLoaded(true);

        // Search for parking lots when the map is initialized
        searchParkingLots(map.getCenter() || new google.maps.LatLng(41.6563, -83.6127));
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
        setApiError(true);
        // Display mock parking lots instead
        setParkingLots(mockParkingLots);
      }
    }
  }, []);

  // Function to search for parking lots using the Places API
  const searchParkingLots = (location: google.maps.LatLng | null) => {
    if (!mapInstance.current || !location) return;
    
    try {
      const request = {
        location: location,
        radius: 1000,
        type: 'parking',
        query: searchQuery || 'parking lot'
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
              handleSelectLot({
                ...place,
                availableSpaces: Math.floor(Math.random() * 30),
                totalSpaces: 50,
                distance: `${(Math.random() * 2).toFixed(1)} miles`,
                type: Math.random() > 0.5 ? "Student" : "Faculty"
              });
            });
            return marker;
          });
          
          markersRef.current = newMarkers;
          
          // Add mock data to places
          const placesWithData = results.map(place => ({
            ...place,
            availableSpaces: Math.floor(Math.random() * 30),
            totalSpaces: 50,
            distance: `${(Math.random() * 2).toFixed(1)} miles`,
            type: Math.random() > 0.5 ? "Student" : "Faculty"
          }));
          
          setParkingLots(placesWithData);
        } else {
          console.error("Places API error:", status);
          setApiError(true);
          // Display mock parking lots instead
          setParkingLots(mockParkingLots);
        }
      });
    } catch (error) {
      console.error("Error searching for parking lots:", error);
      setApiError(true);
      // Display mock parking lots instead
      setParkingLots(mockParkingLots);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" style={{
        height: '100vh',
        width: '100%'
      }}>
        {/* Display mock markers if API has an error */}
        {apiError && (
          <div className="absolute inset-0 bg-gray-100 z-0 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
              <h3 className="font-medium text-park-teal mb-2">Map Preview</h3>
              <p className="text-sm text-gray-500 mb-4">
                The map couldn't be loaded, but all functionality is still available with mock data.
              </p>
              
              {/* Display mock parking lots on the preview map */}
              <div className="relative h-64 w-full bg-gray-200 rounded-lg overflow-hidden">
                {mockParkingLots.map((lot, index) => (
                  <div
                    key={lot.id}
                    className="absolute"
                    style={{
                      left: `${30 + index * 25}%`,
                      top: `${40 + (index % 2) * 20}%`,
                    }}
                    onClick={() => handleSelectLot(lot)}
                  >
                    <ParkingLot
                      lot={lot}
                      onSelect={() => handleSelectLot(lot)}
                      isSelected={selectedLot?.id === lot.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="absolute top-4 left-0 right-0 px-4 z-10">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-24 right-4 flex flex-col space-y-3 z-10">
        <motion.button
          className="w-12 h-12 rounded-full bg-park-teal text-white flex items-center justify-center shadow-lg"
          whileTap={{
            scale: 0.95
          }}
          onMouseEnter={() => setShowTooltip('location')}
          onMouseLeave={() => setShowTooltip('')}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.2
          }}
          onClick={getCurrentLocation}
        >
          <MapPin size={22} />
        </motion.button>

        {showTooltip === 'location' && <div className="tooltip right-14 bottom-0">See your current location</div>}

        <motion.button
          className="w-12 h-12 rounded-full bg-white text-park-teal border border-gray-100 flex items-center justify-center shadow-lg"
          whileTap={{
            scale: 0.95
          }}
          onMouseEnter={() => setShowTooltip('navigation')}
          onMouseLeave={() => setShowTooltip('')}
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.3
          }}
          onClick={navigateToDirections}
        >
          <Navigation size={22} />
        </motion.button>

        {showTooltip === 'navigation' && <div className="tooltip right-14 bottom-0">Navigate to selected lot</div>}
      </div>

      {/* Bottom Info Panel */}
      <motion.div
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 glass-panel rounded-xl p-3 max-w-[80%] w-64"
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.6
        }}
      >
        <p className="text-sm font-medium text-gray-700 text-center">
          Click to get notified when your chosen parking spot is available
        </p>
      </motion.div>
    </div>
  );
};

export default MapView;
