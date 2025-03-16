
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

const MapView: React.FC<MapViewProps> = ({
  onSelectLot
}) => {
  const navigate = useNavigate();
  const [selectedLot, setSelectedLot] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState('');
  const [parkingLots, setParkingLots] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    if (mapInstance.current && mapLoaded) {
      searchParkingLots(mapInstance.current.getCenter() || new window.google.maps.LatLng(41.6563, -83.6127));
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
      navigator.geolocation.getCurrentPosition(position => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        if (mapInstance.current) {
          mapInstance.current.setCenter(userLocation);
          toast.success("Location found!");
          // Search for parking lots near the user's location
          searchParkingLots(new window.google.maps.LatLng(userLocation.lat, userLocation.lng));
        }
      }, error => {
        console.error("Error getting location:", error);
        toast.error("Could not get your location");
      });
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  // Initialize Google Maps
  useEffect(() => {
    const loadMap = () => {
      try {
        if (mapRef.current && !mapInstance.current && window.google) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: {
              lat: 41.6563,
              lng: -83.6127
            },
            zoom: 15,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false
          });
          
          mapInstance.current = map;
          setMapLoaded(true);
          setIsLoading(false);
          
          // Add a listener for when the map becomes idle
          map.addListener('idle', () => {
            searchParkingLots(map.getCenter() || new window.google.maps.LatLng(41.6563, -83.6127));
          });
          
          toast.success("Map loaded successfully!");
        }
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
        setIsLoading(false);
        toast.error("Could not load the map. Please try refreshing the page.");
      }
    };

    // Check if Google Maps API is loaded
    if (window.google && window.google.maps) {
      loadMap();
    } else {
      // Wait for the Google Maps API to load
      const checkGoogleMapsLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMapsLoaded);
          loadMap();
        }
      }, 100);

      // Set a timeout to stop checking after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogleMapsLoaded);
        if (!mapLoaded) {
          setIsLoading(false);
          toast.error("Failed to load Google Maps. Please check your internet connection and try again.");
        }
      }, 10000);
    }

    return () => {
      // Clean up markers when component unmounts
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
      }
    };
  }, []);

  // Function to search for parking lots using the Places API
  const searchParkingLots = (location: google.maps.LatLng | null) => {
    if (!mapInstance.current || !location || !mapLoaded) return;
    
    try {
      const request = {
        location: location,
        radius: 1000,
        type: 'parking',
        query: searchQuery || 'parking lot'
      };
      
      const service = new window.google.maps.places.PlacesService(mapInstance.current);
      
      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          console.log("Places API results:", results);
          
          // Clear existing markers
          markersRef.current.forEach(marker => marker.setMap(null));
          markersRef.current = [];

          // Add new markers for parking lots
          const newMarkers = results.map(place => {
            // Generate random parking data
            const availableSpaces = Math.floor(Math.random() * 30);
            const totalSpaces = Math.floor(Math.random() * 30) + 30;
            const distance = `${(Math.random() * 2).toFixed(1)} miles`;
            const type = Math.random() > 0.5 ? "Student" : "Faculty";
            
            const marker = new window.google.maps.Marker({
              position: place.geometry?.location,
              map: mapInstance.current,
              title: place.name,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: availableSpaces > 0 ? '#10b981' : '#ef4444',
                fillOpacity: 0.8,
                strokeWeight: 1,
                strokeColor: '#ffffff',
                scale: 10
              }
            });

            // Add click event to select the parking lot
            marker.addListener('click', () => {
              handleSelectLot({
                ...place,
                availableSpaces,
                totalSpaces,
                distance,
                type
              });
            });
            
            return marker;
          });
          
          markersRef.current = newMarkers;

          // Add mock data to places
          const placesWithData = results.map(place => ({
            ...place,
            availableSpaces: Math.floor(Math.random() * 30),
            totalSpaces: Math.floor(Math.random() * 30) + 30,
            distance: `${(Math.random() * 2).toFixed(1)} miles`,
            type: Math.random() > 0.5 ? "Student" : "Faculty"
          }));
          
          setParkingLots(placesWithData);
        } else {
          console.error("Places API error:", status);
          toast.error(`Could not find parking lots: ${status}`);
        }
      });
    } catch (error) {
      console.error("Error searching for parking lots:", error);
      toast.error("Error searching for parking lots");
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" style={{
        height: '100vh',
        width: '100%'
      }}>
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-t-4 border-park-teal border-r-4 border-r-transparent animate-spin mb-4"></div>
              <p className="text-park-teal font-medium">Loading map...</p>
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
          <Locate size={22} />
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

      {/* Parking Lots list that should appear when map is loaded */}
      {mapLoaded && parkingLots.length > 0 && (
        <div className="absolute bottom-24 left-4 z-10 max-h-64 overflow-y-auto bg-white rounded-lg shadow-lg p-2 w-64">
          <h3 className="text-sm font-medium text-gray-900 mb-2 px-2">Nearby Parking</h3>
          <div className="space-y-1">
            {parkingLots.map((lot, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-md cursor-pointer transition-colors ${selectedLot?.id === lot.id ? 'bg-park-teal-light' : 'hover:bg-gray-50'}`}
                onClick={() => handleSelectLot(lot)}
              >
                <div className="text-sm font-medium text-gray-900">{lot.name}</div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>{lot.availableSpaces} spaces</span>
                  <span>{lot.distance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
