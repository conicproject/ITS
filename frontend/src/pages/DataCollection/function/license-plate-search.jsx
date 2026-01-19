import React, { useState } from 'react';
import { Filter } from '../../../components/ui/Filter';
import { ViolationList } from '../../../components/ui/ViolationList';
import { MapSidebar } from '../../../components/ui/MapSidebar';
import { FaTimes, FaFilter, FaChevronUp, FaChevronDown, FaCar, FaDatabase } from 'react-icons/fa';

/**
 * หน้าบันทึกการจราจร (Traffic Log)
 * แสดงรายการรถทุกคันที่ผ่านกล้อง (ทั้งปกติและผิดกฎหมาย)
 */
const TrafficLog = () => {
  // --- States ---
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // --- Mock Data (รายการรถที่ผ่านกล้อง) ---
  const [vehicles, setVehicles] = useState([
    {
      lpr: '1กข-1111',
      camera: 'CAM-001',
      type: 'รถยนต์',
      time: '2025-01-24 14:25:30',
      status: 'ปกติ',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'ขับขี่ปกติ (ความเร็ว 60 กม./ชม.)',
      position: [13.7763, 100.5718]
    },
    {
      lpr: '2คง-2222',
      camera: 'CAM-002',
      type: 'รถกระบะ',
      time: '2025-01-24 14:25:15',
      status: 'ปกติ',
      location: 'แยกพระราม 9',
      detail: 'ขับขี่ปกติ (ความเร็ว 55 กม./ชม.)',
      position: [13.7576, 100.5654]
    },
    {
      lpr: '3จฉ-3333',
      camera: 'CAM-001',
      type: 'รถตู้',
      time: '2025-01-24 14:24:50',
      status: 'ปกติ',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'ขับขี่ปกติ (ความเร็ว 70 กม./ชม.)',
      position: [13.7763, 100.5718]
    },
    {
      lpr: '4ชซ-4444',
      camera: 'CAM-003',
      type: 'รถจักรยานยนต์',
      time: '2025-01-24 14:24:10',
      status: 'ปกติ',
      location: 'ถนนวิภาวดี',
      detail: 'สวมหมวกนิรภัยครบถ้วน',
      position: [13.8050, 100.5560]
    },
    {
      lpr: '5ฌญ-5555',
      camera: 'CAM-002',
      type: 'รถยนต์ไฟฟ้า',
      time: '2025-01-24 14:23:45',
      status: 'ปกติ',
      location: 'แยกพระราม 9',
      detail: 'ขับขี่ปกติ (ความเร็ว 45 กม./ชม.)',
      position: [13.7576, 100.5654]
    },
    {
      lpr: '6ฎฏ-6666',
      camera: 'CAM-001',
      type: 'รถแท็กซี่',
      time: '2025-01-24 14:23:00',
      status: 'ปกติ',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'รถว่าง (ไม่ได้รับผู้โดยสาร)',
      position: [13.7763, 100.5718]
    },
    {
      lpr: '7ฐฑ-7777',
      camera: 'CAM-004',
      type: 'รถเมล์',
      time: '2025-01-24 14:22:20',
      status: 'ปกติ',
      location: 'ป้ายรถเมล์รัชดา',
      detail: 'เข้าจอดป้ายเรียบร้อย',
      position: [13.7650, 100.5700]
    },
    {
      lpr: '8ฒณ-8888',
      camera: 'CAM-001',
      type: 'รถยนต์',
      time: '2025-01-24 14:21:55',
      status: 'ปกติ',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'ขับขี่ปกติ (ความเร็ว 65 กม./ชม.)',
      position: [13.7763, 100.5718]
    }
  ]);

  // --- Handlers ---
  const handleSearch = (searchParams) => {
    console.log('Search params:', searchParams);
  };

  const handleSelectVehicle = (vehicle) => {
    if (window.innerWidth < 1024) {
        setSelectedVehicle(vehicle);
    } else {
        console.log('Desktop select:', vehicle.lpr);
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
        setSelectedVehicle(null);
        setIsClosing(false);
    }, 300);
  };

  // Mapper ข้อมูลสำหรับ MapSidebar
  const getMapData = (vehicle) => {
    if (!vehicle) return {};
    return {
        plateNumber: vehicle.lpr,
        province: "กรุงเทพมหานคร",
        violationCount: 0, // รถทั่วไป ไม่มีประวัติผิดกฎหมาย
        status: "บันทึกเข้าระบบ (Recorded)",
        reason: vehicle.detail,
        latestCamera: vehicle.camera,
        latestTime: vehicle.time,
        latestLocation: vehicle.location,
        position: vehicle.position || [13.7563, 100.5018]
    };
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden relative font-sans">
      
      {/* --- MOBILE MODAL (Slide Up/Down) --- */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-[100] lg:hidden flex flex-col items-end justify-end sm:items-center sm:justify-center">
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
                    isClosing ? 'opacity-0' : 'opacity-100'
                }`}
                onClick={handleCloseModal}
            ></div>
            
            {/* Modal Card */}
            <div className={`
                relative w-full h-[90vh] sm:h-[85vh] sm:w-[90%] sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden 
                ${isClosing ? 'animate-slide-down-mobile' : 'animate-slide-up-mobile'}
            `}>
                <div className="flex justify-between items-center px-4 py-3 border-b shrink-0 bg-white">
                    <h3 className="font-bold text-gray-800 text-lg">รายละเอียดการจราจร</h3>
                    <button 
                        onClick={handleCloseModal}
                        className="p-2 bg-gray-50 rounded-full border border-gray-100 text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="flex-1 overflow-hidden relative bg-gray-50">
                     {/* สามารถส่ง enableSequence={true} ได้หากต้องการดูเส้นทางของรถคันนี้ */}
                     <MapSidebar data={getMapData(selectedVehicle)} enableSequence={true} />
                </div>
            </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="w-full mx-auto p-4 md:p-6 flex flex-col h-full max-w-[1600px]">

        {/* 1. Header & Toggle (Blue Theme) */}
        <div className="mb-4 shrink-0 flex items-center justify-between z-10">
            <div className="flex items-center gap-3 text-blue-600">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-[3px] border-blue-600 flex items-center justify-center shrink-0 shadow-sm bg-white">
                <FaDatabase className="text-sm" />
              </div>
              <h1 className="text-lg md:text-2xl font-black text-gray-800 line-clamp-1 tracking-tight">บันทึกการจราจร (Traffic Log)</h1>
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

        {/* 2. Filter Section */}
        <div className={`
            shrink-0 transition-all duration-300 ease-in-out overflow-hidden z-30
            ${showFilter ? 'max-h-[500px] opacity-100 mb-1' : 'max-h-0 opacity-0 mb-0 lg:max-h-none lg:opacity-100 lg:mb-1 lg:overflow-visible'}
        `}>
            <div className="p-1">
                {/* ใช้ type="license" เพื่อให้มีช่องค้นหาทะเบียน */}
                <Filter 
                    type="license" 
                    onSearch={handleSearch} 
                    placeholder="ค้นหาทะเบียน/หมายเลขข้างรถ..." 
                    showDateRange={true} 
                />
            </div>
        </div>

        {/* 3. Layout Content */}
        <div className="flex flex-1 gap-5 md:gap-8 overflow-hidden relative z-0">
          
          {/* Left: Vehicle List (แสดงรถทุกคัน) */}
          <div className="flex-1 min-w-0 h-full">
            <ViolationList
              title="รถที่ผ่านจุดตรวจล่าสุด"
              violations={vehicles}
              type="traffic" // ใช้ type ใหม่ หรือใช้ 'lprsearch' ก็ได้ แต่ 'traffic' สื่อความหมายดีกว่า
              timeRange="Real-time Feed"
              onSelectViolation={handleSelectVehicle}
            />
          </div>
          
          {/* Right: Sidebar (Desktop Only) */}
          <div className="hidden lg:block flex-none w-[400px] xl:w-[500px] 2xl:w-[600px]">
            {/* แสดงข้อมูลตัวแรกเป็น Default */}
            <MapSidebar data={getMapData(vehicles[0])} enableSequence={false} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrafficLog;