// frontend/src/pages/OperationManagementDashboard.jsx
import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import {
  FaCamera,
  FaMapMarkerAlt,
  FaDirections,
  FaClock,
  FaAmbulance,
  FaMapPin,
  FaPlay,
  FaCar,
  FaExclamationTriangle,
  FaRoad,
  FaVideo,
  FaSearch,
} from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- IMPORT COMPONENT ---
// ตรวจสอบ path ของ DateTimeDisplay ให้ถูกต้องตามโปรเจคของคุณ
import DateTimeDisplay from "../../components/ui/DateTimeDisplay";

// --- Leaflet Icon Fix ---
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

// --- Chart Registration ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function OperationManagementDashboard() {
  
  // --- Mock Data: General ---
  const stats = [
    {
      label: "กล้องทั้งหมด",
      value: "12 กล้อง",
      sublabel: "View All Results",
      color: "bg-blue-600",
      icon: FaCamera,
    },
    {
      label: "รถผ่านเข้า-ออก",
      value: "1,820 คัน/ชม.",
      sublabel: "+12% จากเมื่อวาน",
      color: "bg-emerald-500",
      icon: FaCar,
    },
    {
      label: "แจ้งเตือน",
      value: "7 คัน",
      sublabel: "รอตรวจสอบ",
      color: "bg-orange-500",
      icon: FaMapMarkerAlt,
    },
    {
      label: "ฝ่าฝืน",
      value: "1 รายการ",
      sublabel: "รอดำเนินการ",
      color: "bg-red-500",
      icon: FaExclamationTriangle,
    },
  ];

  const alerts = Array(15)
    .fill(null)
    .map((_, i) => ({
      id: i,
      title: "Ambulance detected",
      camId: `#CAM-0${(i % 5) + 1}`,
      time: "14:20:39",
      location: "ถนนพระราม 5",
    }));

  // --- TRAFFIC DATA ---
  const trafficData = {
    labels: Array.from(
      { length: 24 },
      (_, i) => `${String(i).padStart(2, "0")}:00`
    ),
    datasets: [
      {
        label: "ปริมาณจราจร",
        data: [
          200, 150, 100, 80, 120, 400, 800, 1500, 1400, 1100, 900, 1000, 1100,
          1200, 1400, 1600, 1800, 1600, 1000, 600, 400, 300, 250, 200,
        ],
        fill: true,
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        borderColor: "#9333ea",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#9333ea",
        pointBorderWidth: 2,
        hitRadius: 30,
      },
    ],
  };

  // --- CHART OPTIONS ---
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: { 
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return ` ${context.dataset.label}: ${context.parsed.y.toLocaleString()} คัน`;
          }
        }
      }
    },
    scales: {
      x: { 
        grid: { display: false }, 
        ticks: { font: { size: 10 }, maxRotation: 0, color: '#9ca3af' } 
      },
      y: { 
        grid: { color: "#f3f4f6", borderDash: [4, 4] }, 
        ticks: { stepSize: 500, font: { size: 10 }, color: '#9ca3af' },
        beginAtZero: true,
      },
    },
  };

  // --- MOCK DATA: LANE PCU ---
  const rawLaneData = [
    {
      id: "north",
      name: "เลนเหนือ",
      pcu: 80,
      status: "ปกติ",
      color: "text-green-500",
      cam: "CAM-01 Ratchada",
      pcuCurrent: 24,
      pcuMax: 120,
      usagePercent: 20.5,
      density: 351,
      flow: 150,
      speed: 35,
    },
    {
      id: "center",
      name: "เลนกลาง - สี่แยก",
      pcu: 45,
      status: "คล่องตัว",
      color: "text-blue-500",
      cam: "CAM-05 Center Hub",
      pcuCurrent: 7,
      pcuMax: 30,
      usagePercent: 23.3,
      density: 351,
      flow: 150,
      speed: 35,
    },
    {
      id: "south",
      name: "เลนใต้",
      pcu: 75,
      status: "ปกติ",
      color: "text-green-500",
      cam: "CAM-02 Asoke",
      pcuCurrent: 60,
      pcuMax: 80,
      usagePercent: 75.0,
      density: 450,
      flow: 180,
      speed: 20,
    },
    {
      id: "east",
      name: "เลนตะวันออก",
      pcu: 90,
      status: "หนาแน่น",
      color: "text-red-500",
      cam: "CAM-03 Silom",
      pcuCurrent: 85,
      pcuMax: 90,
      usagePercent: 94.4,
      density: 580,
      flow: 90,
      speed: 12,
    },
    {
      id: "west",
      name: "เลนตะวันตก",
      pcu: 85,
      status: "ปานกลาง",
      color: "text-yellow-500",
      cam: "CAM-04 Sathorn",
      pcuCurrent: 45,
      pcuMax: 85,
      usagePercent: 52.9,
      density: 320,
      flow: 140,
      speed: 28,
    },
  ];

  const centerLane = rawLaneData.find(l => l.id === 'center');
  const otherLanes = rawLaneData.filter(l => l.id !== 'center');

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
    <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden bg-slate-50 p-3 md:p-6 font-sans text-gray-800 pb-20">
      <style>{`
        .leaflet-popup-content-wrapper { padding: 0 !important; overflow: hidden; border-radius: 8px; }
        .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .custom-popup .leaflet-popup-tip-container { margin-top: -1px; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f1f1; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
      `}</style>

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="w-full md:w-auto flex items-start gap-3">
          <span className="text-green-600 bg-green-50 p-2 rounded-lg shrink-0">
             <FaVideo className="w-6 h-6" />
          </span>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-3xl font-bold text-slate-800 leading-tight">
              Traffic Operation Management
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              ระบบบริหารจัดการและปฏิบัติการจราจร (Traffic Operation Center)
            </p>
          </div>
        </div>
        <DateTimeDisplay />
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${stat.color} text-white rounded-xl p-4 shadow-md relative overflow-hidden flex flex-col justify-between h-24 md:h-28 border border-white/20`}
          >
            <div className="flex justify-between items-start z-10">
              <span className="text-sm font-medium opacity-90">
                {stat.label}
              </span>
              <div className="bg-white/20 p-1.5 md:p-2 rounded-lg">
                <stat.icon className="text-lg md:text-xl" />
              </div>
            </div>
            <div className="z-10">
              <h3 className="text-xl md:text-2xl font-bold">{stat.value}</h3>
              <p className="text-[10px] md:text-xs opacity-80 mt-1">{stat.sublabel}</p>
            </div>
            <stat.icon className="absolute -bottom-4 -right-4 text-7xl md:text-8xl opacity-10" />
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {/* 1. VIP ALERT BANNER */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-1 shadow-sm">
          <div className="bg-red-100 rounded-t-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-red-200 gap-2">
            <div className="flex items-start md:items-center gap-3">
              <div className="bg-red-600 text-white p-2 rounded animate-pulse shrink-0">
                <FaExclamationTriangle />
              </div>
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                  <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase w-fit">
                    High Priority
                  </span>
                  <h2 className="text-red-800 font-bold text-base md:text-lg">
                    Car VIP detected @1669-VIP-456
                  </h2>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  ตรวจจับรถ VIP ทะเบียน กข-9999 (CAM-NUM: 04) -
                  ต้องการอำนวยความสะดวก
                </p>
              </div>
            </div>
            <div className="text-left md:text-right pl-12 md:pl-0 w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end">
              <div className="text-sm md:text-lg font-bold text-red-800">14:20:39</div>
              <div className="text-xs text-red-500">23/12/2025</div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-b-lg flex flex-wrap gap-2 items-center">
            {[
              { icon: FaCamera, text: "Camera", sub: "CAM-001" },
              { icon: FaMapMarkerAlt, text: "Location", sub: "Rama IX" },
              { icon: FaDirections, text: "Direction", sub: "Inbound" },
              { icon: FaClock, text: "ETA", sub: "3 min" },
              { icon: FaAmbulance, text: "Ambulance ID", sub: "1669-BK-155" },
              { icon: FaMapPin, text: "Destination", sub: "Praram 9 Hosp." },
            ].map((btn, idx) => (
              <button
                key={idx}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-700 shadow-sm transition-colors bg-white border hover:bg-gray-50 flex-grow md:flex-grow-0 justify-center md:justify-start"
              >
                <btn.icon className="text-gray-500" />
                <span className="font-semibold whitespace-nowrap">{btn.text}</span>
                <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                  {btn.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. SPLIT SECTION: MAIN MAP & RECENT ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-1 h-[350px] md:h-[500px] relative z-0">
            {typeof window !== "undefined" && (
              <MapContainer
                center={[13.7563, 100.5018]}
                zoom={13}
                className="h-full w-full rounded-lg"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[13.7563, 100.5018]}>
                  <Popup>Center</Popup>
                </Marker>
                <Marker position={[13.76, 100.51]} />
                <Marker position={[13.74, 100.49]} />
              </MapContainer>
            )}
            <div className="absolute top-4 right-4 z-[400] bg-white p-2 rounded-lg shadow-md flex flex-col gap-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <FaRoad />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <FaVideo />
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[400px] md:h-[500px] flex flex-col">
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex justify-between items-center flex-none">
              Recent Alerts
              <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
                {alerts.length} New
              </span>
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white border-l-4 border-blue-500 shadow-sm p-3 rounded-r-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                >
                  <div className="flex items-start gap-2">
                    <FaCar className="text-blue-500 mt-1 shrink-0" />
                    <div className="w-full">
                      <div className="font-bold text-xs text-gray-800 flex justify-between">
                        {alert.title}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {alert.camId} • {alert.location}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-right text-[10px] text-gray-400 font-mono">
                    {alert.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 3. INTERSECTION & PCU (UPDATED LAYOUT) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <FaMapMarkerAlt />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">สถานะจราจรแยกราชดำเนิน</h3>
                        <p className="text-xs text-gray-500">Real-time Traffic Monitoring System</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-500">Live Status:</span>
                     <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Online
                     </span>
                </div>
            </div>

            {/* TOP ROW: Graphic (Left) & Center Lane (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                
                {/* 1. LEFT: Intersection Graphic */}
                <div className="bg-slate-900 rounded-xl overflow-hidden relative min-h-[350px] border border-slate-800 shadow-inner flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950"></div>
                    <div className="absolute w-32 h-full bg-slate-700/50 border-x-2 border-slate-600/50"></div>
                    <div className="absolute h-32 w-full bg-slate-700/50 border-y-2 border-slate-600/50"></div>
                    <div className="absolute w-0.5 h-full bg-dashed border-l border-dashed border-white/20"></div>
                    <div className="absolute h-0.5 w-full bg-dashed border-t border-dashed border-white/20"></div>
                    <div className="absolute w-36 h-36 bg-red-900/20 border-2 border-red-500/30 z-10 grid place-content-center">
                         <div className="text-red-500/50 text-xs font-mono">CRITICAL AREA</div>
                    </div>
                    <div className="absolute top-12 left-1/2 -ml-3 w-6 h-12 bg-black rounded border border-gray-700 flex flex-col items-center justify-around py-1 shadow-lg">
                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                        <div className="w-3 h-3 bg-yellow-900 rounded-full opacity-30"></div>
                        <div className="w-3 h-3 bg-green-900 rounded-full opacity-30"></div>
                    </div>
                    <div className="absolute top-[20%] left-[48%] w-3 h-5 bg-blue-500 rounded-sm shadow-md"></div>
                    <div className="absolute bottom-[20%] left-[51%] w-3 h-5 bg-white rounded-sm shadow-md"></div>
                    <div className="absolute left-[20%] top-[51%] w-5 h-3 bg-yellow-500 rounded-sm shadow-md"></div>
                </div>

                {/* 2. RIGHT: Center Lane (Big Card - Maximized Camera) */}
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm flex flex-col h-full">
                    {/* Video Area (Increased Height to 350px) */}
                    <div className="bg-black relative group flex-1 min-h-[350px]">
                         <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/70 to-transparent flex justify-between items-start z-10">
                            <span className="text-white font-bold text-lg drop-shadow-md">{centerLane.name}</span>
                            <div className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> Live
                            </div>
                         </div>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <FaVideo className="text-gray-700 text-6xl group-hover:text-gray-500 transition-colors" />
                         </div>
                         <div className="absolute bottom-3 right-3 text-white/50 text-xs font-mono bg-black/50 px-2 py-1 rounded">
                            {centerLane.cam}
                         </div>
                    </div>

                    {/* Stats Panel (Compact) */}
                    <div className="px-4 py-3 bg-white border-t border-gray-100">
                        <div className="flex items-center gap-4">
                            {/* Left: Progress Bar */}
                            <div className="w-1/3 shrink-0">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-[10px] font-bold text-gray-600">PCU Usage</span>
                                    <span className="text-[10px] font-bold text-blue-600">{centerLane.usagePercent}%</span>
                                </div>
                                <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" 
                                        style={{ width: `${centerLane.usagePercent}%` }}
                                    ></div>
                                </div>
                                <div className="text-[9px] text-gray-400 mt-1 text-right">{centerLane.pcuCurrent}/{centerLane.pcuMax} PCU</div>
                            </div>
                            
                            {/* Divider */}
                            <div className="w-px h-8 bg-gray-200"></div>

                            {/* Right: Metrics Grid */}
                            <div className="flex-1 grid grid-cols-3 gap-2">
                                 <div className="text-center">
                                    <div className="text-[9px] text-gray-400 uppercase">Density</div>
                                    <div className="font-bold text-gray-800 text-sm">{centerLane.density}</div>
                                    <div className="text-[8px] text-gray-400">pcu/km</div>
                                 </div>
                                 <div className="text-center border-l border-gray-100">
                                    <div className="text-[9px] text-gray-400 uppercase">Flow</div>
                                    <div className="font-bold text-gray-800 text-sm">{centerLane.flow}</div>
                                    <div className="text-[8px] text-gray-400">pcu/hr</div>
                                 </div>
                                 <div className="text-center border-l border-gray-100">
                                    <div className="text-[9px] text-gray-400 uppercase">Speed</div>
                                    <div className="font-bold text-gray-800 text-sm">{centerLane.speed}</div>
                                    <div className="text-[8px] text-gray-400">km/h</div>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW: Other Lanes (Increased Height, Compact Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {otherLanes.map((lane, idx) => (
                    <div key={idx} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        {/* Video Area (Increased Height to h-48) */}
                        <div className="bg-black relative h-48 group">
                             <div className="absolute top-2 left-2 text-white font-bold text-xs drop-shadow-md z-10">
                                {lane.name}
                             </div>
                             <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded flex items-center gap-1 z-10">
                                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                            </div>
                             <div className="absolute inset-0 flex items-center justify-center">
                                <FaVideo className="text-gray-700 text-3xl group-hover:text-gray-500 transition-colors" />
                             </div>
                        </div>

                        {/* Stats Area (Very Compact) */}
                        <div className="px-3 py-2 bg-white">
                            <div className="flex items-center justify-between gap-2">
                                {/* Usage Bar (Compact) */}
                                <div className="flex flex-col w-1/4 shrink-0">
                                    <div className="flex justify-between items-baseline">
                                         <span className="text-[8px] text-gray-400">Usage</span>
                                         <span className="text-[9px] font-bold text-gray-800">{lane.usagePercent}%</span>
                                    </div>
                                    <div className="h-1 bg-gray-100 rounded-full mt-0.5 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${
                                                lane.usagePercent > 80 ? 'bg-red-500' : 
                                                lane.usagePercent > 50 ? 'bg-yellow-400' : 'bg-gray-400'
                                            }`} 
                                            style={{ width: `${lane.usagePercent}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Vertical Divider */}
                                <div className="w-px h-5 bg-gray-100"></div>

                                {/* 3 Metrics */}
                                <div className="flex items-center justify-between flex-1 gap-1">
                                     <div className="text-center">
                                         <div className="text-[8px] text-gray-400 leading-none mb-0.5">Den</div>
                                         <div className="text-[10px] font-bold text-gray-700 leading-none">{lane.density}</div>
                                     </div>
                                     <div className="text-center">
                                         <div className="text-[8px] text-gray-400 leading-none mb-0.5">Flow</div>
                                         <div className="text-[10px] font-bold text-gray-700 leading-none">{lane.flow}</div>
                                     </div>
                                     <div className="text-center">
                                         <div className="text-[8px] text-gray-400 leading-none mb-0.5">Spd</div>
                                         <div className="text-[10px] font-bold text-gray-700 leading-none">{lane.speed}</div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>

        {/* 4. TRAFFIC CHART */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 w-full">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCar className="text-blue-500" /> ปริมาณจราจรรายชั่วโมง (1 วัน)
          </h3>
          <div className="h-[250px] md:h-[400px] w-full">
            <Line data={trafficData} options={chartOptions} />
          </div>
        </div>

        {/* 5. SEQUENCE TRACKING */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-3 border-l-4 border-red-500 pl-2">
            <FaMapMarkerAlt className="text-red-500" />
            <h3 className="font-bold text-gray-800">Sequence Tracking</h3>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[600px]">
            {/* Map Area */}
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
                                <span>{sequenceTrackingData.carInfo.plateNumber}</span>
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

            {/* Right Side Info */}
            <div className="w-full lg:w-1/2 flex flex-col gap-3 h-auto lg:h-full">
              {/* Video Player Box */}
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

              {/* Car Detail Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center shadow-sm">
                {/* License Plate Box */}
                <div className="border-2 border-black rounded p-2 w-full sm:w-35 text-center bg-white shadow-sm shrink-0 flex flex-row sm:flex-col justify-between sm:justify-center items-center">
                  <div className="text-xl font-bold text-gray-800 leading-none mt-1">
                    {sequenceTrackingData.carInfo.plateNumber}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    {sequenceTrackingData.carInfo.province}
                  </div>
                </div>
                
                {/* Text Details List */}
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
          </div>
        </div>

        {/* 6. BLACKLIST */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[500px] md:h-[800px] flex flex-col">
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
          <div className="flex flex-col sm:flex-row gap-2 mb-3 flex-none">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ค้นหาป้ายทะเบียน..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-400"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 sm:py-0 rounded-lg text-xs font-medium transition-colors w-full sm:w-auto">
              Filter
            </button>
          </div>
          <div className="space-y-2 overflow-y-auto flex-1 pr-1 scrollbar-thin">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-red-50/30 transition-all cursor-pointer bg-white shadow-sm group"
              >
                {/* Car Info Section */}
                <div className="flex items-center gap-3 mb-2 md:mb-0 w-full md:w-1/3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-red-500 transition-colors border border-gray-200 shrink-0">
                    <FaCar />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 text-sm">
                        กท-123{i}
                      </span>
                      {i === 1 && (
                        <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 flex gap-1">
                      <span>Honda Civic</span> • <span>สีดำ</span>
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
                      <FaCamera className="text-[10px]" /> CAM-00{i}
                    </div>
                  </div>
                  <div className="flex flex-col text-right md:text-left">
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      Time
                    </div>
                    <div className="text-xs font-medium text-gray-600 flex items-center gap-1 justify-end md:justify-start">
                      <FaClock className="text-[10px]" /> 09:3{i}:45
                    </div>
                  </div>
                </div>

                {/* Location & Action Section */}
                <div className="flex items-center justify-between w-full md:w-1/3 md:justify-end gap-3 border-l-0 md:border-l border-gray-100 pl-0 md:pl-4">
                  <div className="text-left md:text-right">
                    <div className="text-xs font-bold text-gray-700 flex items-center md:justify-end gap-1">
                      <FaMapMarkerAlt className="text-red-500 text-[10px]" />{" "}
                      สี่แยกราชดำเนิน
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Alert Level: High
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-100 md:opacity-60 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-blue-100 text-blue-600 rounded bg-blue-50 transition-colors">
                      <FaPlay className="text-[10px]" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 text-gray-600 rounded bg-gray-50 transition-colors">
                      <FaSearch className="text-[10px]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperationManagementDashboard;