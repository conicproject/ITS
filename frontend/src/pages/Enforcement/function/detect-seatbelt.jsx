import React, { useState } from 'react';
import { Filter } from '../../../components/ui/Filter';
import { ViolationList } from '../../../components/ui/ViolationList';
import { MapSidebar } from '../../../components/ui/MapSidebar';

const DetectSeatBelt = () => {
  const [violations, setViolations] = useState([
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
  ]);

  const handleSearch = (searchParams) => {
    console.log('Search params:', searchParams);
  };

  const sidebarStats = {
    totalDays: 3,
    hasViolation: true,
    violations: [
      { camera: 'CAM-002', datetime: '2025-01-24 08:01', type: 'ฝ่าฝืนความเร็ว' }
    ]
  };

  return (
    <div className="fix-function-page-y-auto bg-gray-50">
      <div className="w-full mx-auto p-6">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <div className="w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center">
              <span className="text-xs">!</span>
            </div>
            <span className="text-sm">การไม่คาดเข็มขัดนิรภัย</span>
          </div>
        </div>

        {/* Search Bar */}
        <Filter
          type="speed"
          onSearch={handleSearch}
          placeholder="ค้นหาเลขทะเบียน"
          showDateRange={true}
        />

        {/* MAIN LAYOUT */}
        <div className="flex gap-6 mt-4 overflow-hidden">

          {/* LEFT CONTENT (บีบได้) */}
          <div className="flex-1 min-w-0 overflow-auto">
            <ViolationList
              title="รายการความเร็วเกินกำหนด"
              violations={violations}
              type="speed"
            />
          </div>

          {/* RIGHT SIDEBAR (ห้ามโดนบีบ) */}
          <div className="flex-none w-[320px] shrink-0">
            <MapSidebar
              cameraId={violations[0]?.camera || ''}
              position={[13.7563, 100.5018]}
              stats={sidebarStats}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetectSeatBelt;
