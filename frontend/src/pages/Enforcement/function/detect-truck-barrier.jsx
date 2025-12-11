// frontend/src/pages/Enforcement/function/detect-truck-barrier.jsx
import React, { useState } from 'react';
import { Filter } from '../../../components/ui/Filter';
import { ViolationList } from '../../../components/ui/ViolationList';
import { MapSidebar } from '../../../components/ui/MapSidebar';

/**
 * หน้าระบบตรวจจับรถบรรทุกในช่วงเวลาห้ามเดินรถ
 */
const DetectTruckBarrier = () => {
  const [violations, setViolations] = useState([
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'No Green List',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: ' รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'Green List',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: ' รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
        {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'No Green List',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: ' รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'Green List',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: ' รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
        {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'No Green List',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: ' รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
  ]);

  const handleSearch = (searchParams) => {
    console.log('Search params:', searchParams);
  };

  const sidebarStats = { totalDays: 3, hasViolation: true, violations: [] };
  const filterType = "barrier";

  return (
    <div className="fix-function-page-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <div className="w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center">
              <span className="text-xs">!</span>
            </div>
            <span className="text-sm">ระบบตรวจจับรถบรรทุกในช่วงห้ามเดินรถ</span>
          </div>
        </div>

        <Filter type={filterType} onSearch={handleSearch} />

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="col-span-2">
            <ViolationList
              title="รายการรถบรรทุกฝ่าฝืน"
              violations={violations}
              type="barrier"
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

export default DetectTruckBarrier;
