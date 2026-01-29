// dashboard.jsx
import React, { useState, useMemo } from "react";
import {
  FaLayerGroup, FaBell, FaSpinner, FaCheckSquare,
  FaCarCrash, FaTools, FaExclamationTriangle, FaChartBar,
  FaHistory, FaTimes, FaRoad, FaFireAlt
} from "react-icons/fa";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// --- Imports Components ---
import DateTimeDisplay from "../../components/ui/DateTimeDisplay";
import IncidentMap from "../../components/ui/IncidentMap";
import HotspotsPanel from "../../components/ui/HotspotsPanel";
import IncidentTable from "../../components/ui/IncidentTable";

// --- Imports Data ---
import { incidentData } from "./DataTest/incidentMockData";
import { hotspotsData } from "./DataTest/hotspotsData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- History Modal ---
function HistoryModal({ hotspot, onClose }) {
  if (!hotspot) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center sticky top-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{hotspot.location}</h3>
            <span className="text-xs text-gray-500">ประวัติเหตุการณ์</span>
          </div>
          <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-red-500 text-xl" /></button>
        </div>
        <div className="p-4 overflow-y-auto space-y-4">
          {hotspot.history?.map((item, idx) => (
            <div key={idx} className="flex gap-3 border-b pb-2 last:border-0">
               <div className={`w-2 h-full rounded-full ${item.type.includes('ชน') ? 'bg-red-500' : 'bg-blue-500'}`}></div>
               <div>
                 <div className="font-bold text-sm">{item.type}</div>
                 <div className="text-xs text-gray-500">ID: {item.id}</div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Dashboard ---
function IncidentAccidentDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // --- 1. Data Adapter (Updated Logic) ---
  const incidents = useMemo(() => {
    return incidentData.map((item) => {
      // 1.1 จัด Category
      let category = "อื่นๆ";
      if (item.id.startsWith("EV")) category = "กิจกรรมพิเศษ";
      else if (item.id.startsWith("RD")) category = "ก่อสร้าง";
      else if (item.id.startsWith("OB")) category = "สิ่งกีดขวาง";
      else if (item.id.startsWith("HZ")) category = "อันตราย";
      else if (item.id.startsWith("VH")) {
        if (item.type.includes("เสีย")) category = "รถเสีย";
        else category = "อุบัติเหตุ";
      }

      // 1.2 [FIXED] สร้างข้อมูลยานพาหนะ (Vehicle Info) แบบฉลาดขึ้น
      let vehicleInfo = "-";
      
      // กรณีที่ 1: มีข้อมูลยี่ห้อ/ทะเบียนครบ (จาก mock data ใหม่)
      if (item.brand && item.brand !== "-") {
         vehicleInfo = `${item.brand} ${item.color !== "-" ? item.color : ""} ${item.plate !== "-" ? "(" + item.plate + ")" : ""}`;
      } 
      // กรณีที่ 2: ไม่มีข้อมูลยี่ห้อ แต่มี subtype (เช่น accident_bus, breakdown_car)
      else if (item.subtype && (category === "รถเสีย" || category === "อุบัติเหตุ")) {
         // แยกคำหลัง _ มาทำเป็นตัวพิมพ์ใหญ่ (เช่น "bus" -> "Bus")
         const parts = item.subtype.split("_");
         if (parts.length > 1) {
             const typeName = parts[1];
             vehicleInfo = typeName.charAt(0).toUpperCase() + typeName.slice(1); // แสดง "Bus", "Car" แทน
         }
      }

      return {
        ...item,
        type: item.type,
        category: category,
        subtype: item.subtype,
        datetime: item.datetime,
        vehicle: vehicleInfo, // ส่งค่านี้ไปที่ IncidentTable
        displayStatus: item.status === "New" ? "New" : item.status === "Closed" ? "Closed" : "In-Process",
      };
    });
  }, []);

  const hotspots = useMemo(() => {
    return hotspotsData.map((h) => ({
      ...h,
      count: h.incidentCount,
      level: h.severityLevel === "Critical" ? "วิกฤต" : h.severityLevel === "High" ? "สูง" : "กลาง",
      detail: `${h.mostCommonType} (${h.trend})`,
      history: h.activeIncidents.map((inc) => ({ id: inc.id, type: inc.type, status: "Active" })),
    }));
  }, []);

  // --- Stats Calculation ---
  const statCounts = useMemo(() => {
    return {
      total: incidents.length,
      new: incidents.filter((i) => i.status === "New").length,
      process: incidents.filter((i) => i.status === "Verified").length,
      closed: incidents.filter((i) => i.status === "Closed").length,
      accident: incidents.filter((i) => i.category === "อุบัติเหตุ" || i.category === "อันตราย").length,
      breakdown: incidents.filter((i) => i.category === "รถเสีย").length,
      obstruction: incidents.filter((i) => i.category === "สิ่งกีดขวาง").length,
      traffic: incidents.filter((i) => i.category === "กิจกรรมพิเศษ" || i.category === "ก่อสร้าง").length,
    };
  }, [incidents]);

  // --- Chart Config ---
  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) => `${(i * 2).toString().padStart(2, "0")}:00`),
    datasets: [
      { label: "New", data: [2, 4, 1, 5, 2, 3, 6, 4, 2, 1, 3, 2], backgroundColor: "#EF4444", borderRadius: 4 },
      { label: "Resolved", data: [1, 3, 2, 4, 3, 4, 5, 3, 3, 2, 4, 3], backgroundColor: "#10B981", borderRadius: 4 },
    ],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: "top", align: "end", labels: { boxWidth: 10, usePointStyle: true } } },
    scales: { x: { grid: { display: false } }, y: { grid: { borderDash: [4, 4] } } },
  };

  // --- Reusable Stat Card Component ---
  const StatCard = ({ title, count, icon: Icon, colorClass, bgClass, borderClass }) => (
    <div className={`p-4 rounded-xl shadow-sm border ${bgClass} ${borderClass} flex items-center justify-between transition-transform hover:scale-[1.02] duration-200`}>
      <div className="flex flex-col">
        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</span>
        <span className={`text-2xl font-bold ${colorClass}`}>{count}</span>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl bg-white ${colorClass} shadow-sm`}>
        <Icon />
      </div>
    </div>
  );

  return (
    <div className="h-screen overflow-y-auto w-full bg-slate-50 p-4 md:p-6 font-sans text-gray-800 pb-20">
      <HistoryModal hotspot={selectedHotspot} onClose={() => setSelectedHotspot(null)} />

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-red-600 bg-red-50 p-2 rounded-lg"><FaCarCrash className="w-6 h-6" /></span>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">Traffic Incident</h1>
            <p className="text-xs text-slate-500">Real-time Monitoring Dashboard</p>
          </div>
        </div>
        <DateTimeDisplay />
      </div>

      {/* --- Section 1: สถานะการดำเนินการ (Full Width Row) --- */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3 text-sm md:text-base">
          <FaLayerGroup className="text-blue-500" /> สถานะการดำเนินการ (Operational Status)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="เหตุการณ์ทั้งหมด" 
            count={statCounts.total} 
            icon={FaLayerGroup} 
            colorClass="text-slate-700" 
            bgClass="bg-white" 
            borderClass="border-slate-200 border-l-4 border-l-slate-500"
          />
          <StatCard 
            title="แจ้งเตือนใหม่" 
            count={statCounts.new} 
            icon={FaBell} 
            colorClass="text-red-600" 
            bgClass="bg-white" 
            borderClass="border-red-100 border-l-4 border-l-red-500"
          />
          <StatCard 
            title="กำลังดำเนินการ" 
            count={statCounts.process} 
            icon={FaSpinner} 
            colorClass="text-orange-500" 
            bgClass="bg-white" 
            borderClass="border-orange-100 border-l-4 border-l-orange-500"
          />
          <StatCard 
            title="เสร็จสิ้น" 
            count={statCounts.closed} 
            icon={FaCheckSquare} 
            colorClass="text-green-600" 
            bgClass="bg-white" 
            borderClass="border-green-100 border-l-4 border-l-green-500"
          />
        </div>
      </div>

      {/* --- Section 2: จำแนกตามประเภท (Full Width Row) --- */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3 text-sm md:text-base">
          <FaCheckSquare className="text-indigo-500" /> จำแนกตามประเภท (Categorization)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           <StatCard 
             title="อุบัติเหตุ / อันตราย" 
             count={statCounts.accident} 
             icon={FaCarCrash} 
             colorClass="text-purple-600" 
             bgClass="bg-purple-50" 
             borderClass="border-purple-200"
           />
           <StatCard 
             title="ยานพาหนะขัดข้อง" 
             count={statCounts.breakdown} 
             icon={FaTools} 
             colorClass="text-orange-600" 
             bgClass="bg-orange-50" 
             borderClass="border-orange-200"
           />
           <StatCard 
             title="สิ่งกีดขวาง / ภัยธรรมชาติ" 
             count={statCounts.obstruction} 
             icon={FaExclamationTriangle} 
             colorClass="text-yellow-600" 
             bgClass="bg-yellow-50" 
             borderClass="border-yellow-200"
           />
           <StatCard 
             title="จราจร / กิจกรรม / ก่อสร้าง" 
             count={statCounts.traffic} 
             icon={FaRoad} 
             colorClass="text-blue-600" 
             bgClass="bg-blue-50" 
             borderClass="border-blue-200"
           />
        </div>
      </div>

      {/* --- Section 3: Map & Hotspots --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[500px] relative z-0">
          <IncidentMap incidents={incidents} mapCenter={[13.78, 100.56]} zoom={11} /> 
        </div>
        <div className="lg:col-span-1 h-[500px]">
          <HotspotsPanel hotspots={hotspots} onHotspotClick={setSelectedHotspot} />
        </div>
      </div>

      {/* --- Section 4: Graphs & Table --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-[350px]">
          <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="text-blue-500" />
            <h3 className="font-semibold text-gray-800">แนวโน้มเหตุการณ์ (24 ชม.)</h3>
          </div>
          <div className="h-[250px] w-full">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Traffic List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 border border-gray-200 h-[350px] overflow-y-auto">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaRoad className="text-gray-400"/> สภาพจราจร (เส้นทางหลัก)
          </h3>
          <div className="space-y-4">
             {[{n:"พหลโยธิน",s:35,m:80,c:"bg-yellow-500",t:"ชะลอตัว"},{n:"วิภาวดีรังสิต",s:70,m:100,c:"bg-green-500",t:"คล่องตัว"},{n:"ลาดพร้าว",s:15,m:60,c:"bg-red-600",t:"ติดขัดมาก"},{n:"สุขุมวิท",s:20,m:60,c:"bg-red-500",t:"ติดขัด"}].map((r,i)=>(
               <div key={i} className="group">
                 <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{r.n}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{r.t} ({r.s} km/h)</span>
                 </div>
                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${r.c} rounded-full transition-all duration-500 group-hover:opacity-80`} style={{width:`${(r.s/r.m)*100}%`}}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
        
        {/* Table */}
        <div className="lg:col-span-3">
          <IncidentTable incidents={incidents} currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}

export default IncidentAccidentDashboard;