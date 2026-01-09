import React, { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  FaExclamationTriangle,
  FaCar,
  FaBell,
  FaSearch,
  FaVideo,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaPlay,
  FaLayerGroup,
  FaCarCrash,
  FaTools,
  FaWater,
  FaFlag,
  FaRoad,
  FaClock,
  FaMapMarkerAlt,
  FaFireAlt,
  FaHistory,
  FaTimes,
  FaCalendarAlt,
  FaCheckSquare,
  FaSquare,
  FaCheck,
  FaSpinner,
  FaChartBar
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Import Chart.js directly for better customization
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// --- Imports Component ---
import DateTimeDisplay from '../../components/ui/DateTimeDisplay'; 

// --- ChartJS Registration ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- 1. Custom Icons Logic ---
const createCustomIcon = (IconComponent, bgColor) => {
  const iconHtml = renderToStaticMarkup(
    <div style={{
      backgroundColor: bgColor,
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid white',
      boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
      color: 'white',
      fontSize: '18px'
    }}>
      <IconComponent />
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

const getMarkerIcon = (type) => {
  switch (type) {
    case "อุบัติเหตุ": return createCustomIcon(FaCarCrash, "#EF4444");
    case "รถเสีย": return createCustomIcon(FaTools, "#F97316");
    case "สิ่งกีดขวาง": return createCustomIcon(FaExclamationTriangle, "#EAB308");
    case "น้ำท่วมขัง": return createCustomIcon(FaWater, "#3B82F6");
    case "กิจกรรมพิเศษ": return createCustomIcon(FaFlag, "#8B5CF6");
    case "ก่อสร้าง": return createCustomIcon(FaRoad, "#6B7280");
    default: return createCustomIcon(FaCar, "#10B981");
  }
};

// --- 2. Filter Control Component (Responsive) ---
function MapFilterControl({ filters, toggleFilter }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const filterItems = [
    { type: "อุบัติเหตุ", icon: FaCarCrash, color: "#EF4444" },
    { type: "รถเสีย", icon: FaTools, color: "#F97316" },
    { type: "สิ่งกีดขวาง", icon: FaExclamationTriangle, color: "#EAB308" },
    { type: "น้ำท่วมขัง", icon: FaWater, color: "#3B82F6" },
    { type: "กิจกรรมพิเศษ", icon: FaFlag, color: "#8B5CF6" },
    { type: "ก่อสร้าง", icon: FaRoad, color: "#6B7280" },
  ];

  useEffect(() => {
    if (window.innerWidth > 768) setIsExpanded(true);
  }, []);

  return (
    <div className="leaflet-bottom leaflet-left" style={{ bottom: "20px", left: "10px", zIndex: 1000 }}>
      <div className="leaflet-control leaflet-bar bg-white rounded-lg shadow-xl border border-gray-200 text-sm overflow-hidden" 
           style={{ minWidth: isExpanded ? "200px" : "auto", maxWidth: "240px" }}>
        <div 
          className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 font-bold text-gray-700">
            <FaLayerGroup className="text-blue-600"/> 
            {isExpanded && <span>ตัวกรอง ({filterItems.filter(i => filters[i.type]).length})</span>}
          </div>
          {isExpanded ? <FaChevronDown className="text-gray-400"/> : <FaChevronUp className="text-gray-400"/>}
        </div>
        {isExpanded && (
          <div className="p-2 bg-white max-h-[250px] overflow-y-auto">
            {filterItems.map((item) => (
              <div 
                key={item.type} 
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${filters[item.type] ? 'hover:bg-blue-50' : 'opacity-50 hover:opacity-80 hover:bg-gray-50'}`}
                onClick={() => toggleFilter(item.type)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm shrink-0" 
                       style={{ backgroundColor: item.color, transform: filters[item.type] ? 'scale(1)' : 'scale(0.8) grayscale(100%)' }}>
                    <item.icon />
                  </div>
                  <span className={`font-medium text-xs md:text-sm ${filters[item.type] ? 'text-gray-700' : 'text-gray-400'}`}>{item.type}</span>
                </div>
                <div className="text-lg">
                  {filters[item.type] ? <FaCheckSquare className="text-blue-500" /> : <FaSquare className="text-gray-300" />}
                </div>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end gap-2 text-xs">
               <button onClick={(e) => { e.stopPropagation(); Object.keys(filters).forEach(k => toggleFilter(k, true)); }} className="text-blue-600 hover:underline">All</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FitBounds({ incidents }) {
  const map = useMap();
  useEffect(() => {
    if (!incidents || incidents.length === 0) return;
    const bounds = L.latLngBounds(incidents.map((i) => [i.lat, i.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [incidents, map]);
  return null;
}

// --- 3. History Modal (Responsive) ---
function HistoryModal({ hotspot, onClose }) {
  if (!hotspot) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-gray-50 px-4 py-3 md:px-6 md:py-4 border-b border-gray-200 flex justify-between items-center sticky top-0">
          <div className="overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
               <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold whitespace-nowrap">Hotspot #{hotspot.rank}</span>
               <span className="text-gray-400 text-[10px] md:text-xs flex items-center gap-1 whitespace-nowrap"><FaHistory/> ประวัติย้อนหลัง</span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-800 leading-tight truncate">{hotspot.location}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors flex-shrink-0"><FaTimes className="text-xl" /></button>
        </div>
        <div className="p-4 md:p-6 overflow-y-auto">
          <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
            {hotspot.history && hotspot.history.map((item, idx) => (
              <div key={idx} className="relative pl-6">
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                  item.type === 'อุบัติเหตุ' ? 'bg-red-500' :
                  item.type === 'น้ำท่วมขัง' ? 'bg-blue-500' : 'bg-orange-500'
                }`}></div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-gray-500 flex items-center gap-1"><FaCalendarAlt className="text-gray-400"/> {item.date}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${
                       item.type === 'อุบัติเหตุ' ? 'bg-red-500' : item.type === 'น้ำท่วมขัง' ? 'bg-blue-500' : 'bg-orange-500'
                    }`}>{item.type}</span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium">{item.detail}</p>
                  <p className="text-xs text-gray-500">สถานะ: {item.status}</p>
                </div>
              </div>
            ))}
          </div>
          {(!hotspot.history || hotspot.history.length === 0) && <div className="text-center text-gray-400 py-8">ไม่พบประวัติย้อนหลัง</div>}
        </div>
      </div>
    </div>
  );
}

// --- 4. Main Dashboard Component ---
function IncidentAccidentDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    "อุบัติเหตุ": true, "รถเสีย": true, "สิ่งกีดขวาง": true, "น้ำท่วมขัง": true, "กิจกรรมพิเศษ": true, "ก่อสร้าง": true
  });
  const itemsPerPage = 10;

  const toggleFilter = (type, forceState = null) => {
    setActiveFilters(prev => ({ ...prev, [type]: forceState !== null ? forceState : !prev[type] }));
  };

  // --- Mock Data ---
  const incidents = [
    { id: "#2055", type: "อุบัติเหตุ", vehicle: "Car", location: "ห้าแยกลาดพร้าว", datetime: "09/01/2569 08:30", severity: "Severe", status: "New", cctv: true, lat: 13.814029, lng: 100.560686, plate: "1กข-9999", province: "กทม", brand: "Toyota", color: "ขาว", detail: "ชนท้ายแท็กซี่ กีดขวางเลนขวา" },
    { id: "#2080", type: "น้ำท่วมขัง", vehicle: "-", location: "ตลาดคลองเตย", datetime: "09/01/2569 06:45", severity: "Moderate", status: "In-Process", cctv: true, lat: 13.719000, lng: 100.556000, plate: "-", province: "-", brand: "-", color: "-", detail: "ระดับน้ำสูง 15 ซม. ระยะทาง 200 เมตร", lane_impact: "เสีย 2 ช่องทางซ้าย" },
    { id: "#2058", type: "ก่อสร้าง", vehicle: "-", location: "แยกเกษตร", datetime: "08/01/2569 22:00", severity: "Minor", status: "Verified", cctv: false, lat: 13.839500, lng: 100.575000, plate: "-", province: "-", brand: "-", color: "-", detail: "ปิดเบี่ยงจราจร เพื่อซ่อมผิวถนน", lane_impact: "ไหล่ทาง" },
    { id: "#2090", type: "รถเสีย", vehicle: "Truck", location: "สะพานพระราม 8", datetime: "09/01/2569 13:10", severity: "Moderate", status: "New", cctv: true, lat: 13.769000, lng: 100.498000, plate: "80-5566", province: "นครปฐม", brand: "Isuzu", color: "ขาว", detail: "เครื่องยนต์ขัดข้อง จอดเสียเลนซ้าย" },
    { id: "#2060", type: "อุบัติเหตุ", vehicle: "Motorcycle", location: "แยกอโศกมนตรี", datetime: "09/01/2569 10:00", severity: "Minor", status: "Verified", cctv: true, lat: 13.736886, lng: 100.560370, plate: "3ขจ-567", province: "ชลบุรี", brand: "Honda", color: "ดำ", detail: "เฉี่ยวชนรถยนต์ คู่กรณีตกลงกันได้" },
    { id: "#2070", type: "กิจกรรมพิเศษ", vehicle: "-", location: "ถนนสาทรเหนือ", datetime: "09/01/2569 11:30", severity: "Minor", status: "New", cctv: true, lat: 13.722300, lng: 100.528000, plate: "-", province: "-", brand: "-", color: "-", detail: "ขบวนพาเหรด กิจกรรมวันเด็ก", lane_impact: "ปิดจราจรชั่วคราว" },
    { id: "#1061", type: "อุบัติเหตุ", vehicle: "Bus", location: "อนุสาวรีย์ชัยฯ", datetime: "08/01/2569 16:28", severity: "Severe", status: "Closed", cctv: true, lat: 13.7649, lng: 100.5383, plate: "10-2345", province: "กทม", brand: "Hino", color: "แดง", detail: "รถเมล์เบรคไม่อยู่" },
    { id: "#1021", type: "อุบัติเหตุ", vehicle: "Car", location: "ทางด่วนขั้นที่ 2", datetime: "08/01/2569 14:15", severity: "Moderate", status: "Verified", cctv: true, lat: 13.7750, lng: 100.5450, plate: "กข-1234", province: "กทม", brand: "Mazda", color: "เทา", detail: "ชนขอบทาง ยางแตก" }
  ];

  const hotspots = [
    { rank: 1, location: "ถนนพหลโยธิน (แยกลาดพร้าว)", count: 15, level: "สูง", detail: "อุบัติเหตุสะสมสูงสุดในรอบ 24 ชม.", history: [{ date: "09/01/2569 08:30", type: "อุบัติเหตุ", detail: "รถยนต์ชนท้ายแท็กซี่ 2 คัน", status: "Active" }, { date: "08/01/2569 18:45", type: "รถเสีย", detail: "รถเมล์จอดเสียเลนซ้าย", status: "Closed" }] },
    { rank: 2, location: "ถนนพระราม 4 (คลองเตย)", count: 12, level: "สูง", detail: "น้ำท่วมขังผิวจราจร", history: [] },
    { rank: 3, location: "แยกอโศกมนตรี", count: 9, level: "กลาง", detail: "การจราจรหนาแน่น/เฉี่ยวชน", history: [] },
    { rank: 4, location: "อนุสาวรีย์ชัยสมรภูมิ", count: 7, level: "กลาง", detail: "รถประจำทางจอดเสียบ่อย", history: [] },
    { rank: 5, location: "ทางด่วนขั้นที่ 2 (ขาออก)", count: 5, level: "ต่ำ", detail: "อุบัติเหตุช่วงทางลง", history: [] },
  ];

  const statCounts = {
    total: incidents.length,
    new: incidents.filter(i => i.status === "New").length,
    process: incidents.filter(i => i.status === "In-Process").length,
    closed: incidents.filter(i => ["Verified", "Closed"].includes(i.status)).length,
    accident: incidents.filter(i => i.type === "อุบัติเหตุ").length,
    breakdown: incidents.filter(i => i.type === "รถเสีย").length,
    flood: incidents.filter(i => i.type === "น้ำท่วมขัง").length,
    other: incidents.filter(i => !["อุบัติเหตุ", "รถเสีย", "น้ำท่วมขัง"].includes(i.type)).length
  };

  const filteredMapIncidents = incidents.filter(i => activeFilters[i.type]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentIncidents = incidents.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(incidents.length / itemsPerPage);

  const getSeverityColor = (s) => (s === "Severe" ? "text-red-600 bg-red-50" : s === "Moderate" ? "text-yellow-600 bg-yellow-50" : "text-green-600 bg-green-50");
  const getStatusColor = (s) => (s === "Verified" ? "text-yellow-700 bg-yellow-100" : s === "In-Process" ? "text-orange-600 bg-orange-100" : s === "New" ? "text-blue-600 bg-blue-100" : "text-gray-600 bg-gray-200");

  // --- Graph Data: Incident Trends (Stacked) ---
  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => `${(i * 2).toString().padStart(2, '0')}:00`), // Every 2 hours
    datasets: [
      {
        label: 'แจ้งเตือนใหม่ (New)',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 5)),
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Red
        borderRadius: 4,
      },
      {
        label: 'แก้ไขเสร็จสิ้น (Resolved)',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 5)),
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // Green
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end', labels: { boxWidth: 10, usePointStyle: true, font: { size: 10 } } },
      tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(255,255,255,0.9)', titleColor: '#333', bodyColor: '#666', borderColor: '#ddd', borderWidth: 1 }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { stacked: true, grid: { borderDash: [4, 4] }, ticks: { stepSize: 1, font: { size: 10 } } },
    },
  };

  const StatCard = ({ title, count, icon: Icon, colorClass, bgClass }) => (
    <div className={`p-4 rounded-xl shadow-sm border flex items-center justify-between ${bgClass}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-lg md:text-xl bg-white/60 ${colorClass}`}>
          <Icon />
        </div>
        <div>
          <p className="text-gray-600 text-xs md:text-sm font-medium">{title}</p>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800">{count}</h3>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden bg-slate-50 p-3 md:p-6 font-sans text-gray-800 pb-20">
      <style>{`
        .leaflet-popup-content-wrapper { padding: 0 !important; overflow: hidden; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); }
        .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .leaflet-container a.leaflet-popup-close-button { color: white; top: 8px; right: 8px; text-shadow: 0 1px 2px rgba(0,0,0,0.5); z-index: 20; }
        .custom-marker-icon { background: transparent; border: none; }
        .leaflet-popup-content { min-width: 280px; width: 85vw !important; max-width: 320px !important; }
      `}</style>

      <HistoryModal hotspot={selectedHotspot} onClose={() => setSelectedHotspot(null)} />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 mb-4 md:mb-6">
        <div className="w-full md:w-auto flex items-start gap-3">
          <span className="text-red-600 bg-red-50 p-2 rounded-lg shrink-0">
             <FaCarCrash className="w-5 h-5 md:w-6 md:h-6" />
          </span>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-slate-800 leading-tight">
              Traffic Incident
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              รายงานสภาพจราจรและอุบัติเหตุ (Real-time)
            </p>
          </div>
        </div>
        <div className="w-full md:w-auto">
           <DateTimeDisplay />
        </div>
      </div>

      {/* --- Stats Section --- */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 mb-4 md:mb-6">
        <div>
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm md:text-base">
            <FaLayerGroup className="text-gray-400"/> สถานะการดำเนินการ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute right-0 top-0 h-full w-1 bg-blue-500"></div>
              <div>
                <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">เหตุการณ์ทั้งหมด</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{statCounts.total}</h3>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-lg md:text-xl group-hover:scale-110 transition-transform">
                <FaLayerGroup />
              </div>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute right-0 top-0 h-full w-1 bg-red-500"></div>
              <div>
                <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">แจ้งเตือนใหม่</p>
                <h3 className="text-2xl md:text-3xl font-bold text-red-600">{statCounts.new}</h3>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-lg md:text-xl animate-pulse">
                <FaBell />
              </div>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute right-0 top-0 h-full w-1 bg-orange-500"></div>
              <div>
                <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">กำลังดำเนินการ</p>
                <h3 className="text-2xl md:text-3xl font-bold text-orange-500">{statCounts.process}</h3>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 text-lg md:text-xl group-hover:rotate-180 transition-transform duration-700">
                <FaSpinner />
              </div>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute right-0 top-0 h-full w-1 bg-green-500"></div>
              <div>
                <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">เสร็จสิ้น</p>
                <h3 className="text-2xl md:text-3xl font-bold text-green-600">{statCounts.closed}</h3>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-lg md:text-xl">
                <FaCheckSquare />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm md:text-base">
            <FaCheckSquare className="text-gray-400"/> จำแนกตามประเภท
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
             <StatCard title="อุบัติเหตุ" count={statCounts.accident} icon={FaCarCrash} colorClass="text-purple-600" bgClass="bg-purple-50 border-purple-100" />
             <StatCard title="รถเสีย/กีดขวาง" count={statCounts.breakdown} icon={FaTools} colorClass="text-orange-600" bgClass="bg-orange-50 border-orange-100" />
             <StatCard title="น้ำท่วมขัง" count={statCounts.flood} icon={FaWater} colorClass="text-blue-600" bgClass="bg-blue-50 border-blue-100" />
             <StatCard title="อื่นๆ" count={statCounts.other} icon={FaExclamationTriangle} colorClass="text-gray-600" bgClass="bg-gray-50 border-gray-100" />
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 flex items-start gap-3 text-red-800 mb-6">
          <div className="bg-red-800 text-white rounded-full p-1 mt-0.5 shrink-0"><FaExclamationTriangle className="text-xs" /></div>
          <div>
            <h4 className="font-bold text-xs md:text-sm">แจ้งเตือนความรุนแรงสูง</h4>
            <p className="text-[10px] md:text-xs mt-1">มีเหตุการณ์แจ้งเตือนล่าสุด {statCounts.new} รายการ และระดับสูง 1 รายการ ต้องการความสนใจเร่งด่วน</p>
          </div>
      </div>

      {/* --- Map & Hotspots --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:h-[600px] mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative z-0 flex flex-col h-[400px] md:h-[500px] lg:h-full">
          {typeof window !== "undefined" && (
             <MapContainer center={[13.7563, 100.5018]} zoom={11} className="h-full w-full">
                <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapFilterControl filters={activeFilters} toggleFilter={toggleFilter} />
                <FitBounds incidents={incidents} />
                {filteredMapIncidents.map((i) => {
                  const isVehicleEvent = ["อุบัติเหตุ", "รถเสีย"].includes(i.type);
                  return (
                    <Marker key={i.id} position={[i.lat, i.lng]} icon={getMarkerIcon(i.type)}>
                      <Popup>
                        <div className="font-sans text-gray-800">
                          <div className="bg-slate-900 h-32 md:h-40 relative flex items-center justify-center group cursor-pointer overflow-hidden">
                            <div className={`absolute top-3 right-8 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider z-10 shadow-sm ${
                              i.status === 'New' ? 'bg-blue-500 text-white' : 
                              i.status === 'In-Process' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                            }`}>
                              {i.status}
                            </div>
                            <FaPlay className="text-white text-3xl md:text-4xl opacity-80 group-hover:scale-110 transition-all" />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                              <div className="flex items-center gap-2 text-white">
                                <span className="text-lg">{i.type === 'อุบัติเหตุ' ? <FaCarCrash/> : i.type === 'น้ำท่วมขัง' ? <FaWater/> : <FaExclamationTriangle/>}</span>
                                <span className="font-bold text-sm tracking-wide">{i.type}</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 md:p-4 bg-white">
                            <div className="flex items-start gap-2 mb-3 text-gray-700">
                              <FaMapMarkerAlt className="mt-1 text-red-500 flex-shrink-0" />
                              <span className="font-semibold text-xs md:text-sm leading-tight">{i.location}</span>
                            </div>
                            {isVehicleEvent ? (
                              <div className="flex gap-2 mb-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <div className="border-2 border-black rounded px-2 py-1 text-center min-w-[70px] bg-white shadow-sm">
                                  <div className="text-sm md:text-base font-black text-gray-900 leading-none">{i.plate}</div>
                                  <div className="text-[8px] text-gray-500 mt-0.5">{i.province}</div>
                                </div>
                                <div className="flex flex-col justify-center text-[10px] md:text-xs">
                                  <span className="text-gray-500">ยานพาหนะ:</span>
                                  <span className="font-medium text-gray-800">{i.brand} / {i.color}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-2 mb-3 bg-blue-50 p-2 rounded-lg border border-blue-100">
                                <div className="min-w-[30px] flex items-center justify-center text-blue-500 text-lg"><FaExclamationTriangle /></div>
                                <div className="flex flex-col justify-center text-[10px] md:text-xs">
                                  <span className="text-blue-800 font-bold mb-0.5">ผลกระทบ:</span>
                                  <span className="text-blue-700 font-medium leading-tight">{i.lane_impact || "ระมัดระวัง"}</span>
                                </div>
                              </div>
                            )}
                            <div className="text-[10px] md:text-xs text-gray-600 mb-3 leading-relaxed border-l-2 border-gray-300 pl-2">
                              {i.detail || "ไม่มีรายละเอียดเพิ่มเติม"}
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-gray-400 border-t pt-2 mt-2">
                              <div className="flex items-center gap-1"><FaClock /> {i.datetime.split(' ')[1]} น.</div>
                              <div className="flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${i.severity === 'Severe' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                Level: {i.severity}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
             </MapContainer>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 overflow-y-auto max-h-[400px] lg:max-h-full">
          <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2 sticky top-0 bg-white py-1 z-10">
            <FaFireAlt className="text-red-500"/> จุดเกิดเหตุบ่อย (Hotspots)
          </h3>
          <div className="space-y-3">
             {hotspots.map((spot, idx) => (
               <div key={idx} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all group hover:border-blue-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gray-100 px-2 py-1 rounded-bl-lg text-[10px] text-gray-500 font-bold">#{spot.rank}</div>
                  <div className="flex justify-between items-start mb-2 pr-6">
                    <div>
                      <h4 className="font-bold text-sm text-gray-800 mb-0.5 group-hover:text-blue-600 line-clamp-1">{spot.location}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${spot.level === 'สูง' ? 'bg-red-500' : spot.level === 'กลาง' ? 'bg-orange-400' : 'bg-green-500'}`}>ความถี่: {spot.level}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2 bg-gray-50 p-2 rounded">{spot.detail}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                     <span className="text-xs font-semibold text-gray-600">สะสม {spot.count} ครั้ง</span>
                     <button onClick={() => setSelectedHotspot(spot)} className="text-[10px] text-blue-600 font-medium hover:underline flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                       <FaHistory /> ดูประวัติ
                     </button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* --- Responsive Graphs & Tables --- */}
      <div className="space-y-4 md:space-y-6">
        
        {/* IMPROVED GRAPH SECTION (Chart.js) */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div className="flex items-center gap-2">
               <FaChartBar className="text-blue-500"/>
               <h3 className="font-semibold text-gray-800 text-sm md:text-base">แนวโน้มเหตุการณ์ (24 ชั่วโมง)</h3>
            </div>
          </div>
          <div className="mb-2 h-[250px] md:h-[350px]">
             {/* Updated Chart Component */}
             <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Traffic Status */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-sm md:text-base">สภาพการจราจร</h3>
          <div className="space-y-4">
            {[
              { road: "ทางหลวง 1", speed: 25, maxSpeed: 80, color: "bg-red-500", label: "ติดขัด" },
              { road: "ทางด่วนพิเศษ", speed: 65, maxSpeed: 100, color: "bg-yellow-500", label: "ปานกลาง" },
              { road: "ถนนพระราม 4", speed: 20, maxSpeed: 60, color: "bg-red-600", label: "ติดขัดมาก" },
            ].map((r, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs md:text-sm mb-2">
                  <span className="font-medium text-gray-700">{r.road}</span>
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-gray-600">{r.speed} กม./ชม.</span>
                    <span className={`text-[10px] md:text-xs px-2 py-1 rounded ${r.speed < 30 ? 'bg-red-100 text-red-700' : r.speed < 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{r.label}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${r.color} rounded-full transition-all`} style={{ width: `${(r.speed / r.maxSpeed) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TABLE SECTION (Mobile Cards / Desktop Table) */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h3 className="font-semibold text-gray-800 text-sm md:text-base">ตารางเหตุการณ์ทั้งหมด</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-auto">
                <FaSearch className="text-gray-400" />
                <input className="bg-transparent outline-none text-sm w-full sm:w-48" placeholder="ค้นหา..." />
              </div>
            </div>
          </div>

          {/* 1. Mobile Card View (Hidden on MD up) */}
          <div className="md:hidden space-y-3">
            {currentIncidents.map((incident, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-3 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${incident.type === 'อุบัติเหตุ' ? 'bg-red-500' : incident.type === 'รถเสีย' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                         {incident.type === 'อุบัติเหตุ' ? <FaCarCrash/> : <FaExclamationTriangle/>}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-gray-800">{incident.type}</div>
                        <div className="text-[10px] text-gray-500">{incident.id}</div>
                      </div>
                   </div>
                   <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusColor(incident.status)}`}>{incident.status}</span>
                </div>
                <div className="text-xs text-gray-700 font-medium mb-1 flex items-center gap-1">
                   <FaMapMarkerAlt className="text-red-400"/> {incident.location}
                </div>
                <div className="text-xs text-gray-500 mb-2 pl-4 border-l-2 border-gray-200">
                   {incident.detail}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-[10px] text-gray-400">
                   <span>{incident.datetime}</span>
                   <button className="flex items-center gap-1 text-blue-600 font-bold">
                     รายละเอียด <FaChevronRight/>
                   </button>
                </div>
              </div>
            ))}
          </div>

          {/* 2. Desktop Table View (Hidden on Mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600 text-left">
                  <th className="py-3 px-2 font-medium">รหัส</th>
                  <th className="py-3 px-2 font-medium">ประเภท</th>
                  <th className="py-3 px-2 font-medium">สถานที่</th>
                  <th className="py-3 px-2 font-medium">รายละเอียด</th>
                  <th className="py-3 px-2 font-medium">เวลา</th>
                  <th className="py-3 px-2 font-medium">ระดับ</th>
                  <th className="py-3 px-2 font-medium">สถานะ</th>
                  <th className="py-3 px-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {currentIncidents.map((incident, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-800">{incident.id}</td>
                    <td className="py-3 px-2 text-gray-700 flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${incident.type === 'อุบัติเหตุ' ? 'bg-red-500' : incident.type === 'รถเสีย' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>{incident.type}</td>
                    <td className="py-3 px-2 text-gray-600">{incident.location}</td>
                    <td className="py-3 px-2 text-gray-500 truncate max-w-[150px]">{incident.detail}</td>
                    <td className="py-3 px-2 text-gray-600">{incident.datetime}</td>
                    <td className="py-3 px-2"><span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(incident.severity)}`}>{incident.severity}</span></td>
                    <td className="py-3 px-2"><span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(incident.status)}`}>{incident.status}</span></td>
                    <td className="py-3 px-2"><button className="text-gray-400 hover:text-gray-600"><FaEye /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm gap-3">
            <span className="text-gray-600 text-xs sm:text-sm">หน้า {currentPage} จาก {totalPages} ({incidents.length} รายการ)</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled={currentPage === 1}><FaChevronLeft className="text-xs" /></button>
              <div className="hidden sm:flex gap-1">
                {[...Array(totalPages)].map((_, i) => (<button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}>{i + 1}</button>))}
              </div>
              <span className="sm:hidden text-gray-800 font-bold">{currentPage}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled={currentPage === totalPages}><FaChevronRight className="text-xs" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentAccidentDashboard;