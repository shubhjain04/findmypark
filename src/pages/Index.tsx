
import React, { useState, useEffect } from 'react';
import MapView from '@/components/MapView';
import TabBar from '@/components/TabBar';
import { toast } from "@/components/ui/sonner";
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [selectedLot, setSelectedLot] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast("Welcome to FindMyPark", {
        description: "Find available parking spaces near you.",
        position: "top-center"
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectLot = (lot: any) => {
    setSelectedLot(lot);
    toast(`Selected: ${lot.name}`, {
      description: `${lot.availableSpaces} spaces available`,
      action: {
        label: "Navigate",
        onClick: () => console.log("Navigate to", lot.name)
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-20 h-20 rounded-full border-t-4 border-park-teal border-r-4 border-r-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <motion.p 
              className="mt-4 text-park-teal font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Finding parking spaces...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div 
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-screen pb-16">
              <MapView onSelectLot={handleSelectLot} />
            </div>
            <TabBar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
