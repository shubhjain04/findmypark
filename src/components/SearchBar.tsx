
import React, { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <motion.div 
      className="relative w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={`relative flex items-center rounded-full shadow-sm bg-white 
          transition-all duration-200 ${isFocused ? 'shadow-md ring-2 ring-park-teal/20' : ''}`}
      >
        <div className="absolute left-3 text-gray-400">
          <MapPin size={18} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter any building name"
          className="w-full py-3 pl-10 pr-10 text-sm border-none rounded-full focus:outline-none bg-transparent"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-11 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
        
        <button
          onClick={handleSearch}
          className="absolute right-3 w-7 h-7 flex items-center justify-center bg-park-teal rounded-full text-white transition-transform active:scale-95"
        >
          <Search size={15} />
        </button>
      </div>
      
      {isFocused && (
        <motion.div 
          className="absolute w-full mt-2 p-2 bg-white rounded-xl shadow-md border border-gray-100 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="text-xs font-medium text-gray-500 mb-2 px-2">Recent Searches</div>
          {['MacKinnon Hall', 'Glass Bowl Stadium', 'Student Union', 'Engineering Building'].map((item, index) => (
            <div 
              key={index}
              className="flex items-center px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => {
                setQuery(item);
                handleSearch();
              }}
            >
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <MapPin size={14} className="text-gray-500" />
              </div>
              <div className="text-sm text-gray-800">{item}</div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchBar;
