import React, { useState } from 'react';
import { Filter } from '../../../components/ui/Filter';
import { ViolationList } from '../../../components/ui/ViolationList';
import { MapSidebar } from '../../../components/ui/MapSidebar';
import { FaTimes, FaFilter, FaChevronUp, FaChevronDown } from 'react-icons/fa';

/**
 * หน้าระบบตรวจจับรถบรรทุก (Barrier / LEZ)
 * - Layout & Spacing เท่ากับ DetectSpeeding
 * - กรองแสดงเฉพาะ "รถบรรทุก"
 * - รองรับ Mobile Popup Slide Up/Down
 */
const DetectTruckBarrier = () => {
  // --- States ---
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // --- Mock Data (รวมรถหลายประเภท) ---
  const [allData, setAllData] = useState([
    {
      lpr: '70-1234',
      camera: 'CAM-LEZ-01',
      type: 'รถบรรทุก 10 ล้อ', // ใช่
      time: '2025-01-24 14:25',
      status: 'No Green List',
      location: 'เขตปทุมวัน (LEZ)',
      detail: 'เครื่องยนต์ดีเซล (ไม่ผ่านการลงทะเบียน)',
      fuelType: 'Diesel',
      position: [13.7468, 100.5349]
    },
    {
      lpr: '71-5678',
      camera: 'CAM-LEZ-01',
      type: 'รถบรรทุก 6 ล้อ', // ใช่
      time: '2025-01-24 14:30',
      status: 'Green List',
      location: 'เขตปทุมวัน (LEZ)',
      detail: 'รถยนต์ไฟฟ้า (EV) - ได้รับยกเว้น',
      fuelType: 'Electric (EV)',
      position: [13.7576, 100.5654]
    },
    {
      lpr: '15-9999',
      camera: 'CAM-LEZ-02',
      type: 'รถโดยสาร', // ไม่ใช่รถบรรทุก (จะถูกกรองออก)
      time: '2025-01-24 14:35',
      status: 'No Green List',
      location: 'แยกราชประสงค์',
      detail: 'ควันดำเกินมาตรฐาน',
      fuelType: 'Diesel',
      position: [13.7443, 100.5405]
    },
    {
      lpr: '73-3456',
      camera: 'CAM-LEZ-01',
      type: 'รถบรรทุก NGV', // ใช่
      time: '2025-01-24 15:00',
      status: 'Green List',
      location: 'เขตปทุมวัน (LEZ)',
      detail: 'รถใช้ก๊าซ NGV - เป็นมิตรต่อสิ่งแวดล้อม',
      fuelType: 'NGV',
      position: [13.7763, 100.5718]
    },
    {
      lpr: '74-7890',
      camera: 'CAM-LEZ-03',
      type: 'รถบรรทุก 18 ล้อ', // ใช่
      time: '2025-01-24 15:15',
      status: 'No Green List',
      location: 'ถนนพระราม 4',
      detail: 'ฝ่าฝืนช่วงเวลาห้ามเดินรถ',
      fuelType: 'Diesel',
      position: [13.7314, 100.5311]
    },
  ]);

  // --- Logic: กรองเฉพาะที่มีคำว่า "รถบรรทุก" ใน type ---
  const truckViolations = allData.filter(item => item.type.includes('รถบรรทุก'));

  // --- Handlers ---
  const handleSearch = (searchParams) => {
    console.log('Search params:', searchParams);
  };

  const handleSelectViolation = (violation) => {
    if (window.innerWidth < 1024) {
        setSelectedViolation(violation);
    } else {
        console.log('Desktop select:', violation.lpr);
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
        setSelectedViolation(null);
        setIsClosing(false);
    }, 300);
  };

  const getMapData = (violation) => {
    if (!violation) return {};
    const isGreenList = violation.status === 'Green List';
    return {
        plateNumber: violation.lpr,
        province: "กรุงเทพมหานคร",
        violationCount: isGreenList ? 0 : 1, 
        status: isGreenList ? 'อนุญาต (Green List)' : 'ฝ่าฝืน (No Green List)',
        reason: violation.detail,
        latestCamera: violation.camera,
        latestTime: violation.time,
        latestLocation: violation.location,
        position: violation.position || [13.7563, 100.5018]
    };
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden relative font-sans">
      
      {/* --- MOBILE MODAL (Slide Up/Down) --- */}
      {selectedViolation && (
        <div className="fixed inset-0 z-[100] lg:hidden flex flex-col items-end justify-end sm:items-center sm:justify-center">
            {/* Backdrop Fade Out */}
            <div 
                className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
                    isClosing ? 'opacity-0' : 'opacity-100'
                }`}
                onClick={handleCloseModal}
            ></div>
            
            {/* Modal Card Animation */}
            <div className={`
                relative w-full h-[90vh] sm:h-[85vh] sm:w-[90%] sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden 
                ${isClosing ? 'animate-slide-down-mobile' : 'animate-slide-up-mobile'}
            `}>
                <div className="flex justify-between items-center px-4 py-3 border-b shrink-0 bg-white">
                    <h3 className="font-bold text-gray-800 text-lg">รายละเอียด Green List</h3>
                    <button 
                        onClick={handleCloseModal}
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

        {/* 1. Header & Toggle */}
        <div className="mb-4 shrink-0 flex items-center justify-between z-10">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-[3px] border-red-600 flex items-center justify-center shrink-0 shadow-sm bg-white">
                <span className="text-sm font-black">!</span>
              </div>
              <h1 className="text-lg md:text-2xl font-black text-gray-800 line-clamp-1 tracking-tight">ตรวจจับรถบรรทุก (LEZ)</h1>
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

        {/* 2. Filter Section (Compact: mb-1) */}
        <div className={`
            shrink-0 transition-all duration-300 ease-in-out overflow-hidden z-30
            ${showFilter ? 'max-h-[500px] opacity-100 mb-1' : 'max-h-0 opacity-0 mb-0 lg:max-h-none lg:opacity-100 lg:mb-1 lg:overflow-visible'}
        `}>
            <div className="p-1">
                <Filter
                    type="barrier"
                    onSearch={handleSearch}
                    placeholder="ค้นหาเลขทะเบียน..."
                    showDateRange={true}
                />
            </div>
        </div>

        {/* 3. Layout Content */}
        <div className="flex flex-1 gap-5 md:gap-8 overflow-hidden relative z-0">
          
          {/* Left: Violation List (แสดงเฉพาะรถบรรทุก) */}
          <div className="flex-1 min-w-0 h-full">
            <ViolationList
              title="รายการเข้าพื้นที่ LEZ"
              violations={truckViolations} 
              type="barrier"
              timeRange="วันนี้ (ช่วงวิกฤตฝุ่น)"
              onSelectViolation={handleSelectViolation}
            />
          </div>
          
          {/* Right: Sidebar (Desktop Only) */}
          <div className="hidden lg:block flex-none w-[400px] xl:w-[500px] 2xl:w-[600px]">
            <MapSidebar data={getMapData(truckViolations[0])} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetectTruckBarrier;