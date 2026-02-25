import React, { useState } from "react";
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaCar, 
  FaRedo 
} from "react-icons/fa";

export const Filter = ({ onSearch }) => {
  // State สำหรับเก็บค่าการค้นหา
  const [filters, setFilters] = useState({
    lpr: "",        // ทะเบียน
    location: "",   // จุดติดตั้ง
    type: "",       // ประเภทรถ
    startDate: "",  // วันเริ่มต้น
    endDate: "",    // วันสิ้นสุด
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 w-full">
      
      {/* --- Header --- */}
      <div className="flex items-center gap-2 mb-4 text-gray-800">
        <FaSearch className="w-4 h-4 text-gray-500" />
        <h2 className="text-base font-bold">ค้นหาป้ายทะเบียน</h2>
      </div>

      {/* --- Inputs Row --- */}
      <div className="flex flex-col lg:flex-row items-stretch gap-3">
        
        {/* 1. ทะเบียนรถ (มีไอคอนข้างใน) */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
            <FaSearch />
          </div>
          <input
            type="text"
            name="lpr"
            value={filters.lpr}
            onChange={handleChange}
            placeholder="ค้นหาป้ายทะเบียน"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 2. จุดติดตั้ง (มีไอคอนข้างใน) */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
            <FaMapMarkerAlt />
          </div>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="ค้นหาจุดติดตั้ง"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 3. ประเภทรถ */}
        <div className="relative flex-1 lg:max-w-[180px] group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
            <FaCar />
          </div>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer transition-all"
          >
            <option value="">ทุกประเภทรถ</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* 4. ช่วงวันที่ (Start - End) */}
        <div className="flex items-center gap-2 w-full lg:w-auto bg-gray-50 border border-gray-300 rounded-lg px-2 lg:px-3 py-1">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="flex-1 lg:w-32 bg-transparent text-sm text-gray-600 focus:outline-none py-1.5 cursor-pointer"
          />
          <span className="text-gray-400 text-xs whitespace-nowrap px-1">ถึง</span>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="flex-1 lg:w-32 bg-transparent text-sm text-gray-600 focus:outline-none py-1.5 cursor-pointer"
          />
        </div>

        {/* --- Buttons --- */}
        <div className="flex gap-2 w-full lg:w-auto">
          <button
            onClick={handleSearch}
            className="flex-1 lg:flex-none bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
          >
            <FaSearch className="w-3 h-3" />
            ค้นหา
          </button>
          
          <button
            onClick={handleReset}
            className="lg:hidden bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center border border-gray-200"
            title="ล้างค่า"
          >
            <FaRedo className="w-3.5 h-3.5" />
          </button>
           {/* Desktop Reset Button (Optional: Small icon) */}
           <button
            onClick={handleReset}
            className="hidden lg:flex items-center justify-center w-10 bg-white border border-gray-300 text-gray-400 hover:text-green-600 hover:border-green-600 rounded-lg transition-all"
            title="ล้างค่า"
          >
            <FaRedo className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};