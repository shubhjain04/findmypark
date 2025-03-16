
import React from 'react';
import { MapPin, Navigation, Bell, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const TabBar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const tabs = [
    { name: 'Map', path: '/', icon: MapPin },
    { name: 'Directions', path: '/directions', icon: Navigation },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  const getActiveTabIndex = () => {
    const index = tabs.findIndex(tab => tab.path === pathname);
    return index >= 0 ? index : 0;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 shadow-sm z-20">
      <div className="relative w-full max-w-screen-md mx-auto h-full">
        {/* Indicator */}
        <motion.div
          className="tab-indicator"
          style={{ width: '10%' }}
          animate={{ 
            left: `${getActiveTabIndex() * 25 + 12.5}%`,
            width: '10%'
          }}
        />
        
        <div className="flex h-full">
          {tabs.map((tab, index) => {
            const isActive = tab.path === pathname;
            const IconComponent = tab.icon;
            
            return (
              <Link
                key={tab.name}
                to={tab.path}
                className="flex-1 flex flex-col items-center justify-center"
              >
                <motion.div
                  className="flex flex-col items-center justify-center w-full h-full"
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`mb-0.5 ${isActive ? 'text-park-teal' : 'text-gray-400'}`}>
                    <IconComponent size={20} />
                  </div>
                  <span className={`text-xs font-medium ${isActive ? 'text-park-teal' : 'text-gray-400'}`}>
                    {tab.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabBar;
