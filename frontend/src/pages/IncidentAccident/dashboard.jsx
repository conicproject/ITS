// src/pages/IncidentAccident/dashboard.jsx
import React, { useState, useMemo } from "react";
import {
  FaLayerGroup,
  FaBell,
  FaSpinner,
  FaCheckSquare,
  FaCarCrash,
  FaTools,
  FaExclamationTriangle,
  FaChartBar,
  FaHistory,
  FaTimes,
  FaRoad,
  FaFireAlt,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// --- Imports Components ---
import DateTimeDisplay from "../../components/ui/DateTimeDisplay";
import IncidentMap from "../../components/ui/IncidentMap";
import HotspotsPanel from "../../components/ui/HotspotsPanel";
import IncidentTable from "../../components/ui/IncidentTable";
// Import IncidentStats เข้ามาใช้งาน
import IncidentStats from "../../components/ui/IncidentStats";

// --- MOCK DATA SECTION ---

const incidentData = [
  // --- 1. ระบบเก็บและแสดงข้อมูลอุบัติเหตุ (สีแดง) ---
  {
    id: "AC-2025001",
    type: "อุบัติเหตุ",
    subtype: "crash",
    location: "ถนนพหลโยธิน หน้าเซ็นทรัลลาดพร้าว",
    datetime: "2025-02-03 08:15:00",
    severity: "High",
    status: "New",
    cctv: true,
    lat: 13.816,
    lng: 100.561,
    brand: "Honda",
    color: "ดำ",
    plate: "กข 1234",
  },
  {
    id: "AC-2025002",
    type: "อุบัติเหตุ",
    subtype: "rollover",
    location: "ทางพิเศษศรีรัช ช่วงทางลงอนุสาวรีย์ชัยฯ",
    datetime: "2025-02-03 09:30:00",
    severity: "High",
    status: "Verified",
    cctv: true,
    lat: 13.766,
    lng: 100.536,
    brand: "Isuzu",
    color: "ขาว",
    plate: "ถน 999",
  },
  {
    id: "AC-2025003",
    type: "อุบัติเหตุ",
    subtype: "breakdown",
    location: "ถนนเพชรบุรีตัดใหม่ ใกล้แยกคลองตัน",
    datetime: "2025-02-03 10:05:00",
    severity: "Medium",
    status: "In Progress",
    cctv: false,
    lat: 13.743,
    lng: 100.598,
    brand: "Toyota",
    color: "เทา",
    plate: "2กข 5566",
  },

  // --- 2. ระบบเก็บและแสดงข้อมูลสิ่งกีดขวางบนถนน (สีเหลือง) ---
  {
    id: "OB-2025001",
    type: "สิ่งกีดขวาง",
    subtype: "debris",
    location: "ถนนพระราม 4 หน้าสวนลุมพินี",
    datetime: "2025-02-03 07:45:00",
    severity: "Low",
    status: "Verified",
    cctv: true,
    lat: 13.729,
    lng: 100.541,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "OB-2025002",
    type: "สิ่งกีดขวาง",
    subtype: "natural",
    location: "ถนนสุขุมวิท ซอย 24 (ต้นไม้ล้มขวางทาง)",
    datetime: "2025-02-03 11:20:00",
    severity: "Medium",
    status: "In Progress",
    cctv: false,
    lat: 13.731,
    lng: 100.565,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "OB-2025003",
    type: "สิ่งกีดขวาง",
    subtype: "collapse",
    location: "เขตก่อสร้างรถไฟฟ้า ถนนลาดพร้าว",
    datetime: "2025-02-03 12:00:00",
    severity: "High",
    status: "New",
    cctv: true,
    lat: 13.785,
    lng: 100.585,
    brand: "-",
    color: "-",
    plate: "-",
  },

  // --- 3. ระบบเก็บและแสดงข้อมูลเหตุการณ์อันตรายพิเศษ (สีน้ำเงิน) ---
  {
    id: "HZ-2025001",
    type: "อันตรายพิเศษ",
    subtype: "fire",
    location: "ชุมชนใกล้ถนนพระราม 3",
    datetime: "2025-02-03 13:10:00",
    severity: "High",
    status: "New",
    cctv: true,
    lat: 13.697,
    lng: 100.531,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "HZ-2025002",
    type: "อันตรายพิเศษ",
    subtype: "chemical",
    location: "ถ.กาญจนาภิเษก ช่วงคลังสินค้า",
    datetime: "2025-02-03 14:00:00",
    severity: "High",
    status: "In Progress",
    cctv: true,
    lat: 13.702,
    lng: 100.412,
    brand: "Truck",
    color: "เหลือง",
    plate: "80-xxxx",
  },
  {
    id: "HZ-2025003",
    type: "อันตรายพิเศษ",
    subtype: "smoke",
    location: "อุโมงค์ดินแดง (กลุ่มควันหนาแน่น)",
    datetime: "2025-02-03 15:45:00",
    severity: "Medium",
    status: "Verified",
    cctv: true,
    lat: 13.762,
    lng: 100.551,
    brand: "-",
    color: "-",
    plate: "-",
  },

  // --- 4. ความผิดปกติของถนนและระบบกำกับจราจร (สีส้ม) ---
  {
    id: "RG-2025001",
    type: "ความผิดปกติ",
    subtype: "road_work",
    location: "ถนนวิภาวดีรังสิต ขาออก กม. 18",
    datetime: "2025-02-03 22:00:00",
    severity: "Medium",
    status: "Verified",
    cctv: true,
    lat: 13.832,
    lng: 100.556,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "RG-2025002",
    type: "ความผิดปกติ",
    subtype: "traffic_light",
    location: "แยกอโศก-มนตรี",
    datetime: "2025-02-03 16:30:00",
    severity: "Medium",
    status: "In Progress",
    cctv: true,
    lat: 13.737,
    lng: 100.56,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "RG-2025003",
    type: "ความผิดปกติ",
    subtype: "breakdown",
    location: "บนสะพานพระราม 8 ขาเข้า",
    datetime: "2025-02-03 17:15:00",
    severity: "Low",
    status: "New",
    cctv: true,
    lat: 13.769,
    lng: 100.493,
    brand: "Mazda",
    color: "แดง",
    plate: "3กย 789",
  },

  // --- ข้อมูลเพิ่มเติม ---
  {
    id: "AC-2025004",
    type: "อุบัติเหตุ",
    subtype: "crash",
    location: "แยกปทุมวัน",
    datetime: "2025-02-03 18:00:00",
    severity: "Medium",
    status: "In Progress",
    cctv: true,
    lat: 13.746,
    lng: 100.53,
    brand: "Bus",
    color: "น้ำเงิน",
    plate: "10-2233",
  },
  {
    id: "OB-2025004",
    type: "สิ่งกีดขวาง",
    subtype: "debris",
    location: "ถ.บรมราชชนนี",
    datetime: "2025-02-03 18:30:00",
    severity: "Low",
    status: "Verified",
    cctv: false,
    lat: 13.785,
    lng: 100.456,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "RG-2025004",
    type: "ความผิดปกติ",
    subtype: "road_work",
    location: "ถ.รามคำแหง",
    datetime: "2025-02-03 19:00:00",
    severity: "Low",
    status: "Verified",
    cctv: true,
    lat: 13.759,
    lng: 100.615,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "HZ-2025004",
    type: "อันตรายพิเศษ",
    subtype: "fire",
    location: "โกดังสินค้า ราษฎร์บูรณะ",
    datetime: "2025-02-03 19:45:00",
    severity: "High",
    status: "New",
    cctv: true,
    lat: 13.682,
    lng: 100.505,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "AC-2025005",
    type: "อุบัติเหตุ",
    subtype: "rollover",
    location: "วงแหวนกาญจนา",
    datetime: "2025-02-03 20:15:00",
    severity: "High",
    status: "In Progress",
    cctv: false,
    lat: 13.65,
    lng: 100.43,
    brand: "Truck",
    color: "ส้ม",
    plate: "70-xxxx",
  },
  {
    id: "RG-2025005",
    type: "ความผิดปกติ",
    subtype: "traffic_light",
    location: "แยกดินแดง",
    datetime: "2025-02-03 20:45:00",
    severity: "Medium",
    status: "New",
    cctv: true,
    lat: 13.762,
    lng: 100.54,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "OB-2025005",
    type: "สิ่งกีดขวาง",
    subtype: "natural",
    location: "ถนนนครอินทร์",
    datetime: "2025-02-03 21:00:00",
    severity: "Low",
    status: "Verified",
    cctv: true,
    lat: 13.827,
    lng: 100.46,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "AC-2025006",
    type: "อุบัติเหตุ",
    subtype: "breakdown",
    location: "ทางด่วนฉลองรัช",
    datetime: "2025-02-03 21:30:00",
    severity: "Low",
    status: "In Progress",
    cctv: true,
    lat: 13.79,
    lng: 100.605,
    brand: "Nissan",
    color: "น้ำเงิน",
    plate: "1กข 4455",
  },
  {
    id: "HZ-2025005",
    type: "อันตรายพิเศษ",
    subtype: "smoke",
    location: "ถ.กิ่งแก้ว",
    datetime: "2025-02-03 22:15:00",
    severity: "Medium",
    status: "Verified",
    cctv: false,
    lat: 13.655,
    lng: 100.685,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "RG-2025006",
    type: "ความผิดปกติ",
    subtype: "road_work",
    location: "ถ.สาทรใต้",
    datetime: "2025-02-03 23:00:00",
    severity: "Low",
    status: "In Progress",
    cctv: true,
    lat: 13.722,
    lng: 100.528,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "OB-2025006",
    type: "สิ่งกีดขวาง",
    subtype: "collapse",
    location: "ถ.ประชาชื่น",
    datetime: "2025-02-03 23:30:00",
    severity: "High",
    status: "New",
    cctv: true,
    lat: 13.82,
    lng: 100.538,
    brand: "-",
    color: "-",
    plate: "-",
  },
  {
    id: "AC-2025007",
    type: "อุบัติเหตุ",
    subtype: "crash",
    location: "แยกราชประสงค์",
    datetime: "2025-02-04 00:15:00",
    severity: "Medium",
    status: "New",
    cctv: true,
    lat: 13.744,
    lng: 100.54,
    brand: "Taxi",
    color: "เหลืองเขียว",
    plate: "ทห 111",
  },
  {
    id: "HZ-2025006",
    type: "อันตรายพิเศษ",
    subtype: "chemical",
    location: "ท่าเรือคลองเตย",
    datetime: "2025-02-04 01:00:00",
    severity: "High",
    status: "Verified",
    cctv: true,
    lat: 13.708,
    lng: 100.575,
    brand: "-",
    color: "-",
    plate: "-",
  },
];

const hotspotsData = [
  {
    rank: 1,
    location: "แยกรัชโยธิน",
    incidentCount: 15,
    severityLevel: "Critical",
    mostCommonType: "รถชน",
    trend: "+20%",
    activeIncidents: [
      { id: "HZ-001", type: "รถชน" },
      { id: "HZ-002", type: "รถชน" },
    ],
  },
  {
    rank: 2,
    location: "สะพานตากสิน",
    incidentCount: 12,
    severityLevel: "High",
    mostCommonType: "รถเสีย",
    trend: "+5%",
    activeIncidents: [{ id: "VH-003", type: "รถเสีย" }],
  },
  {
    rank: 3,
    location: "แยกศาลาแดง",
    incidentCount: 8,
    severityLevel: "Medium",
    mostCommonType: "ฝ่าไฟแดง",
    trend: "-10%",
    activeIncidents: [],
  },
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// --- History Modal ---
function HistoryModal({ hotspot, onClose }) {
  if (!hotspot) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center sticky top-0">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {hotspot.location}
            </h3>
            <span className="text-xs text-gray-500">ประวัติเหตุการณ์</span>
          </div>
          <button onClick={onClose}>
            <FaTimes className="text-gray-400 hover:text-red-500 text-xl" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-4">
          {hotspot.history?.map((item, idx) => (
            <div key={idx} className="flex gap-3 border-b pb-2 last:border-0">
              <div
                className={`w-2 h-full rounded-full ${item.type.includes("ชน") ? "bg-red-500" : "bg-blue-500"}`}
              ></div>
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
      // 1.1 จัด Category ให้ตรงกับ Prefix ของ ID และ Subtype ใน incidentData
      let category = "อื่นๆ";

      if (item.id.startsWith("AC")) {
        category = item.subtype === "breakdown" ? "รถเสีย" : "อุบัติเหตุ";
      } else if (item.id.startsWith("OB")) {
        category = "สิ่งกีดขวาง";
      } else if (item.id.startsWith("HZ")) {
        category = "อันตราย";
      } else if (item.id.startsWith("RG")) {
        if (item.subtype === "breakdown") category = "รถเสีย";
        else if (item.subtype === "road_work") category = "ก่อสร้าง";
        else category = "จราจร";
      }

      // 1.2 สร้างข้อมูลยานพาหนะ (Vehicle Info)
      let vehicleInfo = "-";

      if (item.brand && item.brand !== "-") {
        vehicleInfo = `${item.brand} ${item.color !== "-" ? item.color : ""} ${item.plate !== "-" ? "(" + item.plate + ")" : ""}`;
      } else if (
        item.subtype &&
        (category === "รถเสีย" || category === "อุบัติเหตุ")
      ) {
        const parts = item.subtype.split("_");
        if (parts.length > 1) {
          const typeName = parts[1];
          vehicleInfo = typeName.charAt(0).toUpperCase() + typeName.slice(1);
        } else {
          vehicleInfo =
            item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1);
        }
      }

      return {
        ...item,
        type: item.type,
        category: category,
        subtype: item.subtype,
        datetime: item.datetime,
        vehicle: vehicleInfo,
        displayStatus:
          item.status === "New"
            ? "New"
            : item.status === "Closed"
              ? "Closed"
              : "In-Process",
      };
    });
  }, []);

  const hotspots = useMemo(() => {
    return hotspotsData.map((h) => ({
      ...h,
      count: h.incidentCount,
      level:
        h.severityLevel === "Critical"
          ? "วิกฤต"
          : h.severityLevel === "High"
            ? "สูง"
            : "กลาง",
      detail: `${h.mostCommonType} (${h.trend})`,
      history: h.activeIncidents.map((inc) => ({
        id: inc.id,
        type: inc.type,
        status: "Active",
      })),
    }));
  }, []);

  // --- Stats Calculation สำหรับ Section 2 (Categorization Counts) ---
  const statCounts = useMemo(() => {
    return {
      accident: incidents.filter(
        (i) => i.category === "อุบัติเหตุ" || i.category === "อันตราย",
      ).length,
      breakdown: incidents.filter((i) => i.category === "รถเสีย").length,
      obstruction: incidents.filter((i) => i.category === "สิ่งกีดขวาง").length,
      traffic: incidents.filter(
        (i) => i.category === "จราจร" || i.category === "ก่อสร้าง",
      ).length,
    };
  }, [incidents]);

  // --- Chart Config ---
  const chartData = {
    labels: Array.from(
      { length: 12 },
      (_, i) => `${(i * 2).toString().padStart(2, "0")}:00`,
    ),
    datasets: [
      {
        label: "New",
        data: [2, 4, 1, 5, 2, 3, 6, 4, 2, 1, 3, 2],
        backgroundColor: "#EF4444",
        borderRadius: 4,
      },
      {
        label: "Resolved",
        data: [1, 3, 2, 4, 3, 4, 5, 3, 3, 2, 4, 3],
        backgroundColor: "#10B981",
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: { boxWidth: 10, usePointStyle: true },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { borderDash: [4, 4] } },
    },
  };

  // --- Reusable Stat Card Component (ใช้เฉพาะ Section 2 แล้ว) ---
  const StatCard = ({
    title,
    count,
    icon: Icon,
    colorClass,
    bgClass,
    borderClass,
  }) => (
    <div
      className={`p-4 rounded-xl shadow-sm border ${bgClass} ${borderClass} flex items-center justify-between transition-transform hover:scale-[1.02] duration-200`}
    >
      <div className="flex flex-col">
        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
          {title}
        </span>
        <span className={`text-2xl font-bold ${colorClass}`}>{count}</span>
      </div>
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${colorClass} shadow-sm`}
      >
        <Icon />
      </div>
    </div>
  );

  return (
    <div className="h-screen overflow-y-auto w-full p-4 md:p-6 font-sans text-gray-800 pb-20">
      <HistoryModal
        hotspot={selectedHotspot}
        onClose={() => setSelectedHotspot(null)}
      />

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 rounded-xl shadow-sm border mb-6">
        <div className="flex items-center gap-3">
          <span className="text-red-600 bg-red-50 p-2 rounded-lg">
            <FaCarCrash className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">
              Traffic Incident
            </h1>
            <p className="text-xs text-slate-500">
              Real-time Monitoring Dashboard
            </p>
          </div>
        </div>
        <DateTimeDisplay />
      </div>

      {/* --- Section 1: สถานะการดำเนินการ (Operational Status) นำ IncidentStats มาใช้ --- */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3 text-sm md:text-base">
          <FaLayerGroup className="text-blue-500" /> สถานะการดำเนินการ
          (Operational Status)
        </h3>
        
        {/* เรียกใช้ Component ที่แยกไว้ */}
        <IncidentStats incidents={incidents} />

      </div>

      {/* --- Section 2: จำแนกตามประเภท (Categorization) --- */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3 text-sm md:text-base">
          <FaCheckSquare className="text-indigo-500" /> จำแนกตามประเภท
          (Categorization)
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
        <div className="lg:col-span-2 rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[500px] relative z-0">
          <IncidentMap
            incidents={incidents}
            mapCenter={[13.78, 100.56]}
            zoom={11}
          />
        </div>
        <div className="lg:col-span-1 h-[500px]">
          <HotspotsPanel
            hotspots={hotspots}
            onHotspotClick={setSelectedHotspot}
          />
        </div>
      </div>

      {/* --- Section 4: Graphs & Table --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph */}
        <div className="lg:col-span-2 rounded-xl shadow-sm p-6 border border-gray-200 h-[350px]">
          <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="text-blue-500" />
            <h3 className="font-semibold text-gray-800">
              แนวโน้มเหตุการณ์ (24 ชม.)
            </h3>
          </div>
          <div className="h-[250px] w-full">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Traffic List */}
        <div className="lg:col-span-1 rounded-xl shadow-sm p-6 border border-gray-200 h-[350px] overflow-y-auto">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaRoad className="text-gray-400" /> สภาพจราจร (เส้นทางหลัก)
          </h3>
          <div className="space-y-4">
            {[
              { n: "พหลโยธิน", s: 35, m: 80, c: "bg-yellow-500", t: "ชะลอตัว" },
              {
                n: "วิภาวดีรังสิต",
                s: 70,
                m: 100,
                c: "bg-green-500",
                t: "คล่องตัว",
              },
              { n: "ลาดพร้าว", s: 15, m: 60, c: "bg-red-600", t: "ติดขัดมาก" },
              { n: "สุขุมวิท", s: 20, m: 60, c: "bg-red-500", t: "ติดขัด" },
            ].map((r, i) => (
              <div key={i} className="group">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{r.n}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {r.t} ({r.s} km/h)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${r.c} rounded-full transition-all duration-500 group-hover:opacity-80`}
                    style={{ width: `${(r.s / r.m) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-3">
          <IncidentTable
            incidents={incidents}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default IncidentAccidentDashboard;