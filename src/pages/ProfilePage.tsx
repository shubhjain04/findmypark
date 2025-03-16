
import React, { useState } from 'react';
import TabBar from '@/components/TabBar';
import { User, Heart, Settings, LogOut, Car, Landmark, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const [user] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    joinDate: 'Member since August 2023',
    parkingPass: 'Student Parking Pass',
    favoriteLocations: [
      { id: 1, name: 'Lot 13N', type: 'Student Parking' },
      { id: 2, name: 'MacKinnon Hall', type: 'Building' },
      { id: 3, name: 'Engineering Building', type: 'Building' }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header / Profile Card */}
      <div className="bg-white px-4 pt-10 pb-5 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium">Profile</h1>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600">
            <Settings size={20} />
          </button>
        </div>

        <div className="mt-4 flex items-center">
          <motion.div 
            className="w-16 h-16 rounded-full bg-park-teal-light text-park-teal flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <User size={24} />
          </motion.div>
          
          <div className="ml-4">
            <h2 className="font-medium">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">{user.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Parking Pass */}
      <motion.div 
        className="mx-4 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative bg-gradient-to-br from-park-teal to-park-teal-dark rounded-xl p-4 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-1/3 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full transform -translate-x-1/3 translate-y-1/2" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-white/70 text-xs">Your Parking Pass</div>
                <div className="text-white font-medium mt-0.5">{user.parkingPass}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Car size={18} className="text-white" />
              </div>
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center">
                <Landmark size={14} className="text-white/70 mr-1" />
                <span className="text-white/70 text-xs">University of Toledo Campus</span>
              </div>
              <div className="text-white/70 text-xs">Valid until May 2024</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Favorite Locations */}
      <motion.div 
        className="bg-white mt-4 p-4 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium">Favorite Locations</h2>
          <button className="text-sm text-park-teal">Edit</button>
        </div>
        
        <div className="space-y-3">
          {user.favoriteLocations.map((location) => (
            <div 
              key={location.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-park-teal-light flex items-center justify-center mr-3">
                  <MapPin size={16} className="text-park-teal" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{location.name}</div>
                  <div className="text-xs text-gray-500">{location.type}</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          ))}
          
          <button className="w-full flex items-center justify-center py-2 border border-dashed border-gray-200 rounded-lg text-gray-500 mt-2">
            <Heart size={16} className="mr-2" />
            <span className="text-sm">Add new favorite</span>
          </button>
        </div>
      </motion.div>

      {/* Settings Shortcuts */}
      <motion.div 
        className="bg-white mt-4 p-4 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-medium mb-3">Settings</h2>
        
        <div className="space-y-3">
          {[
            { icon: Car, label: 'Manage Vehicles' },
            { icon: Settings, label: 'Preferences' },
            { icon: LogOut, label: 'Sign Out', danger: true }
          ].map((item, index) => (
            <button 
              key={index}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${item.danger ? 'bg-red-50' : 'bg-gray-100'} flex items-center justify-center mr-3`}>
                  <item.icon size={16} className={item.danger ? 'text-red-500' : 'text-gray-600'} />
                </div>
                <span className={item.danger ? 'text-red-500' : 'text-gray-900'}>{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          ))}
        </div>
      </motion.div>

      <TabBar />
    </div>
  );
};

export default ProfilePage;
