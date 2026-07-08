// frontend/src/pages/Sequence.jsx
import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import {
  FaMapMarkerAlt,
  FaPlay,
  FaCar,
  FaRoad,
  FaCamera,
  FaSearch,
  FaClock,
  FaPlus,
} from "react-icons/fa";
import "leaflet/dist/leaflet.css";

// Path imports
import { Filter } from "../../../components/ui/Filter";
// *** 1. Import ไฟล์ Popup เข้ามา (ตรวจสอบ path ให้ตรงกับที่คุณวางไฟล์) ***
import AddBlacklistModal from "../../../components/ui/AddBlacklistModal"; 

function Sequence() {
  // --- STATE: สำหรับค้นหาในรายการบัญชีดำ (Local Search) ---
  const [blacklistSearch, setBlacklistSearch] = useState("");
  
  // *** 2. เพิ่ม State สำหรับเปิด/ปิด Popup ***
  const [showAddBlacklist, setShowAddBlacklist] = useState(false);

  // --- MOCK DATA: รายการบัญชีดำ ---
  const initialBlacklist = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    plate: i % 2 === 0 ? `กท-123${i}` : `ขก-987${i}`,
    province: i % 2 === 0 ? "กรุงเทพฯ" : "ขอนแก่น",
    brand: "Honda",
    model: "Civic",
    color: "ดำ",
    camId: `CAM-00${(i % 5) + 1}`,
    time: `09:${30 + i}:45`,
    location: "สี่แยกราชดำเนิน",
    alertLevel: "High",
  }));

  // --- LOGIC: กรองรายการตามคำค้นหา (Local) ---
  const filteredBlacklist = initialBlacklist.filter((item) => {
    const searchLower = blacklistSearch.toLowerCase();
    return (
      item.plate.toLowerCase().includes(searchLower) ||
      item.province.toLowerCase().includes(searchLower) ||
      item.camId.toLowerCase().includes(searchLower)
    );
  });

  // --- ฟังก์ชันรับค่าจาก Filter (Global) ---
  const handleSearch = (filterData) => {
    console.log("Search Filter Data:", filterData);
    // TODO: เชื่อมต่อ API ตรงนี้
  };

  const sequenceTrackingData = {
    carInfo: {
      plateNumber: "5ขจ-8765",
      province: "ปทุมธานี",
      brand: "Honda",
      color: "ดำ",
      type: "กระบะ",
      lastCam: "CAM-001",
      location: "ถ.นวมินทร์",
      status: "Blacklist",
    },
    routePath: [
      [13.843847, 100.65297],
      [13.83862, 100.662548],
      [13.83398, 100.660581],
      [13.830887, 100.659236],
    ],
    checkpoints: [
      {
        id: 1,
        position: [13.843847, 100.65297],
        camId: "CAM-001",
        time: "14:10:00",
        seq: 1,
        hasAlert: true,
      },
      {
        id: 2,
        position: [13.83862, 100.662548],
        camId: "CAM-002",
        time: "14:15:30",
        seq: 2,
        hasAlert: true,
        videoThumbnail: true,
      },
      {
        id: 3,
        position: [13.830887, 100.659236],
        camId: "CAM-003",
        time: "14:15:30",
        seq: 3,
        hasAlert: true,
        videoThumbnail: true,
      },
    ],
  };

  return (
    <div className="h-screen overflow-y-auto font-sans pb-10 space-y-6 p-4 md:p-6 relative">
      
      {/* *** 3. ส่วนแสดงผล Popup (Overlay) *** */}
      {showAddBlacklist && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* ส่ง prop onClose ไปให้ Modal เพื่อให้ปิดได้ */}
          <AddBlacklistModal onClose={() => setShowAddBlacklist(false)} />
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FaRoad className="text-indigo-600 text-xl" />
            </div>
            ระบบติดตามลำดับเหตุการณ์ (Sequence Tracking)
          </h1>
          <p className="text-gray-500 text-sm mt-1 ml-11">
            Vehicle Sequence Tracking & Blacklist Monitoring
          </p>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper { padding: 0 !important; overflow: hidden; border-radius: 8px; }
        .custom-popup .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .custom-popup .leaflet-popup-tip-container { margin-top: -1px; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f1f1; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
      `}</style>

      {/* --- Filter Section --- */}
      <div className="mb-6">
        <Filter
          onSearch={handleSearch}
          showPlate={true}
          showProvince={true}
          showDateRange={true}
          showTimeRange={true}
          showVehicleType={true}
          showColor={true}
          showBrand={true}
          showLocation={true}
          showDistrict={true}
          showStatus={true}
          plateColSpan="col-span-12 md:col-span-7 lg:col-span-4"
          provinceColSpan="col-span-12 md:col-span-6 lg:col-span-3"
          dateColSpan="col-span-12 md:col-span-6 lg:col-span-4"
          timeColSpan="col-span-12 md:col-span-6 lg:col-span-2"
          locationColSpan="col-span-12 md:col-span-7 lg:col-span-4"
          districtColSpan="col-span-12 md:col-span-6 lg:col-span-3"
          attrColSpan="col-span-6 md:col-span-3 lg:col-span-2"
          statusColSpan="col-span-12 md:col-span-6 lg:col-span-3"
          placeholderLocation="ระบุชื่อจุดติดตั้ง..."
        />
      </div>

      {/* *** 4. ปุ่มกดเพื่อเปิด Popup *** */}
      <button 
        onClick={() => setShowAddBlacklist(true)}
        className="my-2 w-full bg-black text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        <FaPlus className="text-xs" />
        เพิ่มบัญชีดำ
      </button>

      {/* --- PART 1: SEQUENCE TRACKING --- */}
      <div className="w-full rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
         {/* ... (ส่วนนี้เหมือนเดิม ไม่มีการเปลี่ยนแปลง) ... */}
        <div className="flex items-center gap-2 mb-3 border-l-4 border-red-500 pl-2">
          <FaMapMarkerAlt className="text-red-500" />
          <h3 className="font-bold text-gray-800">Sequence Tracking</h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[600px]">
          {/* Left/Top: Info & Video */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3 h-auto lg:h-full">
            {/* Location Info */}
            <div className="flex flex-col md:flex-row w-full gap-4 text-gray-800 shrink-0">
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-6 py-4 shadow-sm md:min-w-[140px]">
                <div className="relative flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt className="text-purple-500 text-2xl drop-shadow-sm" />
                </div>
                <span className="text-lg font-medium whitespace-nowrap">
                  สถานที่ :
                </span>
              </div>

              <div className="flex flex-1 items-center justify-center md:justify-start rounded-2xl border border-gray-200 px-6 py-4 shadow-sm">
                <span className="text-lg font-semibold text-gray-700">
                  {sequenceTrackingData.carInfo.location}
                </span>
              </div>
            </div>

            {/* Video Player */}
            <div className="bg-black rounded-lg flex-1 flex items-center justify-center relative group min-h-[160px] md:min-h-[200px]">
              <FaPlay className="text-white text-4xl opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                <div className="text-white text-[10px]">00:15</div>
                <div className="h-1 bg-gray-600 flex-1 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-1/3"></div>
                </div>
                <div className="text-white text-[10px]">00:29</div>
              </div>
            </div>

            {/* Car Detail */}
            <div className="border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center shadow-sm">
              <div className="border-2 border-black rounded p-2 w-full sm:w-35 text-center shadow-sm shrink-0 flex flex-row sm:flex-col justify-between sm:justify-center items-center">
                <div className="text-xl font-bold text-gray-800 leading-none mt-1">
                  {sequenceTrackingData.carInfo.plateNumber}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  {sequenceTrackingData.carInfo.province}
                </div>
              </div>

              <div className="space-y-1 text-sm w-full">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500 flex items-center gap-1">
                    <FaCar /> รุ่น/สี :
                  </span>
                  <span className="font-medium">
                    {sequenceTrackingData.carInfo.brand} /{" "}
                    {sequenceTrackingData.carInfo.color}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500 flex items-center gap-1">
                    <FaRoad /> ประเภท :
                  </span>
                  <span className="font-medium">
                    {sequenceTrackingData.carInfo.type}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500 flex items-center gap-1">
                    <FaCamera /> กล้อง :
                  </span>
                  <span className="font-medium text-blue-600">
                    {sequenceTrackingData.carInfo.lastCam}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1">
                    <FaMapMarkerAlt /> สถานที่ :
                  </span>
                  <span className="font-medium truncate max-w-[150px]">
                    {sequenceTrackingData.carInfo.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right/Bottom: Map */}
          <div className="w-full lg:w-1/2 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-300 h-[300px] lg:h-full">
            {typeof window !== "undefined" && (
              <MapContainer
                center={[13.83864, 100.662575]}
                zoom={15}
                zoomControl={false}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline
                  positions={sequenceTrackingData.routePath}
                  color="red"
                  dashArray="5, 10"
                  weight={3}
                />
                {sequenceTrackingData.checkpoints.map((point) => (
                  <Marker key={point.id} position={point.position}>
                    {point.hasAlert && (
                      <Popup
                        className="custom-popup"
                        maxWidth={250}
                        closeButton={false}
                      >
                        <div className="p-2 font-sans w-[150px]">
                          <div className="bg-black h-24 rounded flex items-center justify-center mb-2 relative group cursor-pointer">
                            <FaPlay className="text-white opacity-80 group-hover:scale-110 transition-transform" />
                            <div className="absolute top-1 right-1 bg-red-600 text-white text-[8px] px-1 rounded">
                              REC
                            </div>
                          </div>
                          <div className="space-y-1 text-xs text-gray-700">
                            <div className="flex justify-between">
                              <span className="font-bold">ทะเบียน:</span>
                              <span>
                                {sequenceTrackingData.carInfo.plateNumber}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-bold">กล้อง:</span>
                              <span>{point.camId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-bold">จุดที่:</span>
                              <span>{point.seq}</span>
                            </div>
                          </div>
                          <div className="mt-2 bg-red-100 text-red-600 text-[10px] font-bold text-center py-1 rounded border border-red-200">
                            เหตุผล: พบรถบัญชีดำ
                          </div>
                        </div>
                      </Popup>
                    )}
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>
      </div>

      {/* --- PART 2: BLACKLIST (อัปเดตระบบค้นหา) --- */}
      <div className="w-full rounded-xl shadow-sm border border-gray-200 p-4 h-[500px] md:h-[800px] flex flex-col">
        {/* ... (ส่วนนี้เหมือนเดิม ไม่มีการเปลี่ยนแปลง) ... */}
        <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center flex-none">
          <span className="flex items-center gap-2">
            รายการบัญชีดำ
            <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
              High Alert
            </span>
          </span>
          <button className="text-xs text-blue-600 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap">
            View All
          </button>
        </h3>

        {/* --- Search Bar for Blacklist --- */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3 flex-none">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ค้นหาป้ายทะเบียน, จังหวัด หรือ กล้อง..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition-colors"
              value={blacklistSearch}
              onChange={(e) => setBlacklistSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 sm:py-0 rounded-lg text-xs font-medium transition-colors w-full sm:w-auto">
            Filter
          </button>
        </div>

        {/* --- Blacklist Items (Filtered) --- */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1 scrollbar-thin">
          {filteredBlacklist.length > 0 ? (
            filteredBlacklist.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-red-50/30 transition-all cursor-pointer shadow-sm group"
              >
                {/* Car Info Section */}
                <div className="flex items-center gap-3 mb-2 md:mb-0 w-full md:w-1/3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:group-hover:text-red-500 transition-colors border border-gray-200 shrink-0">
                    <FaCar />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 text-sm">
                        {item.plate}
                      </span>
                      {item.id === 1 && (
                        <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 flex gap-1">
                      <span>
                        {item.brand} {item.model}
                      </span>{" "}
                      • <span>สี{item.color}</span>
                    </div>
                  </div>
                </div>

                {/* Detail Section */}
                <div className="flex flex-row md:flex-col lg:flex-row items-center gap-4 w-full md:w-1/3 justify-between md:justify-center mb-2 md:mb-0 border-l-0 md:border-l border-gray-100 pl-0 md:pl-4">
                  <div className="flex flex-col">
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      Camera
                    </div>
                    <div className="text-xs font-medium text-blue-600 flex items-center gap-1">
                      <FaCamera className="text-[10px]" /> {item.camId}
                    </div>
                  </div>
                  <div className="flex flex-col text-right md:text-left">
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      Time
                    </div>
                    <div className="text-xs font-medium text-gray-600 flex items-center gap-1 justify-end md:justify-start">
                      <FaClock className="text-[10px]" /> {item.time}
                    </div>
                  </div>
                </div>

                {/* Location & Action Section */}
                <div className="flex items-center justify-between w-full md:w-1/3 md:justify-end gap-3 border-l-0 md:border-l border-gray-100 pl-0 md:pl-4">
                  <div className="text-left md:text-right">
                    <div className="text-xs font-bold text-gray-700 flex items-center md:justify-end gap-1">
                      <FaMapMarkerAlt className="text-red-500 text-[10px]" />{" "}
                      {item.location}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Alert Level: {item.alertLevel}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-100 md:opacity-60 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-blue-100 text-blue-600 rounded bg-blue-50 transition-colors">
                      <FaPlay className="text-[10px]" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 text-gray-600 rounded transition-colors">
                      <FaSearch className="text-[10px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">
              ไม่พบข้อมูลป้ายทะเบียนที่ค้นหา
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sequence;