
import React, { useState } from 'react';
import TabBar from '@/components/TabBar';
import { Bell, Clock, X, Check, MapPin, AlertCircle, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([
    { 
      id: 1, 
      type: 'availability', 
      title: 'Lot 13N is now available',
      message: '5 new spaces were just freed up',
      time: '2 min ago',
      read: false
    },
    { 
      id: 2, 
      type: 'reminder', 
      title: 'Parking expires soon',
      message: 'Your parking in Lot 16 expires in 15 minutes',
      time: '15 min ago',
      read: true
    },
    { 
      id: 3, 
      type: 'traffic', 
      title: 'Heavy traffic alert',
      message: 'Delays expected on Campus Drive towards Lot 17',
      time: '30 min ago',
      read: true
    }
  ]);

  const [settings, setSettings] = useState({
    availabilityAlerts: true,
    parkingReminders: true,
    trafficUpdates: true,
    notificationSound: false
  });

  const markAsRead = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'availability': return <MapPin className="text-emerald-500" />;
      case 'reminder': return <Clock className="text-amber-500" />;
      case 'traffic': return <AlertCircle className="text-red-500" />;
      default: return <Bell className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium">Notifications</h1>
          <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white mt-2 p-4 shadow-sm">
        <h2 className="font-medium mb-3">Alert Settings</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-park-teal" />
              <span className="text-sm">Availability Alerts</span>
            </div>
            <Switch 
              checked={settings.availabilityAlerts} 
              onCheckedChange={(checked) => setSettings({...settings, availabilityAlerts: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock size={16} className="mr-2 text-park-teal" />
              <span className="text-sm">Parking Reminders</span>
            </div>
            <Switch 
              checked={settings.parkingReminders} 
              onCheckedChange={(checked) => setSettings({...settings, parkingReminders: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle size={16} className="mr-2 text-park-teal" />
              <span className="text-sm">Traffic Updates</span>
            </div>
            <Switch 
              checked={settings.trafficUpdates} 
              onCheckedChange={(checked) => setSettings({...settings, trafficUpdates: checked})}
            />
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="mt-2 px-4 py-2">
        <h2 className="font-medium text-gray-600 mb-2">Recent Alerts</h2>

        <AnimatePresence>
          {alerts.length > 0 ? (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <motion.div 
                  key={alert.id}
                  className={`bg-white rounded-lg border p-3 shadow-sm 
                    ${!alert.read ? 'border-l-4 border-l-park-teal' : 'border-gray-100'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{alert.title}</div>
                        <div className="text-sm text-gray-600 mt-0.5">{alert.message}</div>
                        <div className="text-xs text-gray-400 mt-1">{alert.time}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      {!alert.read && (
                        <button 
                          onClick={() => markAsRead(alert.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteAlert(alert.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="bg-white rounded-lg p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bell size={24} className="text-gray-400" />
                </div>
              </div>
              <h3 className="font-medium text-gray-900">No alerts</h3>
              <p className="text-sm text-gray-600 mt-1">You're all caught up!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TabBar />
    </div>
  );
};

export default AlertsPage;
