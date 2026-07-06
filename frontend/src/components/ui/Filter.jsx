// frontend/src/components/ui/Filter.jsx
import React, { useState } from 'react';
import { FaSearch, FaCalendar } from 'react-icons/fa';
import { FilterConfig } from '../../config/FilterConfig';

export const Filter = ({ type = "license", onSearch }) => {
  const config = FilterConfig[type] || {};
  const showPlate         = config.showPlate         ?? false;
  const showLocation      = config.showLocation      ?? false;
  const showVehicleType   = config.showVehicleType   ?? false;
  const showViolationType = config.showViolationType ?? false;
  const showDateRange     = config.showDateRange     ?? false;

  const todayStr = new Date().toISOString().split('T')[0];

  const [plate,         setPlate]         = useState("");
  const [location,      setLocation]      = useState("");
  const [vehicleType,   setVehicleType]   = useState("");
  const [violationType, setViolationType] = useState("");
  const [date,          setDate]          = useState(todayStr);

  const handleSearch = () => {
    const startDate = date ? `${date}T00:00:00` : undefined;
    const endDate   = date ? `${date}T23:59:59` : undefined;
    onSearch?.({ plate, location, vehicleType, violationType, startDate, endDate });
  };

  const handleReset = () => {
    setPlate(""); setLocation(""); setVehicleType(""); setViolationType(""); setDate(todayStr);
    onSearch?.({
      startDate: `${todayStr}T00:00:00`,
      endDate:   `${todayStr}T23:59:59`,
    });
  };

  return (
    <div className="rounded-lg shadow-sm p-4 mb-4">
      <div className="flex flex-wrap items-center gap-3 w-full">
        <FaSearch className="w-5 h-5 text-gray-500 flex-shrink-0" />

        {showDateRange && (
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <FaCalendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={todayStr}
              className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-green-500 text-white"
            />
          </div>
        )}

        {showPlate && (
          <input
            type="text"
            placeholder={config.placeholder ?? "ค้นหา"}
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[200px] focus:ring-2 focus:ring-green-500"
          /> 
        )}

        {showLocation && (
          <input
            type="text"
            placeholder={config.placeholderLocation ?? "ค้นหาจุดติดตั้ง"}
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
            <option value="SUVMPV">SUV / MPV</option>
          </select>
        )}

        {showViolationType && (
          <select
            value={violationType}
            onChange={(e) => setViolationType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[220px] focus:ring-2 focus:ring-green-500"
          >
            <option value="">เลือกประเภทความผิด</option>
            <option value="1625">ตรวจจับไม่สวมหมวกนิรภัย (รถจักรยานยนต์)</option>
            <option value="1626">ตรวจจับขับรถย้อนศร</option>
            <option value="1627">ตรวจจับขับรถทับเส้นจราจร</option>
            <option value="1628">ตรวจจับการหยุดรถในเขตห้ามหยุด</option>
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