// frontend/src/pages/Enforcement/function/detect-speeding.jsx
import React, { useState } from 'react';
import { SearchBar } from '../../../components/ui/SearchBar';
import { ViolationList } from '../../../components/ui/ViolationList';
import { MapSidebar } from '../../../components/ui/MapSidebar';

/**
 * หน้าระบบตรวจจับความเร็ว
 */
const DetectSpeeding = () => {
  const [violations, setViolations] = useState([
    {
      round: '1xn-1234',
      camera: 'กล้อง4',
      status: 'รอชำระ',
      licensePlate: '2025-01-24 14:15',
      datetime: '2025-01-24 14:15',
      location: 'CAM-002',
      exitLocation: 'CAM-002',
      time: '23-07-2545 E:38',
      additionalInfo: 'คำอธิบาย: ข้อมูลเพิ่มเติม Stat 1234 ความเร็วเกินกำหนด'
    },
    {
      round: '1xn-1234',
      camera: 'กล้อง4',
      status: 'รอชำระ',
      licensePlate: '2025-01-24 14:15',
      datetime: '2025-01-24 14:15',
      location: 'CAM-002',
      exitLocation: 'CAM-002',
      time: '23-07-2545 E:38'
    },
    {
      round: '1xn-1234',
      camera: 'กล้อง4',
      status: 'รอชำระ',
      licensePlate: '2025-01-24 14:31',
      datetime: '2025-01-24 14:31',
      location: 'CAM-002',
      exitLocation: 'CAM-002',
      time: '23-07-2545 E:38'
    },
    {
      round: '1xn-1234',
      camera: 'กล้อง4',
      status: 'รอชำระ',
      licensePlate: '2025-01-24 14:33',
      datetime: '2025-01-24 14:33',
      location: 'CAM-002',
      exitLocation: 'CAM-002',
      time: '23-07-2545 E:38'
    },
    {
      round: '1xn-1234',
      camera: 'กล้อง4',
      status: 'รอชำระ',
      licensePlate: '2025-01-24 14:35',
      datetime: '2025-01-24 14:35',
      location: 'CAM-002',
      exitLocation: 'CAM-002',
      time: '23-07-2545 E:38',
      additionalInfo: 'คำอธิบาย: ข้อมูลเพิ่มเติม Stat 1234 ความเร็วเกินกำหนด'
    }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <div className="w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center">
              <span className="text-xs">!</span>
            </div>
            <span className="text-sm">
              ระบบตรวจจับการฝ่าฝืนที่ความเร็วเกินกำหนด
            </span>
          </div>
          <div className="text-sm text-gray-500">
            วันจันทร์ที่ 24 November 2568
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="col-span-2">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="ค้นหาเลขทะเบียน"
            />
            
            <ViolationList
              title="รายการ"
              violations={violations}
              type="enforcement"
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

export default DetectSpeeding;
