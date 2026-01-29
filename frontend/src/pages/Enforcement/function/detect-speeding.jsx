import React, { useState } from 'react';
import { Filter } from '../../../components/ui/Filter';
import { ViolationList } from '../../../components/ui/ViolationList';
import { MapSidebar } from '../../../components/ui/MapSidebar';
import { FaTimes, FaFilter, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const DetectSpeeding = () => {
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [showFilter, setShowFilter] = useState(false); 

  // Mock Data
  const mockViolations = [
    { lpr: '1กก-1234', camera: 'CAM-001', type: 'รถยนต์', time: '2025-01-24 14:25', status: 'สูง', location: 'แยกรัชดา-ห้วยขวาง', detail: 'ขับเร็ว 120 กม./ชม.', position: [13.7763, 100.5718] },
    { lpr: '2ขข-5678', camera: 'CAM-002', type: 'รถกระบะ', time: '2025-01-24 14:20', status: 'ปานกลาง', location: 'แยกพระราม 9', detail: 'ขับเร็ว 105 กม./ชม.', position: [13.7576, 100.5654] },
    { lpr: '3คค-9999', camera: 'CAM-003', type: 'รถตู้', time: '2025-01-24 14:15', status: 'สูง', location: 'ทางด่วนขั้นที่ 2', detail: 'ขับเร็ว 135 กม./ชม.', position: [13.7468, 100.5349] },
    { lpr: '4งง-1010', camera: 'CAM-001', type: 'จักรยานยนต์', time: '2025-01-24 14:10', status: 'สูง', location: 'แยกรัชดา-ห้วยขวาง', detail: 'ไม่สวมหมวกนิรภัย', position: [13.7763, 100.5718] },
    { lpr: '5จจ-2020', camera: 'CAM-004', type: 'รถบรรทุก', time: '2025-01-24 14:05', status: 'ต่ำ', location: 'ถนนวิภาวดี', detail: 'ขับเร็ว 95 กม./ชม.', position: [13.8082, 100.5578] },
    { lpr: '6ฉฉ-3030', camera: 'CAM-002', type: 'รถยนต์', time: '2025-01-24 13:55', status: 'ปานกลาง', location: 'แยกพระราม 9', detail: 'เปลี่ยนช่องทางกะทันหัน', position: [13.7576, 100.5654] },
    { lpr: '7ชช-4040', camera: 'CAM-003', type: 'รถยนต์ไฟฟ้า', time: '2025-01-24 13:45', status: 'สูง', location: 'ทางด่วนขั้นที่ 2', detail: 'ขับเร็ว 140 กม./ชม.', position: [13.7468, 100.5349] },
    { lpr: '8ซซ-5050', camera: 'CAM-001', type: 'รถยนต์', time: '2025-01-24 13:30', status: 'ต่ำ', location: 'แยกรัชดา-ห้วยขวาง', detail: 'จอดล้ำเส้นหยุด', position: [13.7763, 100.5718] },
  ];
  const [violations, setViolations] = useState(mockViolations);

  const handleSearch = (params) => console.log(params);

  // --- จุดที่แก้ไข 1: อัปเดต State เสมอ (ไม่ต้องเช็คขนาดจอ) ---
  const handleSelectViolation = (violation) => {
    setSelectedViolation(violation);
    // Modal ของ Mobile จะไม่โผล่มากวนใจบน Desktop เพราะใน div modal มี class 'lg:hidden' ดักไว้แล้วครับ
  };

  const getMapData = (violation) => {
    if (!violation) return {};
    return {
        plateNumber: violation.lpr,
        province: "กรุงเทพมหานคร",
        violationCount: 3,
        status: "ความเร็วเกินกำหนด",
        reason: violation.detail,
        latestCamera: violation.camera,
        latestTime: violation.time,
        latestLocation: violation.location,
        position: violation.position
    };
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden relative font-sans">
      
      {/* --- MOBILE MODAL --- */}
      {selectedViolation && (
        <div className="fixed inset-0 z-[100] lg:hidden flex flex-col items-end justify-end sm:items-center sm:justify-center">
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={() => setSelectedViolation(null)}
            ></div>
            
            <div className="relative w-full h-[90vh] sm:h-[85vh] sm:w-[90%] sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up-mobile">
                <div className="flex justify-between items-center px-4 py-3 border-b shrink-0 bg-white">
                    <h3 className="font-bold text-gray-800 text-lg">รายละเอียด</h3>
                    <button 
                        onClick={() => setSelectedViolation(null)}
                        className="p-2 bg-gray-50 rounded-full border border-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden relative bg-gray-50">
                     <MapSidebar data={getMapData(selectedViolation)} />
                </div>
            </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="w-full mx-auto p-4 md:p-6 flex flex-col h-full max-w-[1600px]">

        {/* Header */}
        <div className="mb-4 shrink-0 flex items-center justify-between z-10">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-[3px] border-red-600 flex items-center justify-center shrink-0 shadow-sm bg-white">
                <span className="text-sm font-black">!</span>
              </div>
              <h1 className="text-lg md:text-2xl font-black text-gray-800 line-clamp-1 tracking-tight">ตรวจจับความเร็ว</h1>
            </div>

            <button 
                onClick={() => setShowFilter(!showFilter)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-bold active:scale-95 transition-all text-gray-600 hover:text-blue-600 hover:border-blue-200"
            >
                <FaFilter className={showFilter ? 'text-blue-600' : 'text-gray-400'} />
                <span>{showFilter ? 'ซ่อน' : 'ตัวกรอง'}</span>
                {showFilter ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
            </button>
        </div>

        {/* --- Filter Section --- */}
        <div className={`
            shrink-0 transition-all duration-300 ease-in-out overflow-hidden z-30
            ${showFilter ? 'max-h-[500px] opacity-100 mb-1' : 'max-h-0 opacity-0 mb-0 lg:max-h-none lg:opacity-100 lg:mb-[0.01px] lg:overflow-visible'}
        `}>
            <div className="p-1">
                <Filter
                    type="speed"
                    onSearch={handleSearch}
                    placeholder="ค้นหาเลขทะเบียน..."
                    showDateRange={true}
                />
            </div>
        </div>

        {/* List Content */}
        <div className="flex flex-1 gap-5 md:gap-8 overflow-hidden relative z-0">
          <div className="flex-1 min-w-0 h-full">
            <ViolationList
              title="รายการล่าสุด"
              violations={violations}
              timeRange="วันนี้ (Real-time)"
              onSelectViolation={handleSelectViolation}
            />
          </div>
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block flex-none w-[400px] xl:w-[500px] 2xl:w-[600px]">
             {/* --- จุดที่แก้ไข 2: ให้ Sidebar ใช้ selectedViolation หรือถ้าไม่มีให้ใช้ตัวแรก --- */}
            <MapSidebar data={getMapData(selectedViolation || violations[0])} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectSpeeding;