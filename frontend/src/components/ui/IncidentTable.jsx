// src/components/ui/IncidentTable.jsx
import React, { useState, useMemo, useEffect } from "react";
import { 
  FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaEye, 
  FaCarCrash, FaExclamationTriangle, FaMapMarkerAlt, FaCalendarAlt, 
  FaTools, FaWater, FaRoad, FaFlag, FaFireAlt, FaCarSide
} from "react-icons/fa";

// --- Helper Functions ---
const getSeverityColor = (s) => {
  if (s === "Severe" || s === "Critical") return "text-red-700 bg-red-50 border-red-200";
  if (s === "Moderate") return "text-orange-700 bg-orange-50 border-orange-200";
  return "text-green-700 bg-green-50 border-green-200";
};

const getStatusColor = (s) => {
  if (s === "New") return "text-blue-700 bg-blue-50 border-blue-200";
  if (s === "Verified" || s === "In-Process") return "text-yellow-700 bg-yellow-50 border-yellow-200";
  if (s === "Closed") return "text-gray-700 bg-gray-50 border-gray-200";
  return "text-gray-600 bg-gray-100";
};

const getIconByType = (category) => {
  switch (category) {
    case 'อุบัติเหตุ': return <FaCarCrash />;
    case 'รถเสีย': return <FaTools />;
    case 'อันตราย': return <FaFireAlt />;
    case 'สิ่งกีดขวาง': return <FaExclamationTriangle />;
    case 'กิจกรรมพิเศษ': return <FaFlag />;
    case 'ก่อสร้าง': return <FaRoad />;
    default: return <FaExclamationTriangle />;
  }
};

const IncidentTable = ({ 
  incidents = [], 
  title = "รายการเหตุการณ์ทั้งหมด", 
  itemsPerPage = 10, 
  showVehicleColumn = true
}) => {
  
  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // --- Filtering Logic ---
  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      // 1. Search
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = 
        item.id.toLowerCase().includes(searchLower) ||
        item.type.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower) ||
        (item.vehicle && item.vehicle.toLowerCase().includes(searchLower));

      // 2. Category
      const matchCategory = selectedCategory === "All" || item.category === selectedCategory;

      // 3. Status
      const statusCheck = item.displayStatus || item.status;
      const matchStatus = selectedStatus === "All" || statusCheck === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [incidents, searchTerm, selectedCategory, selectedStatus]);

  // --- Pagination ---
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredIncidents.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filter changes
  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
      
      {/* --- HEADER & FILTERS --- */}
      <div className="p-4 md:p-5 border-b border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <div>
            <h3 className="font-bold text-gray-800 text-base md:text-lg">{title}</h3>
            <p className="text-xs text-gray-500">พบข้อมูล {filteredIncidents.length} รายการ</p>
          </div>
        </div>

        {/* Filter Bar (Responsive) */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
             <input 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400" 
               placeholder="ค้นหา รหัส, สถานที่, ทะเบียน..." 
             />
          </div>

          {/* Filters Group */}
          <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
            {/* Category Filter */}
            <div className="relative min-w-[140px]">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 cursor-pointer text-gray-700 appearance-none"
              >
                <option value="All">ทุกประเภท</option>
                <option value="อุบัติเหตุ">อุบัติเหตุ</option>
                <option value="รถเสีย">รถเสีย</option>
                <option value="สิ่งกีดขวาง">สิ่งกีดขวาง</option>
                <option value="อันตราย">อันตราย</option>
                <option value="กิจกรรมพิเศษ">กิจกรรม</option>
                <option value="ก่อสร้าง">ก่อสร้าง</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[130px]">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 cursor-pointer text-gray-700 appearance-none"
              >
                <option value="All">ทุกสถานะ</option>
                <option value="New">ใหม่ (New)</option>
                <option value="Verified">ตรวจสอบแล้ว</option>
                <option value="Closed">เสร็จสิ้น</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="flex-1 bg-gray-50/50">
        
        {/* 1. MOBILE CARD VIEW (แสดงเฉพาะจอเล็ก md:hidden) */}
        <div className="md:hidden p-4 space-y-3">
          {currentData.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold font-mono">
                    {item.id}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(item.displayStatus || item.status)}`}>
                    {item.displayStatus || item.status}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-blue-600">
                  <FaEye />
                </button>
              </div>

              {/* Card Body */}
              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm shrink-0 ${
                    item.category === 'อุบัติเหตุ' ? 'bg-red-500' : 
                    item.category === 'รถเสีย' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {getIconByType(item.category)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 leading-tight">{item.type}</h4>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <FaMapMarkerAlt className="text-red-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>

                {showVehicleColumn && item.vehicle !== "-" && (
                  <div className="flex items-center gap-2 text-xs text-gray-700 font-medium ml-1">
                    <FaCarSide className="text-gray-400" />
                    {item.vehicle}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <FaCalendarAlt /> {item.datetime}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getSeverityColor(item.severity)}`}>
                  {item.severity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. DESKTOP TABLE VIEW (แสดงเฉพาะจอใหญ่ md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-500 uppercase text-xs font-semibold">
                <th className="py-4 px-6 w-[100px]">รหัส</th>
                <th className="py-4 px-6">ประเภท</th>
                {showVehicleColumn && <th className="py-4 px-6">ยานพาหนะ</th>}
                <th className="py-4 px-6">สถานที่</th>
                <th className="py-4 px-6 w-[150px]">เวลา</th>
                <th className="py-4 px-6 text-center w-[100px]">ระดับ</th>
                <th className="py-4 px-6 text-center w-[120px]">สถานะ</th>
                <th className="py-4 px-6 text-center w-[80px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {currentData.map((item, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 font-mono text-blue-600 font-medium">{item.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs shadow-sm ${
                        item.category === 'อุบัติเหตุ' ? 'bg-red-500' : 
                        item.category === 'รถเสีย' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {getIconByType(item.category)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{item.type}</div>
                        <div className="text-[10px] text-gray-500">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  {showVehicleColumn && (
                    <td className="py-4 px-6 text-gray-700 font-medium">
                      {item.vehicle !== "-" ? item.vehicle : <span className="text-gray-300">-</span>}
                    </td>
                  )}
                  <td className="py-4 px-6 text-gray-600 truncate max-w-[200px]" title={item.location}>
                    {item.location}
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-xs font-mono">
                    {item.datetime}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold border ${getSeverityColor(item.severity)}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(item.displayStatus || item.status)}`}>
                      {item.displayStatus || item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-all">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredIncidents.length === 0 && (
          <div className="p-10 text-center text-gray-400 flex flex-col items-center">
            <FaSearch className="text-4xl mb-2 opacity-20" />
            <p>ไม่พบข้อมูลที่ค้นหา</p>
          </div>
        )}
      </div>

      {/* --- PAGINATION --- */}
      {filteredIncidents.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-gray-500 font-medium">
            หน้า {currentPage} จาก {totalPages}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <div className="hidden sm:flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentTable;