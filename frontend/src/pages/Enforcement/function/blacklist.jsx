import React, { useState, useEffect } from 'react';
import { Filter } from '../../../components/ui/Filter';
import { ViolationList } from '../../../components/ui/ViolationList';
import { MapSidebar } from '../../../components/ui/MapSidebar';
import { FaTimes, FaFilter, FaChevronUp, FaChevronDown } from 'react-icons/fa';

/**
 * หน้าระบบตรวจสอบบัญชีดำ (Enforcement Blacklist)
 * - มีข้อมูลตัวอย่างครบถ้วน
 * - เปิดใช้งาน Sequence (เส้นทางย้อนหลัง)
 * - (Layout & Spacing ปรับปรุงให้เหมือนหน้าอื่นๆ เป็น Page Scroll + Sticky Sidebar)
 */
const EnforcementBlacklist = () => {
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  // --- Mock Data (ข้อมูลบัญชีดำแบบเต็ม) ---
  const mockViolations = [
    {
      lpr: '1กก-9999',
      camera: 'CAM-BL-01',
      type: 'รถยนต์',
      time: '2025-01-24 14:25',
      status: 'สูง', // High Risk
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'รถยนต์ในบัญชีดำ (หมายจับคดีอาญา)',
      position: [13.7763, 100.5718]
    },
    {
      lpr: '2ขข-8888',
      camera: 'CAM-BL-02',
      type: 'รถตู้',
      time: '2025-01-24 14:30',
      status: 'สูง',
      location: 'จุดสกัดถนนวิภาวดี',
      detail: 'รถสวมทะเบียน / ป้ายทะเบียนปลอม',
      position: [13.8050, 100.5560]
    },
    {
      lpr: '3คค-7777',
      camera: 'CAM-BL-03',
      type: 'รถเก๋ง',
      time: '2025-01-24 14:45',
      status: 'ปานกลาง',
      location: 'แยกรัชดา-ลาดพร้าว',
      detail: 'เฝ้าระวังพิเศษ (หนีไฟแนนซ์/ขาดส่งค่างวดเกินกำหนด)',
      position: [13.8030, 100.5750]
    },
    {
      lpr: '4งง-6666',
      camera: 'CAM-BL-01',
      type: 'รถกระบะดัดแปลง',
      time: '2025-01-24 15:00',
      status: 'สูง',
      location: 'ด่านตรวจคนเข้าเมือง',
      detail: 'รถต้องสงสัยขนส่งสิ่งผิดกฎหมาย/ยาเสพติด',
      position: [13.7525, 100.5730]
    },
    {
      lpr: '5จจ-5555',
      camera: 'CAM-BL-04',
      type: 'รถหรู',
      time: '2025-01-24 15:15',
      status: 'สูง',
      location: 'ทางด่วนขั้นที่ 1',
      detail: 'ใบสั่งค้างชำระเกิน 50 ใบ (Blacklist จราจร)',
      position: [13.7300, 100.5400]
    },
    {
      lpr: '6ฉฉ-4444',
      camera: 'CAM-BL-05',
      type: 'รถจักรยานยนต์',
      time: '2025-01-24 15:30',
      status: 'สูง',
      location: 'แยกพระราม 9',
      detail: 'แจ้งรถหาย (Stolen Vehicle Alert)',
      position: [13.7576, 100.5654]
    },
    {
      lpr: '7ชช-3333',
      camera: 'CAM-BL-02',
      type: 'รถบรรทุก',
      time: '2025-01-24 15:45',
      status: 'ปานกลาง',
      location: 'ถนนพหลโยธิน',
      detail: 'ผู้ขับขี่ถูกเพิกถอนใบอนุญาต',
      position: [13.8200, 100.5680]
    }
  ];

  const [violations, setViolations] = useState(mockViolations);

  // ป้องกันการ Scroll บน Background เมื่อเปิด Modal ในมือถือ
  useEffect(() => {
    if (selectedViolation && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedViolation]);

  // --- Logic การค้นหา ---
  const handleSearch = (filters) => {
    const filteredData = mockViolations.filter((item) => {
      const matchLpr = filters.lpr ? item.lpr.includes(filters.lpr) : true;
      const matchLocation = filters.location
        ? item.location.includes(filters.location) || item.camera.includes(filters.location)
        : true;
      const matchType = filters.type ? item.type === filters.type : true;

      let matchDate = true;
      if (filters.startDate || filters.endDate) {
        const itemDateStr = item.time.split(" ")[0];
        if (filters.startDate && itemDateStr < filters.startDate) matchDate = false;
        if (filters.endDate && itemDateStr > filters.endDate) matchDate = false;
      }

      return matchLpr && matchLocation && matchType && matchDate;
    });

    setViolations(filteredData);
  };

  const handleSelectViolation = (violation) => {
    setSelectedViolation(violation);
  };

  const getMapData = (violation) => {
    if (!violation) return {};
    return {
        plateNumber: violation.lpr,
        province: "กรุงเทพมหานคร",
        violationCount: 99, // บัญชีดำมักมีประวัติเยอะ
        status: "บัญชีดำ (Blacklist)",
        reason: violation.detail,
        latestCamera: violation.camera,
        latestTime: violation.time,
        latestLocation: violation.location,
        position: violation.position || [13.7763, 100.5718]
    };
  };

  return (
    <div className="w-full h-screen bg-gray-50 relative font-sans overflow-y-auto overflow-x-hidden pb-10">
      
      {/* --- MOBILE MODAL --- */}
      {selectedViolation && (
        <div className="fixed inset-0 z-[100] lg:hidden flex flex-col items-end justify-end sm:items-center sm:justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedViolation(null)}
          ></div>

          <div className="relative w-full h-[90vh] sm:h-[85vh] sm:w-[90%] sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up-mobile">
            <div className="flex justify-between items-center px-4 py-3 border-b shrink-0 bg-white">
              <h3 className="font-bold text-gray-800 text-lg">รายละเอียดบัญชีดำ</h3>
              <button
                onClick={() => setSelectedViolation(null)}
                className="p-2 bg-gray-50 rounded-full border border-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative bg-gray-50">
              {/* ส่ง enableSequence={true} เพื่อแสดงปุ่ม Sequence ในมือถือ */}
              <MapSidebar data={getMapData(selectedViolation)} enableSequence={true} />
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="w-full mx-auto p-4 md:p-6 max-w-[1600px]">

        {/* 1. Header & Toggle */}
        <div className="mb-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-[3px] border-red-600 flex items-center justify-center shrink-0 shadow-sm bg-white">
                <span className="text-sm font-black">!</span>
              </div>
              <h1 className="text-lg md:text-2xl font-black text-gray-800 line-clamp-1 tracking-tight">ตรวจสอบบัญชีดำ</h1>
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
            transition-all duration-300 ease-in-out overflow-hidden z-30
            ${showFilter ? "max-h-[500px] opacity-100 mb-2" : "max-h-0 opacity-0 mb-0 lg:max-h-none lg:opacity-100 lg:mb-4 lg:overflow-visible"}
        `}>
            <Filter
                type="blacklist" // เปลี่ยน type ส่งให้ Filter
                onSearch={handleSearch}
                placeholder="ค้นหาทะเบียน/หมายจับ..."
                showDateRange={true}
            />
        </div>

        {/* 3. Layout Content */}
        <div className="flex gap-5 md:gap-8 items-start relative z-0">
          
          {/* Left: Violation List */}
          <div className="flex-1 min-w-0">
            <ViolationList
              title="รายการเฝ้าระวังล่าสุด"
              violations={violations}
              type="blacklist"
              timeRange="วันนี้ (Real-time)"
              onRowClick={handleSelectViolation}
            />
          </div>
          
          {/* Right: Sidebar (Desktop Only) — sticky ติดขวาขณะ scroll */}
          <div className="hidden lg:block flex-none w-[400px] xl:w-[500px] 2xl:w-[600px] sticky top-6 h-[calc(100vh-3rem)]">
            {/* ส่ง enableSequence={true} เพื่อแสดงปุ่ม Sequence ใน Desktop */}
            <MapSidebar data={getMapData(selectedViolation || (violations.length > 0 ? violations[0] : null))} enableSequence={true} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnforcementBlacklist;