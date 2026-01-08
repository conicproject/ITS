import React, { useState, useEffect } from "react";
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

// --- Leaflet Icon Fix ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { grid: { color: "#f3f4f6" }, ticks: { stepSize: 500 } },
    },
  };

  const laneData = [
    {
      name: "เหนือ",
      pcu: 80,
      status: "ปกติ",
      color: "text-green-500",
      cam: "CAM-01 Ratchada",
    },
    {
      name: "กลาง",
      pcu: 45,
      status: "คล่องตัว",
      color: "text-blue-500",
      cam: "CAM-05 Center Hub",
    },
    {
      name: "ใต้",
      pcu: 75,
      status: "ปกติ",
      color: "text-green-500",
      cam: "CAM-02 Asoke",
    },
    {
      name: "ตะวันออก",
      pcu: 90,
      status: "หนาแน่น",
      color: "text-red-500",
      cam: "CAM-03 Silom",
    },
    {
      name: "ตะวันตก",
      pcu: 85,
      status: "ปานกลาง",
      color: "text-yellow-500",
      cam: "CAM-04 Sathorn",
    },
    {
      name: "เลนพิเศษ",
      pcu: 20,
      status: "โล่ง",
      color: "text-green-500",
      cam: "CAM-06 Express",
    },
  ];

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
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-gray-100 p-4 md:p-6 font-sans text-gray-800">
      <style>{`
        .leaflet-popup-content-wrapper { padding: 0 !important; overflow: hidden; border-radius: 8px; }
        .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .custom-popup .leaflet-popup-tip-container { margin-top: -1px; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f1f1; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
      `}</style>

      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 bg-gray-100 sticky top-0 z-50 py-2">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <FaVideo className="text-emerald-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Traffic Operation Management
            </h1>
            <p className="text-sm text-gray-500">Traffic Operation Center</p>
          </div>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <div className="text-3xl font-bold text-gray-700 tracking-tight">
            14:20:39
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Saturday 23 Dec 2025
          </div>
        </div>
      </header>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${stat.color} text-white rounded-xl p-4 shadow-md relative overflow-hidden flex flex-col justify-between h-28`}
          >
            <div className="flex justify-between items-start z-10">
              <span className="text-sm font-medium opacity-90">
                {stat.label}
              </span>
              <div className="bg-white/20 p-2 rounded-lg">
                <stat.icon className="text-xl" />
              </div>
            </div>
            <div className="z-10">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-xs opacity-80 mt-1">{stat.sublabel}</p>
            </div>
            <stat.icon className="absolute -bottom-4 -right-4 text-8xl opacity-10" />
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {/* 1. VIP ALERT BANNER (Full Width) */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-1 shadow-sm">
          <div className="bg-red-100 rounded-t-lg p-3 flex flex-col md:flex-row items-center justify-between border-b border-red-200">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white p-2 rounded animate-pulse">
                <FaExclamationTriangle />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    High Priority
                  </span>
                  <h2 className="text-red-800 font-bold text-lg">
                    Car VIP detected @1669-VIP-456
                  </h2>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  ตรวจจับรถ VIP ทะเบียน กข-9999 (CAM-NUM: 04) -
                  ต้องการอำนวยความสะดวก
                </p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-lg font-bold text-red-800">14:20:39</div>
              <div className="text-xs text-red-500">23/12/2025</div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-b-lg flex flex-wrap gap-2 items-center">
            {[
              {
                icon: FaCamera,
                text: "Camera",
                sub: "CAM-001",
                bg: "bg-white border hover:bg-gray-50",
              },
              {
                icon: FaMapMarkerAlt,
                text: "Location",
                sub: "Rama IX",
                bg: "bg-white border hover:bg-gray-50",
              },
              {
                icon: FaDirections,
                text: "Direction",
                sub: "Inbound",
                bg: "bg-white border hover:bg-gray-50",
              },
              {
                icon: FaClock,
                text: "ETA",
                sub: "3 min",
                bg: "bg-white border hover:bg-gray-50",
              },
              {
                icon: FaAmbulance,
                text: "Ambulance ID",
                sub: "1669-BK-155",
                bg: "bg-white border hover:bg-gray-50",
              },
              {
                icon: FaMapPin,
                text: "Destination",
                sub: "Praram 9 Hosp.",
                bg: "bg-white border hover:bg-gray-50",
              },
            ].map((btn, idx) => (
              <button
                key={idx}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-700 shadow-sm transition-colors ${btn.bg}`}
              >
                <btn.icon className="text-gray-500" />
                <span className="font-semibold">{btn.text}</span>
                <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">
                  {btn.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. SPLIT SECTION: MAIN MAP & RECENT ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left: Map (Span 3) */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-1 h-[500px] relative z-0">
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
            <div className="absolute top-4 right-4 z-[400] bg-white p-2 rounded-lg shadow-md flex flex-col gap-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <FaRoad />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <FaVideo />
              </button>
            </div>
          </div>

          {/* Right: Alerts (Span 1) - Height fixed to match Map */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[500px] flex flex-col">
            <h3 className="font-bold text-gray-800 mb-3 text-sm flex justify-between items-center flex-none">
              Recent Alerts
              <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
                {alerts.length} New
              </span>
            </h3>
            {/* Scrollable list inside fixed height */}
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

        {/* 3. INTERSECTION & PCU (FULL WIDTH) */}
        {/* These sit below the Map/Alerts split and take full width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Left Box: Graphic */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[600px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-l-4 border-purple-600 pl-2 flex-none">
              <FaMapMarkerAlt className="text-purple-600" />
              <h3 className="font-bold text-gray-800">
                สี่แยกราชดำเนิน (Real-time)
              </h3>
            </div>
            <div className="relative flex-1 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center w-full">
              <div className="absolute w-20 h-full bg-slate-700/50"></div>
              <div className="absolute h-20 w-full bg-slate-700/50"></div>
              <div className="absolute w-0.5 h-full bg-dashed border-l border-dashed border-white/20"></div>
              <div className="absolute h-0.5 w-full bg-dashed border-t border-dashed border-white/20"></div>
              <div className="absolute w-24 h-24 bg-red-900/30 border border-red-500/50 z-10 flex items-center justify-center">
                <span className="text-red-500 text-xs font-mono animate-pulse">
                  LOCKED
                </span>
              </div>
              <div className="absolute top-10 left-1/2 -ml-2 w-4 h-4 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
              <div className="absolute bottom-10 left-1/2 -ml-2 w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="absolute left-10 top-1/2 -mt-2 w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
          </div>

          {/* Right Box: PCU */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-none">
              <h3 className="font-bold text-gray-800">
                การจราจร & กล้อง (PCU)
              </h3>
              <button className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                Active
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center flex-none">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Domain</div>
                <div className="font-bold text-green-600">80</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Humidity</div>
                <div className="font-bold text-blue-600">130</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Speed</div>
                <div className="font-bold text-orange-600">32</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1 scrollbar-thin content-start">
              {laneData.map((lane, idx) => (
                <div
                  key={idx}
                  className={`border border-gray-100 p-0 rounded-lg hover:shadow-md transition-shadow bg-white overflow-hidden ${
                    idx === 1 ? "col-span-2" : ""
                  }`}
                >
                  <div className="relative bg-black h-20 w-full group">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaVideo className="text-gray-700 text-xl group-hover:text-gray-500 transition-colors" />
                    </div>
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-[8px] px-1 rounded flex items-center gap-1">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>{" "}
                      Live
                    </div>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-1">
                      <div className="text-white text-[9px] pl-1 truncate">
                        {lane.cam}
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-gray-500">
                        {lane.name}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 rounded ${
                          lane.status === "ปกติ" || lane.status === "คล่องตัว"
                            ? "bg-green-100 text-green-600"
                            : lane.status === "หนาแน่น"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {lane.status}
                      </span>
                    </div>
                    <div className={`text-lg font-bold ${lane.color}`}>
                      {lane.pcu}{" "}
                      <span className="text-xs text-gray-400 font-normal">
                        PCU
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. TRAFFIC CHART (FULL WIDTH) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCar className="text-blue-500" /> ปริมาณจราจรรายชั่วโมง (1 วัน)
          </h3>
          <div className="h-[500px] w-full">
            <Line data={trafficData} options={chartOptions} />
          </div>
        </div>

        {/* 5. SEQUENCE TRACKING (FULL WIDTH) */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-3 border-l-4 border-red-500 pl-2">
            <FaMapMarkerAlt className="text-red-500" />
            <h3 className="font-bold text-gray-800">Sequence Tracking</h3>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[600px]">
            <div className="w-full lg:w-1/2 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-300">
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
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-3 h-full">
              <div className="bg-black rounded-lg flex-1 flex items-center justify-center relative group min-h-[160px]">
                <FaPlay className="text-white text-4xl opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                  <div className="text-white text-[10px]">00:15</div>
                  <div className="h-1 bg-gray-600 flex-1 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-1/3"></div>
                  </div>
                  <div className="text-white text-[10px]">00:29</div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex gap-3 items-center shadow-sm">
                <div className="border-2 border-black rounded p-2 w-35 text-center bg-white shadow-sm shrink-0">
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
                    <span className="font-medium truncate max-w-[80px]">
                      {sequenceTrackingData.carInfo.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. BLACKLIST (FULL WIDTH) */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[800px] flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center flex-none">
            <span className="flex items-center gap-2">
              รายการบัญชีดำ (7 รายการ)
              <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full">
                High Alert
              </span>
            </span>
            <button className="text-xs text-blue-600 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors">
              View All
            </button>
          </h3>
          <div className="flex gap-2 mb-3 flex-none">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ค้นหาป้ายทะเบียน, สี, ยี่ห้อ..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-xs" />
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 rounded-lg text-xs font-medium transition-colors">
              Filter
            </button>
          </div>
          <div className="space-y-2 overflow-y-auto flex-1 pr-1 scrollbar-thin">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-red-50/30 transition-all cursor-pointer bg-white shadow-sm group"
              >
                <div className="flex items-center gap-3 mb-2 md:mb-0 w-full md:w-1/3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-red-500 transition-colors border border-gray-200">
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
                <div className="flex items-center gap-4 w-full md:w-1/3 justify-start md:justify-center mb-2 md:mb-0 border-l-0 md:border-l border-gray-100 pl-0 md:pl-4">
                  <div className="flex flex-col">
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      Camera
                    </div>
                    <div className="text-xs font-medium text-blue-600 flex items-center gap-1">
                      <FaCamera className="text-[10px]" /> CAM-00{i}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      Time
                    </div>
                    <div className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <FaClock className="text-[10px]" /> 09:3{i}:45
                    </div>
                  </div>
                </div>
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
                  <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 hover:bg-blue-100 text-blue-600 rounded bg-blue-50 transition-colors"
                      title="Play Video"
                    >
                      <FaPlay className="text-[10px]" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-100 text-gray-600 rounded bg-gray-50 transition-colors"
                      title="View Details"
                    >
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