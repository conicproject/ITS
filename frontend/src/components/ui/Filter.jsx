import React, { useState } from "react";
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaCar, 
  FaRedo,
  FaCalendarAlt 
} from "react-icons/fa";

export const Filter = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    lpr: "",
    location: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  const vehicleTypes = [
    "รถยนต์",
    "รถกระบะ",
    "รถตู้",
    "จักรยานยนต์",
    "รถบรรทุก",
    "รถยนต์ไฟฟ้า",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const handleReset = () => {
    const resetState = {
      lpr: "",
      location: "",
      type: "",
      startDate: "",
      endDate: "",
    };
    setFilters(resetState);
    onSearch?.(resetState);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 w-full">
      
      {/* --- Header --- */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-green-50 rounded-lg text-green-600">
          <FaSearch className="w-4 h-4" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 tracking-tight">
          ค้นหาป้ายทะเบียน
        </h2>
      </div>

      {/* --- Inputs Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        
        {/* 1. ทะเบียนรถ */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
            <FaSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            name="lpr"
            value={filters.lpr}
            onChange={handleChange}
            placeholder="ทะเบียนรถ..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all"
          />
        </div>

        {/* 2. จุดติดตั้ง */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
            <FaMapMarkerAlt className="w-4 h-4" />
          </div>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="จุดติดตั้ง..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all"
          />
        </div>

        {/* 3. ประเภทรถ */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
            <FaCar className="w-4 h-4" />
          </div>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 appearance-none focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 cursor-pointer transition-all"
          >
            <option value="">ทุกประเภทรถ</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {/* Custom Select Chevron */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 4. ช่วงวันที่ (Start - End) */}
        <div className="group flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-500/10 focus-within:border-green-500 transition-all overflow-hidden md:col-span-2 xl:col-span-1">
          <FaCalendarAlt className="text-gray-400 w-4 h-4 shrink-0 group-focus-within:text-green-600 transition-colors" />
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="flex-1 min-w-0 bg-transparent text-sm text-gray-600 focus:outline-none py-1.5 cursor-pointer"
          />
          <span className="text-gray-400 text-xs font-medium">ถึง</span>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="flex-1 min-w-0 bg-transparent text-sm text-gray-600 focus:outline-none py-1.5 cursor-pointer"
          />
        </div>

        {/* --- Buttons --- */}
        <div className="flex gap-3 md:col-span-2 xl:col-span-1">
          <button
            onClick={handleSearch}
            className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm shadow-green-600/20"
          >
            <FaSearch className="w-3.5 h-3.5" />
            ค้นหา
          </button>
          
          <button
            onClick={handleReset}
            className="flex-none px-4 bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center"
            title="ล้างค่าฟิลเตอร์"
          >
            <FaRedo className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};