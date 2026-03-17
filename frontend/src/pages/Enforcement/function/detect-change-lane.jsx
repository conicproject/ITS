import React, { useState, useEffect } from 'react';
import { Filter } from '../../../components/ui/Filter';
import { ViolationList } from '../../../components/ui/ViolationList';
import { MapSidebar } from '../../../components/ui/MapSidebar';
import { FaTimes, FaFilter, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const DetectChangeLane = () => {
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  // --- Mock Data ---
  const mockViolations = [
    {
      lpr: '1กก-1234',
      camera: 'CAM-LN-02',
      type: 'รถยนต์',
      time: '2025-01-24 14:25',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'เปลี่ยนเลนทับเส้นทึบ (ปาดหน้ากะทันหัน)',
      position: [13.7763, 100.5718]
    },
    {
      lpr: '2ขข-5678',
      camera: 'CAM-LN-03',
      type: 'รถกระบะ',
      time: '2025-01-24 14:30',
      status: 'ปานกลาง',
      location: 'สะพานข้ามแยกพระราม 9',
      detail: 'เปลี่ยนเลนในเขตห้ามเปลี่ยน',
      position: [13.7576, 100.5654]
    },
    {
      lpr: '3คค-9012',
      camera: 'CAM-LN-01',
      type: 'รถบรรทุก',
      time: '2025-01-24 14:45',
      status: 'สูง',
      location: 'ทางด่วนขั้นที่ 2',
      detail: 'รถบรรทุกวิ่งขวา/เปลี่ยนเลนเส้นทึบ',
      position: [13.7650, 100.5690]
    },
    {
      lpr: '4งง-3456',
      camera: 'CAM-LN-04',
      type: 'รถจักรยานยนต์',
      time: '2025-01-24 15:00',
      status: 'ต่ำ',
      location: 'อุโมงค์ดินแดง',
      detail: 'ขับคร่อมเลน/เปลี่ยนเลนเส้นทึบในอุโมงค์',
      position: [13.7644, 100.5539]
    },
    {
      lpr: '5จจ-7890',
      camera: 'CAM-LN-02',
      type: 'รถยนต์',
      time: '2025-01-24 15:15',
      status: 'สูง',
      location: 'แยกรัชดา-ห้วยขวาง',
      detail: 'เปลี่ยนเลนทับเส้นทึบ (ตัดหน้าจอดรอไฟแดง)',
      position: [13.7763, 100.5718]
    },
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
        violationCount: 2, // Mock count
        status: "ฝ่าฝืนเครื่องหมายจราจร",
        reason: violation.detail,
        latestCamera: violation.camera,
        latestTime: violation.time,
        latestLocation: violation.location,
        position: violation.position || [13.7563, 100.5018]
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
              <h3 className="font-bold text-gray-800 text-lg">รายละเอียดการฝ่าฝืน</h3>
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
      <div className="w-full mx-auto p-4 md:p-6 max-w-[1600px]">

        {/* 1. Header & Toggle */}
        <div className="mb-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3 text-red-600">
            <div className="w-9 h-9 md:w-15 md:h-15 rounded-full border-[3px] border-red-600 flex items-center justify-center shrink-0 shadow-sm bg-white overflow-hidden">
              <img
                src="/assets/function_icon/enforcement_function/enforecment_8.png"
                alt="Enforcement Icon"
                className="w-full h-full object-cover"
              />
            </div>
              <h1 className="text-lg md:text-2xl font-black text-gray-800 line-clamp-1 tracking-tight">การเปลี่ยนเลน (เส้นทึบ)</h1>
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
                type="lane"
                onSearch={handleSearch}
                placeholder="ค้นหาเลขทะเบียน..."
                showDateRange={true}
            />
        </div>

        {/* 3. Layout Content */}
        {/* ใช้ items-start เพื่อให้ฝั่งซ้ายและขวาอยู่ด้านบน และฝั่งขวาจะได้ใช้ sticky ได้ */}
        <div className="flex gap-5 md:gap-8 items-start relative z-0">
          
          {/* Left: Violation List (จะเลื่อนไปพร้อมกับการ Scroll ของหน้าเพจ) */}
          <div className="flex-1 min-w-0">
            <ViolationList
              title="รายการเปลี่ยนเลนล่าสุด"
              violations={violations}
              type="lane"
              timeRange="วันนี้ (Real-time)"
              onRowClick={handleSelectViolation}
            />
          </div>
          
          {/* Right: Sidebar (Desktop Only) — ใช้ sticky ติดขวาขณะ scroll และ h-[calc(100vh-3rem)] ให้พอดีจอ */}
          <div className="hidden lg:block flex-none w-[400px] xl:w-[500px] 2xl:w-[600px] sticky top-6 h-[calc(100vh-3rem)]">
            <MapSidebar data={getMapData(selectedViolation || (violations.length > 0 ? violations[0] : null))} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetectChangeLane;