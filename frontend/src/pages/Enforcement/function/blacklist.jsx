// frontend/src/pages/Enforcement/function/blacklist.jsx
import React, { useState } from 'react';
import { Filter } from '../../../components/ui/Filter';
import { ViolationList } from '../../../components/ui/ViolationList';
import { MapSidebar } from '../../../components/ui/MapSidebar';

/**
 * หน้าระบบตรวจจับความเร็ว
 */
const EnforcementBlacklist = () => {
  const [violations, setViolations] = useState([
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: ' รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: ' รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: ' รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: ' รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
    {
      lpr: '1กก-1234',
      camera: 'CAM-002',
      type: 'รถยนต์',
      date: '2025-01-24 14:25',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: ' รถยนต์สีแดง ทะเบียน 1กก-1234 ใช้ความเร็วเกินกำหนด',
    },
  ]);

  const handleSearch = (searchParams) => {
    console.log('Search params:', searchParams);
    // TODO: เรียก API หรือ filter ข้อมูลตาม searchParams
  };

  const sidebarStats = {
    totalDays: 3,
    hasViolation: true,
    violations: [
      { camera: 'CAM-002', datetime: '2025-01-24 08:01', type: 'ฝ่าฝืนจราจร' }
    ]
  };

  return (
    <div className="fix-function-page-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <div className="w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center">
              <span className="text-xs">!</span>
            </div>
            <span className="text-sm">
              ระบบตรวจจับการฝ่าสัญญาณไฟ
            </span>
          </div>
        </div>

        {/* Search Bar - เต็มความกว้างด้านบนสุด */}
        <Filter
          onSearch={handleSearch}
          placeholder="ค้นหาเลขทะเบียน"
          showDateRange={true}
        />

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="col-span-2">
            <ViolationList
              title="รายการ"
              violations={violations}
              type="redlight"
            />
          </div>

          {/* Sidebar - 1 column */}
          <div>
            <MapSidebar
              cameraId="1xn-2345"
              position={[13.7563, 100.5018]} // ตำแหน่ง Bangkok
              stats={sidebarStats}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnforcementBlacklist;