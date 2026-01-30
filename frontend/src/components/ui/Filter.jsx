// frontend/src/components/ui/Filter.jsx
import React, { useState } from 'react';
import { FaSearch, FaCalendar } from 'react-icons/fa';
import { FilterConfig } from '../../config/FilterConfig';

export const Filter = ({ type = "license", onSearch }) => {
  const config = FilterConfig[type] || {};
  const showPlate = config.showPlate ?? false;
  const showLocation = config.showLocation ?? false;
  const showVehicleType = config.showVehicleType ?? false;
  const showDateRange = config.showDateRange ?? false;
  const placeholderPlate = config.placeholder ?? "ค้นหา";
  const placeholderLocation = config.placeholderLocation ?? "ค้นหาจุดติดตั้ง";

  const [plate, setPlate] = useState("");
  const [location, setLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [date, setDate] = useState("");

  // 🔹 สร้าง options สำหรับวันที่ย้อนหลัง 7 วัน
  const getDateOptions = () => {
    const options = [{ value: "today", label: "วันนี้" }];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      options.push({ value: dateStr, label });
    }
    
    return options;
  };

  const handleSearch = () => {
    onSearch?.({
      plate,
      location,
      vehicleType,
      date: date || "today"
    });
  };

  const handleReset = () => {
    setPlate("");
    setLocation("");
    setVehicleType("");
    setDate("");
    onSearch?.({ date: "today" });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex flex-wrap items-center gap-3 w-full">
        <FaSearch className="w-5 h-5 text-gray-500 flex-shrink-0" />

        {/* Date Picker - แสดงเสมอ */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <FaCalendar className="w-4 h-4 text-gray-500" />
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-green-500"
          >
            {getDateOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {showPlate && (
          <input
            type="text"
            placeholder={placeholderPlate}
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[200px] focus:ring-2 focus:ring-green-500"
          />
        )}

        {showLocation && (
          <input
            type="text"
            placeholder={placeholderLocation}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[200px] focus:ring-2 focus:ring-green-500"
          />
        )}

        {showVehicleType && (
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[200px] focus:ring-2 focus:ring-green-500"
          >
            <option value="">เลือกประเภทยานพาหนะ</option>
            <option value="twoWheelVehicle">รถจักรยานยนต์</option>
            <option value="vehicle">รถยนต์</option>
            <option value="SUVMPV">SUV/MPV</option>
          </select>
        )}

        <button
          onClick={handleSearch}
          className="bg-green-700 text-white px-6 py-2 rounded text-sm hover:bg-green-800 flex-shrink-0 transition-colors"
        >
          ค้นหา
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-6 py-2 rounded text-sm hover:bg-gray-600 flex-shrink-0 transition-colors"
        >
          รีเซ็ต
        </button>
      </div>
    </div>
  );
};