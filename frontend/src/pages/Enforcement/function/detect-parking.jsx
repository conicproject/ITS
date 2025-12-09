// frontend/src/pages/Enforcement/function/detect-parking.jsx
import React, { useState } from 'react';
import { Filter } from '../../../components/ui/Filter';
import { ViolationList } from '../../../components/ui/ViolationList';
import { MapSidebar } from '../../../components/ui/MapSidebar';
import { FilterConfig } from '../../../config/FilterConfig';

/**
 * หน้าระบบตรวจจับรถจอดผิดกฎหมาย
 */
const DetectParking = () => {
  const [violations, setViolations] = useState([
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'รถยนต์สีแดง ทะเบียน 1กก-1234 จอดผิดกฎหมาย',
    },
    // ... เพิ่ม dummy data
  ]);

  const handleSearch = (searchParams) => {
    console.log('Search params:', searchParams);
  };

  const sidebarStats = {
    totalDays: 3,
    hasViolation: true,
    violations: [
      { camera: 'CAM-002', datetime: '2025-01-24 08:01', type: 'จอดผิดกฎหมาย' }
    ]
  };

  // Filter type ตรงกับ violationConfigs
  const filterType = "parking";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <div className="w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center">
              <span className="text-xs">!</span>
            </div>
            <span className="text-sm">ระบบตรวจจับรถจอดผิดกฎหมาย</span>
          </div>
        </div>

        {/* Filter */}
        <Filter type={filterType} onSearch={handleSearch} />

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="col-span-2">
            <ViolationList
              title="รายการรถจอดผิดกฎหมาย"
              violations={violations}
              type="parking"
            />
          </div>
          <div>
            <MapSidebar
              cameraId={violations[0]?.camera || ""}
              position={[13.7563, 100.5018]}
              stats={sidebarStats}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectParking;
