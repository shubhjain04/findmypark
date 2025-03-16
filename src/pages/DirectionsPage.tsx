
import React, { useState, useEffect } from 'react';
import TabBar from '@/components/TabBar';
import { ArrowLeft, Navigation2, Clock, Car, Bike, PersonStanding } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 41.6564,
  lng: -83.6109
};

const DirectionsPage = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'car' | 'bike' | 'walk'>('car');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  
  // Mock data for directions
  const directionsData = {
    destination: 'Lot 13N - Student Parking',
    currentLocation: 'Your Location',
    distance: '0.3 miles',
    estimatedTime: '5 min',
    steps: [
      { id: 1, instruction: 'Head south on University Ave', distance: '300 ft', time: '1 min' },
      { id: 2, instruction: 'Turn left onto Campus Dr', distance: '0.1 mi', time: '2 min' },
      { id: 3, instruction: 'Continue onto Entrance Road', distance: '0.1 mi', time: '1 min' },
      { id: 4, instruction: 'Turn right into Lot 13N', distance: '150 ft', time: '1 min' }
    ]
  };

  const getModeTime = () => {
    switch (selectedMode) {
      case 'car': return '5 min';
      case 'bike': return '8 min';
      case 'walk': return '15 min';
      default: return '5 min';
    }
  };

  const getTravelMode = () => {
    switch (selectedMode) {
      case 'car': return google.maps.TravelMode.DRIVING;
      case 'bike': return google.maps.TravelMode.BICYCLING;
      case 'walk': return google.maps.TravelMode.WALKING;
      default: return google.maps.TravelMode.DRIVING;
    }
  };

  const directionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === google.maps.DirectionsStatus.OK) {
      setDirections(result);
    } else {
      console.error(`Error fetching directions: ${status}`);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)} 
          className="w-8 h-8 flex items-center justify-center rounded-full mr-3"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-medium">Directions</h1>
      </div>

      {/* Map Preview */}
      <div className="h-40 w-full relative">
        <LoadScript googleMapsApiKey="AIzaSyBHH8XkyThoJi9K5d7zGpUaxn-lEq1oSwU">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={15}
            options={{
              fullscreenControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              zoomControl: false,
            }}
          >
            {/* Request directions when the travel mode changes */}
            <DirectionsService
              options={{
                destination: { lat: 41.6563, lng: -83.6127 }, // Lot 13N
                origin: { lat: 41.6600, lng: -83.6150 },      // Example origin
                travelMode: getTravelMode(),
              }}
              callback={directionsCallback}
            />
            
            {/* Render directions on the map */}
            {directions && (
              <DirectionsRenderer
                options={{
                  directions: directions,
                  suppressMarkers: true,
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
        <div className="flex justify-center absolute top-0 left-0 right-0 bottom-0 items-center pointer-events-none">
          <motion.div 
            className="bg-white/70 backdrop-blur-md p-3 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <Navigation2 className="text-park-teal" size={20} />
              <span className="text-sm font-medium">Navigation Active</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Travel Mode Selection */}
      <div className="p-4">
        <div className="flex justify-around bg-gray-50 rounded-lg p-1">
          <motion.button
            className={`flex-1 flex items-center justify-center py-2 rounded-md ${
              selectedMode === 'car' ? 'bg-white shadow-sm text-park-teal' : 'text-gray-500'
            }`}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMode('car')}
          >
            <Car size={18} className="mr-2" />
            <span className="text-sm font-medium">Drive</span>
          </motion.button>
          
          <motion.button
            className={`flex-1 flex items-center justify-center py-2 rounded-md ${
              selectedMode === 'bike' ? 'bg-white shadow-sm text-park-teal' : 'text-gray-500'
            }`}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMode('bike')}
          >
            <Bike size={18} className="mr-2" />
            <span className="text-sm font-medium">Bike</span>
          </motion.button>
          
          <motion.button
            className={`flex-1 flex items-center justify-center py-2 rounded-md ${
              selectedMode === 'walk' ? 'bg-white shadow-sm text-park-teal' : 'text-gray-500'
            }`}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMode('walk')}
          >
            <PersonStanding size={18} className="mr-2" />
            <span className="text-sm font-medium">Walk</span>
          </motion.button>
        </div>
      </div>

      {/* Route Info */}
      <div className="px-4 py-2">
        <div className="bg-park-teal-light rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="font-medium text-park-teal-dark">{directionsData.destination}</h2>
              <p className="text-sm text-gray-600">from {directionsData.currentLocation}</p>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="text-park-teal mr-1" />
              <span className="text-sm font-medium text-park-teal">{getModeTime()}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="text-gray-600">Distance: {directionsData.distance}</div>
            </div>
            <div className="bg-park-teal text-white px-3 py-1 rounded-full text-xs">
              23 spaces available
            </div>
          </div>
        </div>
      </div>

      {/* Directions Steps */}
      <div className="px-4 pt-3">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Turn-by-turn directions</h3>
        
        <div className="space-y-3">
          {directionsData.steps.map((step, index) => (
            <motion.div 
              key={step.id}
              className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{step.instruction}</div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{step.distance}</span>
                    <span>{step.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 p-4">
          <button className="btn-teal w-full">
            <Navigation2 size={16} className="mr-2" />
            Start Navigation
          </button>
        </div>
      </div>

      <TabBar />
    </div>
  );
};

export default DirectionsPage;
