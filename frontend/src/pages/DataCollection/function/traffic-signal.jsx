// frontend/src/pages/TrafficSignal.jsx
import React, { useState } from "react";
import { FaMapMarkerAlt, FaVideo, FaRoad, FaChartLine } from "react-icons/fa";
import { Filter } from "../../../components/ui/Filter"; 

// --- 1. Import ส่วนของ Chart ---
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

// --- 2. Register Chart Components ---
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

export default function TrafficSignal() {
  const [selectedLocation, setSelectedLocation] = useState("สี่แยกราชดำเนิน");

  // --- MOCK DATA: LANES ---
  const rawLaneData = [
    { id: "north", name: "เลนเหนือ", pcu: 80, status: "ปกติ", cam: "CAM-01 Ratchada", pcuCurrent: 24, pcuMax: 120, usagePercent: 20.5, density: 351, flow: 150, speed: 35 },
    { id: "center", name: "เลนกลาง - สีแดง", pcu: 45, status: "คล่องตัว", cam: "CAM-05 Center Hub", pcuCurrent: 7, pcuMax: 30, usagePercent: 23.3, density: 351, flow: 150, speed: 35 },
    { id: "south", name: "เลนใต้", pcu: 75, status: "ปกติ", cam: "CAM-02 Asoke", pcuCurrent: 60, pcuMax: 80, usagePercent: 75.0, density: 450, flow: 180, speed: 20 },
    { id: "east", name: "เลนตะวันออก", pcu: 90, status: "หนาแน่น", cam: "CAM-03 Silom", pcuCurrent: 85, pcuMax: 90, usagePercent: 94.4, density: 580, flow: 90, speed: 12 },
    { id: "west", name: "เลนตะวันตก", pcu: 85, status: "ปานกลาง", cam: "CAM-04 Sathorn", pcuCurrent: 45, pcuMax: 85, usagePercent: 52.9, density: 320, flow: 140, speed: 28 },
  ];

  const centerLane = rawLaneData.find((l) => l.id === "center");
  const otherLanes = rawLaneData.filter((l) => l.id !== "center");

  // --- 3. CONFIG CHART DATA (เอามาจาก Dashboard) ---
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
        backgroundColor: "rgba(99, 102, 241, 0.1)", // ปรับเป็นสี Indigo ให้เข้ากับ Theme หน้านี้
        borderColor: "#6366f1", // Indigo-500
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#6366f1",
        pointBorderWidth: 2,
        hitRadius: 30,
      },
    ],
  };

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

  const handleSearch = (e) => { 
      console.log("Searching...", e); 
  };

  return (
    <div className="h-screen overflow-y-auto font-sans pb-10">
      
        {/* --- HEADER --- */}
        <div className="p-4 md:p-6 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FaRoad className="text-indigo-600 text-xl" />
              </div>
              ระบบตรวจจับความหนาแน่นของการจราจร
            </h1>
            <p className="text-gray-500 text-sm mt-1 ml-11">
              Traffic Density Detection System & Real-time Monitoring
            </p>
          </div>
        </div>

      {/* --- Main Content --- */}
      <main className="px-4 md:px-6 pt-2">
        
        {/* --- Filter Section --- */}
        <div className="mb-6">
            <Filter 
                onSearch={handleSearch}
                showLocation={true}
                showDistrict={true}
                showDateRange={false}
                showPlate={false}
                showVehicleType={false}
                locationColSpan="col-span-12 md:col-span-7 lg:col-span-6"
                districtColSpan="col-span-12 md:col-span-7 lg:col-span-5"
                placeholderLocation="ระบุชื่อจุดติดตั้ง..."
            />
        </div>

        <div className="max-w-1xl mx-auto space-y-6">

          {/* --- SECTION 2: Grid Layout --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:min-h-[500px]">
            
            {/* === LEFT COLUMN === */}
            <div className="flex flex-col gap-6 h-full">
              
              {/* Location Info */}
              <div className="flex flex-col md:flex-row w-full gap-4 text-gray-800 shrink-0">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-6 py-4 shadow-sm md:min-w-[140px]">
                  <div className="relative flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="text-purple-500 text-2xl drop-shadow-sm" />
                  </div>
                  <span className="text-lg font-medium whitespace-nowrap">สถานที่ :</span>
                </div>

                <div className="flex flex-1 items-center justify-center md:justify-start rounded-2xl border border-gray-200 px-6 py-4 shadow-sm">
                  <span className="text-lg font-semibold text-gray-700">{selectedLocation}</span>
                </div>
              </div>

              {/* Center Lane (Camera) */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col flex-1 min-h-[300px]">
                {/* Video Area */}
                <div className="bg-black relative group flex-1">
                  <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start z-10">
                    <div>
                      <h3 className="text-white font-bold text-xl drop-shadow-md">{centerLane.name}</h3>
                      <p className="text-gray-300 text-xs flex items-center gap-1">
                        <FaVideo className="text-gray-400"/> {centerLane.cam}
                      </p>
                    </div>
                    <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1.5 shadow-sm border border-red-500/50">
                      <div className="w-2 h-2 rounded-full animate-pulse"></div> LIVE
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaVideo className="text-gray-800/80 text-7xl group-hover:text-gray-700 transition-colors" />
                  </div>

                  {/* Overlay Stats */}
                  <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                    <div className="bg-black/60 backdrop-blur-md rounded-lg p-2 text-center border border-white/10">
                      <div className="text-[10px] uppercase text-gray-400 tracking-wider">Flow</div>
                      <div className="text-lg font-bold text-white">{centerLane.flow}</div>
                    </div>
                    <div className="bg-black/60 backdrop-blur-md rounded-lg p-2 text-center border border-white/10">
                      <div className="text-[10px] uppercase text-gray-400 tracking-wider">Density</div>
                      <div className="text-lg font-bold text-emerald-400">{centerLane.density}</div>
                    </div>
                    <div className="bg-black/60 backdrop-blur-md rounded-lg p-2 text-center border border-white/10">
                      <div className="text-[10px] uppercase text-gray-400 tracking-wider">Speed</div>
                      <div className="text-lg font-bold text-blue-400">
                        {centerLane.speed} <span className="text-[10px]">km/h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Panel */}
                <div className="px-6 py-4 border-t border-gray-100 shrink-0">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-600 w-24">PCU Load</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">
                          {centerLane.pcuCurrent} / {centerLane.pcuMax} units
                        </span>
                        <span className="font-bold text-blue-600">{centerLane.usagePercent}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 shadow-blue-200 shadow-md"
                          style={{ width: `${centerLane.usagePercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* === RIGHT COLUMN: Intersection Graphic === */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-800 shadow-lg flex items-center justify-center h-[400px] lg:h-full">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950"></div>

              {/* Graphic Elements */}
              <div className="absolute w-32 h-full bg-slate-700/50 border-x-2 border-slate-600/50"></div>
              <div className="absolute h-32 w-full bg-slate-700/50 border-y-2 border-slate-600/50"></div>
              <div className="absolute w-0.5 h-full bg-dashed border-l border-dashed border-white/20"></div>
              <div className="absolute h-0.5 w-full bg-dashed border-t border-dashed border-white/20"></div>

              {/* Critical Area */}
              <div className="absolute w-48 h-48 bg-red-500/10 border border-red-500/30 z-10 flex items-center justify-center backdrop-blur-[1px] shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                <div className="text-red-500/70 text-[10px] font-mono tracking-widest animate-pulse">CRITICAL ZONE</div>
              </div>

              {/* Traffic Light Signal */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/90 rounded-lg border border-gray-700 p-2 shadow-2xl z-20 flex flex-col gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-900/30 rounded-full"></div>
                <div className="w-3 h-3 bg-green-900/30 rounded-full"></div>
              </div>

              {/* Simulated Cars */}
              <div className="absolute top-[20%] left-[47%] w-5 h-8 bg-blue-500 rounded-md shadow-lg transition-all duration-1000 border border-blue-400/50"></div>
              <div className="absolute bottom-[20%] left-[51%] w-5 h-8 rounded-md shadow-lg border border-gray-300"></div>
              <div className="absolute left-[20%] top-[46%] w-8 h-5 bg-amber-500 rounded-md shadow-lg border border-amber-400/50"></div>
            </div>

          </div>

            {/* --- SECTION 3: Other Lanes Grid --- */}
            <div className="mt-8">
                <h3 className="text-gray-700 font-bold mb-4 flex items-center gap-2 text-lg">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                    กล้องวงจรปิดมุมอื่น (Other Angles)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {otherLanes.map((lane, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div className="bg-black relative h-40 group">
                        <div className="absolute top-2 left-3 z-10">
                            <span className="text-white font-bold text-sm drop-shadow-md block">{lane.name}</span>
                            <span className="text-white/60 text-[10px]">{lane.cam}</span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <FaVideo className="text-gray-800 text-4xl group-hover:text-gray-600 transition-colors" />
                        </div>
                        <div className={`absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm ${
                            lane.status === 'หนาแน่น' ? 'bg-red-100 text-red-700' : 
                            lane.status === 'คล่องตัว' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                            {lane.status}
                        </div>
                    </div>

                    <div className="p-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">ความหนาแน่น</span>
                            <span className={`text-xs font-bold ${lane.usagePercent > 80 ? 'text-red-500' : 'text-emerald-600'}`}>
                                {lane.usagePercent}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                            <div 
                                className={`h-1.5 rounded-full ${lane.usagePercent > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                style={{ width: `${lane.usagePercent}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between border-t border-gray-50 pt-2 text-[10px] text-gray-500">
                            <div>Flow: <span className="text-gray-800 font-semibold">{lane.flow}</span></div>
                            <div>Spd: <span className="text-gray-800 font-semibold">{lane.speed}</span></div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* --- SECTION 4: Chart (Replaced with React-Chartjs-2) --- */}
            <div className="rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
                            <FaChartLine className="text-lg" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-800">สถิติปริมาณจราจร (24 ชม.)</h3>
                            <p className="text-xs text-gray-500">เปรียบเทียบข้อมูล Real-time กับค่าเฉลี่ยย้อนหลัง</p>
                        </div>
                    </div>
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                            <span className="text-gray-600 font-medium">วันนี้</span>
                        </div>
                    </div>
                </div>

                {/* Chart Container */}
                <div className="h-[300px] w-full">
                    <Line data={trafficData} options={chartOptions} />
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}