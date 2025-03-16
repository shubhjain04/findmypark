
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Car } from 'lucide-react';

interface ParkingLotProps {
  lot: {
    id: number;
    name: string;
    availableSpaces: number;
    totalSpaces: number;
    distance: string;
    type: string;
    recentlyViewed?: boolean;
  };
  onSelect: () => void;
  isSelected: boolean;
}

const ParkingLot: React.FC<ParkingLotProps> = ({ lot, onSelect, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const availability = lot.availableSpaces / lot.totalSpaces;
  const isAvailable = lot.availableSpaces > 0;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`relative rounded-full shadow-md cursor-pointer 
          ${isSelected ? 'ring-4 ring-park-teal ring-opacity-50' : ''}
          ${lot.recentlyViewed ? 'border-2 border-white' : ''}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSelect}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center 
            ${isAvailable ? 'bg-park-teal text-white' : 'bg-red-500 text-white'}`}
        >
          <motion.div
            animate={{ scale: isAvailable ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: isAvailable ? Infinity : 0, duration: 2 }}
          >
            <MapPin size={isAvailable ? 18 : 16} />
          </motion.div>
        </div>
        
        {lot.recentlyViewed && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white animate-pulse" />
        )}
      </motion.div>
      
      <AnimatePresence>
        {(isHovered || isSelected) && (
          <motion.div
            className="absolute z-10 w-48 bg-white rounded-lg shadow-lg border border-gray-100 p-3 -translate-x-1/2 left-6 -top-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-sm font-medium text-gray-900 mb-1">
              {lot.name}
            </div>
            
            <div className="flex items-center text-xs text-gray-600 mb-2">
              <Car size={14} className="mr-1" />
              <span>
                {lot.availableSpaces} of {lot.totalSpaces} spaces available
              </span>
            </div>
            
            <div className="h-1.5 w-full bg-gray-100 rounded-full mb-2">
              <motion.div 
                className={`h-full rounded-full ${isAvailable ? 'bg-park-teal' : 'bg-red-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${availability * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="flex justify-between text-xs">
              <div className="flex items-center text-gray-600">
                <Clock size={14} className="mr-1" />
                <span>{lot.distance}</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-park-teal-light text-park-teal text-xs font-medium">
                {lot.type}
              </div>
            </div>
            
            <div className="absolute w-2 h-2 bg-white transform rotate-45 -left-1 top-5 border-l border-b border-gray-100" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParkingLot;
