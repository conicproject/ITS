// src/components/ui/IncidentTable.jsx
import React, { useState, useMemo } from "react";
import { 
  FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaEye, 
  FaMapMarkerAlt, FaCalendarAlt
} from "react-icons/fa";

// 1. Import ไฟล์ Icon ทั้ง 5 หมวดของคุณเข้ามา
import RelateAccidentIcon from "./Icon_Incident/relate-accident";
import RoadObstructionIcon from "./Icon_Incident/road-obstruction";
import HazardousIncidentIcon from "./Icon_Incident/hazardous-incident";
import IrregularitieIcon from "./Icon_Incident/irregularitie";
import SpecialEventIcon from "./Icon_Incident/special-event";

// Helper Colors
const getSeverityColor = (s) => (s === "Severe" || s === "High" ? "text-red-600 bg-red-50 border border-red-100" : s === "Moderate" || s === "Medium" ? "text-yellow-600 bg-yellow-50 border border-yellow-100" : "text-green-600 bg-green-50 border border-green-100");
const getStatusColor = (s) => (s === "Verified" || s === "Closed" ? "text-blue-700 bg-blue-50 border border-blue-100" : s === "New" ? "text-red-600 bg-red-50 border border-red-100 animate-pulse" : "text-purple-600 bg-purple-50 border border-purple-100");

const IncidentTable = ({ 
  incidents = [], 
  title = "รายการเหตุการณ์ทั้งหมด", 
  itemsPerPage = 10, 
  showVehicleColumn = true
}) => {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // --- Filtering Logic ---
  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = 
        item.id.toLowerCase().includes(searchLower) ||
        item.type.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower) ||
        (item.vehicle && item.vehicle.toLowerCase().includes(searchLower));

      const itemCategory = item.category || item.type;
      const matchCategory = selectedCategory === "All" || itemCategory === selectedCategory;

      const statusCheck = item.displayStatus || item.status;
      const matchStatus = selectedStatus === "All" || statusCheck === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [incidents, searchTerm, selectedCategory, selectedStatus]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredIncidents.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);

  // 2. ฟังก์ชันเลือก Icon ให้ตรงกับหมวดหมู่ (Category)
  const renderIcon = (item) => {
    const category = item.category || item.type;
    const subtype = item.subtype || item.type;

    switch (category) {
      case "สิ่งกีดขวาง":
        return <RoadObstructionIcon variant={subtype} size={36} />;
      case "อันตราย":
      case "อันตรายพิเศษ":
        return <HazardousIncidentIcon variant={subtype} size={36} />;
      case "ความผิดปกติ":
        return <IrregularitieIcon variant={subtype} size={36} />;
      case "กิจกรรมพิเศษ":
        return <SpecialEventIcon variant={subtype} size={36} />;
      case "อุบัติเหตุ":
      case "รถเสีย":
      default:
        return <RelateAccidentIcon variant={subtype} size={36} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
      
      {/* --- Table Header & Controls --- */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
            <p className="text-xs text-gray-500 mt-1">พบข้อมูลทั้งหมด {filteredIncidents.length} รายการ</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
               <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
               <input 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400" 
                 placeholder="ค้นหา รหัส, สถานที่..." 
               />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 cursor-pointer hover:bg-gray-50 text-gray-700 min-w-[140px] appearance-none"
              >
                <option value="All">ทุกประเภท</option>
                <option value="อุบัติเหตุ">อุบัติเหตุ</option>
                <option value="รถเสีย">รถเสีย</option>
                <option value="สิ่งกีดขวาง">สิ่งกีดขวาง</option>
                <option value="อันตราย">อันตราย/ภัยพิบัติ</option>
                <option value="กิจกรรมพิเศษ">กิจกรรมพิเศษ</option>
                <option value="ความผิดปกติ">ความผิดปกติ</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 cursor-pointer hover:bg-gray-50 text-gray-700 min-w-[120px] appearance-none"
              >
                <option value="All">ทุกสถานะ</option>
                <option value="New">New (ใหม่)</option>
                <option value="Verified">Verified</option>
                <option value="In-Process">In-Process</option>
                <option value="Closed">Closed</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Data Table --- */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider font-semibold border-b border-gray-100">
              <th className="py-4 px-6 min-w-[100px]">รหัส</th>
              <th className="py-4 px-6 min-w-[160px]">ประเภท</th>
              {showVehicleColumn && <th className="py-4 px-6 min-w-[180px]">ยานพาหนะ</th>}
              <th className="py-4 px-6 min-w-[200px]">สถานที่</th>
              <th className="py-4 px-6 min-w-[140px]">วัน/เวลา</th>
              <th className="py-4 px-6 text-center">ระดับ</th>
              <th className="py-4 px-6 text-center">สถานะ</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentData.length > 0 ? (
              currentData.map((item, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="py-4 px-6 font-medium text-blue-600 font-mono">{item.id}</td>
                  
                  {/* --- 3. แสดง Icon ตามที่ฟังก์ชัน renderIcon เลือกมาให้ --- */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                       <div className="shrink-0 flex items-center justify-center">
                          {renderIcon(item)}
                       </div>
                       <div className="flex flex-col">
                         <span className="text-gray-900 font-medium">{item.category || item.type}</span>
                         <span className="text-[10px] text-gray-500 uppercase">{item.subtype || item.type}</span>
                       </div>
                    </div>
                  </td>

                  {showVehicleColumn && (
                    <td className="py-4 px-6">
                      {item.vehicle && item.vehicle !== "-" ? (
                        <span className="text-gray-700 font-medium">{item.vehicle}</span>
                      ) : (
                        <span className="text-gray-300 text-xs">-</span>
                      )}
                    </td>
                  )}
                  <td className="py-4 px-6 text-gray-600 truncate max-w-[200px]" title={item.location}>
                    <div className="flex items-center gap-2">
                       <FaMapMarkerAlt className="text-gray-300 shrink-0"/> {item.location}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-xs font-mono whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-300"/> {item.datetime}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${getSeverityColor(item.severity)}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(item.displayStatus || item.status)}`}>
                      {item.displayStatus || item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={showVehicleColumn ? 8 : 7} className="py-12 text-center text-gray-400 bg-gray-50/30">
                  <div className="flex flex-col items-center gap-3">
                    <FaSearch className="text-4xl text-gray-200" />
                    <p>ไม่พบข้อมูลที่ค้นหา</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination Footer --- */}
      {filteredIncidents.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 rounded-b-xl">
          <span className="text-gray-500 text-xs font-medium">
            แสดง {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredIncidents.length)} จาก {filteredIncidents.length} รายการ
          </span>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-gray-500 transition-all shadow-sm"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            <div className="hidden sm:flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                if (totalPages > 7 && Math.abs(currentPage - (i + 1)) > 2 && i !== 0 && i !== totalPages - 1) {
                   if (i === 1 || i === totalPages - 2) return <span key={i} className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>;
                   return null;
                }
                return (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)} 
                    className={`w-8 h-8 flex items-center justify-center border rounded-lg text-xs font-bold transition-all shadow-sm ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
             <span className="sm:hidden text-xs font-bold text-gray-700 bg-white px-3 py-1.5 rounded border border-gray-200">
                {currentPage} / {totalPages}
             </span>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-gray-500 transition-all shadow-sm"
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