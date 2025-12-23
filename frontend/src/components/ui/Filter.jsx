// frontend/src/components/ui/Filter.jsx
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    onSearch?.({
      plate,
      location,
      vehicleType,
      startDate,
      endDate
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* เปลี่ยน flex → flex-wrap เพื่อไม่ให้ดัน layout ทั้งหน้า */}
      <div className="flex flex-wrap items-center gap-3 w-full">

        <FaSearch className="w-5 h-5 text-gray-500 flex-shrink-0" />

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
            <option value="truck">รถบรรทุก</option>
            <option value="car">รถยนต์</option>
            <option value="motorcycle">รถจักรยานยนต์</option>
          </select>
        )}

        {showDateRange && (
          <>
            <select
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[200px] focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Date</option>
              <option value="2025-01-24">24/01/2025</option>
              <option value="2025-01-23">23/01/2025</option>
            </select>

            <select
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[200px] focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Date</option>
              <option value="2025-01-24">24/01/2025</option>
              <option value="2025-01-23">23/01/2025</option>
            </select>
          </>
        )}

        <button
          onClick={handleSearch}
          className="bg-green-700 text-white px-6 py-2 rounded text-sm hover:bg-green-800 flex-shrink-0"
        >
          ค้นหา
        </button>
      </div>

    </div>
  );
};
