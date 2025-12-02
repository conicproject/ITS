import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

/**
 * Component แถบค้นหา
 * @param {Function} onSearch - callback เมื่อกดค้นหา
 * @param {string} placeholder - ข้อความ placeholder
 */
export const Filter = ({ 
  onSearch, 
  placeholder = "ค้นหาเลขทะเบียน",
  showDateRange = true 
}) => {
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        searchText,
        startDate,
        endDate
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center gap-3">
        <FaSearch className="w-5 h-5 text-gray-400" />
        
        <input
          type="text"
          placeholder={placeholder}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        {showDateRange && (
          <>
            <select 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Date</option>
              <option value="2025-01-24">24/01/2025</option>
              <option value="2025-01-23">23/01/2025</option>
            </select>
            
            <select 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Date</option>
              <option value="2025-01-24">24/01/2025</option>
              <option value="2025-01-23">23/01/2025</option>
            </select>
          </>
        )}
        
        <button 
          onClick={handleSearch}
          className="bg-green-700 text-white px-6 py-2 rounded text-sm hover:bg-green-800 transition-colors whitespace-nowrap"
        >
          ค้นหา
        </button>
      </div>
    </div>
  );
};