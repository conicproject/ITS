import React, { useState } from "react"; // ลบ useEffect ออก เพราะย้ายไปอยู่ใน DateTimeDisplay แล้ว

// --- 1. LEAFLET IMPORTS ---
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// --- IMPORT COMPONENT ---
import DateTimeDisplay from "../../components/ui/DateTimeDisplay";

// --- 2. LEAFLET ICON FIX ---
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

// --- Register Chart.js ---
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

// --- 3. INLINE ICONS (S, T, R, P, W, L) ---
const IconS = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <circle cx="24" cy="24" r="24" fill="#EF4444" />
    <text x="24" y="33" fontSize="26" fontWeight="900" fill="white" textAnchor="middle" style={{ fontFamily: 'Arial, sans-serif' }}>S</text>
  </svg>
);
const IconT = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <circle cx="24" cy="24" r="24" fill="#F97316" />
    <text x="24" y="33" fontSize="26" fontWeight="900" fill="white" textAnchor="middle" style={{ fontFamily: 'Arial, sans-serif' }}>T</text>
  </svg>
);
const IconR = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <circle cx="24" cy="24" r="24" fill="#DC2626" />
    <text x="24" y="33" fontSize="26" fontWeight="900" fill="white" textAnchor="middle" style={{ fontFamily: 'Arial, sans-serif' }}>R</text>
  </svg>
);
const IconP = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <circle cx="24" cy="24" r="24" fill="#EA580C" />
    <text x="24" y="33" fontSize="26" fontWeight="900" fill="white" textAnchor="middle" style={{ fontFamily: 'Arial, sans-serif' }}>P</text>
  </svg>
);
const IconW = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <circle cx="24" cy="24" r="24" fill="#F43F5E" />
    <text x="24" y="33" fontSize="26" fontWeight="900" fill="white" textAnchor="middle" style={{ fontFamily: 'Arial, sans-serif' }}>W</text>
  </svg>
);
const IconL = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <circle cx="24" cy="24" r="24" fill="#F59E0B" />
    <text x="24" y="33" fontSize="26" fontWeight="900" fill="white" textAnchor="middle" style={{ fontFamily: 'Arial, sans-serif' }}>L</text>
  </svg>
);

// Utility Icons
const MapPin = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
// Clock ยังต้องใช้อยู่ในส่วน Recent Violations Feed
const Clock = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
// Calendar ไม่ได้ใช้แล้ว เพราะย้ายไปอยู่ใน DateTimeDisplay จึงลบออกได้เลย
const LocateFixed = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" x2="12" y1="2" y2="5" />
    <line x1="12" x2="12" y1="19" y2="22" />
    <line x1="2" x2="5" y1="12" y2="12" />
    <line x1="19" x2="22" y1="12" y2="12" />
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// --- Component: TrafficChart ---
function TrafficChart() {
  const data = {
    labels: [ "SUV", "จยย.", "รถตู้", "บรรทุก", "บรรทุกเล็ก", "รถเก๋ง", "สามล้อ", "รถเมล์", "อื่นๆ" ],
    datasets: [
      {
        label: "Blacklist",
        data: [1254, 3890, 2105, 1567, 3999, 1005, 2784, 3451, 1888],
        borderColor: "#64748b",
        backgroundColor: "#64748b",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: "วิ่งบนทางเท้า",
        data: [2543, 1102, 3678, 2890, 1459, 3212, 1756, 3910, 2223],
        borderColor: "#F43F5E", 
        backgroundColor: "#F43F5E",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: "เปลี่ยนช่องทางฯ",
        data: [3021, 1020, 2555, 3887, 1674, 2909, 3333, 1992, 2418],
        borderColor: "#F59E0B",
        backgroundColor: "#F59E0B",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: "จอดในที่ห้ามจอด",
        data: [1834, 3752, 2159, 1306, 3501, 2667, 1111, 3955, 2020],
        borderColor: "#EA580C",
        backgroundColor: "#EA580C",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: "ฝ่าสัญญาณไฟ",
        data: [3120, 1508, 2845, 1953, 3656, 1209, 2457, 3802, 1733],
        borderColor: "#DC2626",
        backgroundColor: "#DC2626",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: "รถบรรทุกห้ามเดินรถ",
        data: [2219, 3444, 1603, 3908, 1355, 2701, 1852, 3059, 2556],
        borderColor: "#F97316",
        backgroundColor: "#F97316",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: "ความเร็วเกินกำหนด",
        data: [1488, 3307, 2391, 1905, 3762, 2954, 1053, 3558, 2004],
        borderColor: "#EF4444",
        backgroundColor: "#EF4444",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
          font: { size: 12, family: "'Arial', sans-serif" },
          color: '#334155'
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) { label += ': '; }
                if (context.parsed.y !== null) { label += context.parsed.y.toLocaleString(); }
                return label;
            }
        }
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { borderDash: [4, 4], color: '#f1f5f9' },
        ticks: { 
            color: '#94a3b8',
            font: { size: 11 },
            callback: function(value) { return value.toLocaleString(); }
        }
      },
      x: { 
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 12, weight: '500' } }
      },
    },
  };

  return <Line data={data} options={options} />;
}

// --- Component: Main Dashboard ---
function EnforcementDashboard() {
  
  // --- STATS DATA ---
  const stats = [
    {
      icon: <IconS className="w-12 h-12" />, 
      label: "Speeding Violation",
      subLabel: "ความเร็วเกินกำหนด",
      value: "33,900",
      color: "border-red-500",
    },
    {
      icon: <IconT className="w-12 h-12" />,
      label: "Truck Time Restriction",
      subLabel: "รถบรรทุกในเวลาห้ามเดินรถ",
      value: "11,300",
      color: "border-orange-500",
    },
    {
      icon: <IconR className="w-12 h-12" />,
      label: "Red Light Violation",
      subLabel: "ฝ่าสัญญาณไฟ",
      value: "16,950",
      color: "border-red-600",
    },
    {
      icon: <IconP className="w-12 h-12" />,
      label: "Parking Violation",
      subLabel: "จอดรถในที่ห้ามจอด",
      value: "22,600",
      color: "border-orange-600",
    },
    {
      icon: <IconW className="w-12 h-12" />,
      label: "Driving on Sidewalk",
      subLabel: "วิ่งบนทางเท้า",
      value: "9,040",
      color: "border-rose-500",
    },
    {
      icon: <IconL className="w-12 h-12" />,
      label: "Lane Changing",
      subLabel: "เปลี่ยนช่องในเขตเส้นทึบ",
      value: "13,560",
      color: "border-amber-500",
    },
  ];

  // --- MOCK VIOLATIONS DATA ---
  const violations = [
    { id: 1, type: "ฝ่าไฟแดง", plate: "ชบ-8765", location: "แยกเตาปูน", time: "27/06/2568 14:12 น.", urgent: false },
    { id: 2, type: "ความเร็วเกินกำหนด", plate: "ขน-1234", location: "พหลโยธิน — 85 กม./ชม.", time: "27/06/2568 14:12 น.", urgent: false },
    { id: 3, type: "ฝ่าไฟแดง", plate: "กก-9988", location: "ถนนงามวงศ์วาน", time: "27/06/2568 14:12 น.", urgent: false },
    { id: 4, type: "จอดในที่ห้ามจอด", plate: "ฮอ-5555", location: "หน้าตลาดบางกะปิ", time: "27/06/2568 13:45 น.", urgent: false },
  ];

  return (
    <div className="w-full h-screen overflow-y-auto p-4 md:p-6 flex flex-col gap-6 font-sans">
      
      {/* --- HEADER SECTION (Updated) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-xl shadow-sm border">
        
        {/* Title Group (Flexed) */}
        <div className="w-full md:w-auto flex items-start gap-3">
            {/* Icon แยกออกมา */}
            <span className="text-blue-600 bg-blue-50 p-2 rounded-lg shrink-0">🛡️</span>
            
            {/* Text Group */}
            <div className="flex flex-col">
                <h1 className="text-xl md:text-3xl font-bold text-slate-800 leading-tight">
                    Traffic Enforcement
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                    ระบบตรวจจับและบังคับใช้กฎหมายจราจร (Traffic Law Enforcement Center)
                </p>
            </div>
        </div>

        {/* เรียกใช้งาน Component วันเวลา */}
        <DateTimeDisplay />
        
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`border-l-4 ${item.color} rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 flex flex-col justify-between gap-2`}
          >
            {/* Top: Icon & Label */}
            <div className="flex items-center gap-3">
              <div className="-mt-1 -ml-1 flex-shrink-0">{item.icon}</div>
              <div className="flex flex-col justify-center">
                <div className="text-sm font-bold text-slate-700 uppercase leading-tight">
                  {item.label}
                </div>
                <div className="text-xs text-slate-500 leading-tight">
                  {item.subLabel}
                </div>
              </div>
            </div>

            {/* Bottom: Value */}
            <div className="flex items-baseline justify-center gap-1">
              <div className="text-2xl font-bold text-slate-800">
                {item.value}
              </div>
              <div className="text-xs text-slate-400">คัน</div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MAP & RANKING SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 rounded-xl shadow-sm border p-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
              <LocateFixed className="w-5 h-5 text-blue-500" />
              แผนที่จุดตรวจจับ (Live Map)
            </h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">
              ● Online
            </span>
          </div>

          <div className="relative w-full h-[400px] md:h-[500px] z-0 bg-slate-100 flex items-center justify-center">
            {typeof window !== "undefined" && (
              <MapContainer
                center={[13.7563, 100.5018]}
                zoom={12}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[13.7563, 100.5018]}>
                  <Popup>
                    <div className="text-center font-sans">
                      <b>ศูนย์ควบคุมจราจรกลาง</b>
                      <br />
                      กรุงเทพมหานคร
                    </div>
                  </Popup>
                </Marker>
                <Marker position={[13.8, 100.55]}>
                  <Popup>ถ. วิภาวดีรังสิต</Popup>
                </Marker>
                <Marker position={[13.72, 100.58]}>
                  <Popup>ถ. เพชรบุรี</Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
        </div>

        {/* Ranking Lists */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl p-5 shadow-sm border flex-1">
            <h3 className="font-semibold mb-4 text-slate-800 border-b pb-2">
              <p>
                🚨 จุดที่มียานพาหนะฝ่าฝืนกฏจราจร{" "}
                <span className="text-green-500 font-bold">ขาเข้าเมือง</span>{" "}
                มากที่สุด (ครั้ง/วัน)
              </p>
            </h3>
            <ul className="text-sm space-y-3">
              {[
                { road: "ถ. แจ้งวัฒนะ", count: 245, pct: "95%" },
                { road: "ถ. งามวงศ์วาน", count: 230, pct: "85%" },
                { road: "ถ. วิภาวดีรังสิต", count: 215, pct: "78%" },
                { road: "ถ. ลาดพร้าว", count: 200, pct: "70%" },
                { road: "ถ. ประชาชื่น", count: 185, pct: "65%" },
              ].map((loc, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span
                      className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${
                        i === 0 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {loc.road}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{loc.count}</span>
                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: loc.pct }}></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl p-5 shadow-sm border flex-1">
            <h3 className="font-semibold mb-4 text-slate-800 border-b pb-2">
              <p>
                🛣️จุดที่มียานพาหนะฝ่าฝืนกฏจราจร{" "}
                <span className="text-red-500 font-bold">ขาออกเมือง</span>{" "}
                มากที่สุด (ครั้ง/วัน)
              </p>
            </h3>
            <ul className="text-sm space-y-3">
              {[
                { road: "ถ. พระราม 2", count: 230, pct: "92%" },
                { road: "ถ. เพชรเกษม", count: 215, pct: "86%" },
                { road: "ถ. รามคำแหง", count: 200, pct: "80%" },
                { road: "ถ. ลาดกระบัง", count: 185, pct: "74%" },
                { road: "ถ. บรมราชชนนี", count: 170, pct: "68%" },
              ].map((loc, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span className="text-slate-600 flex items-center gap-2">
                    <span
                      className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${
                        i === 0 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {loc.road}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{loc.count}</span>
                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: loc.pct }}></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION (Chart & Feed) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold text-lg text-slate-800 mb-4 flex justify-between">
            <span>📈 แนวโน้มการกระทำผิด (รายเดือน)</span>
            <select className="text-xs border rounded p-1 text-slate-500 font-normal">
              <option>2025</option>
              <option>2024</option>
            </select>
          </h3>
          <div className="w-full h-[300px]">
            <TrafficChart />
          </div>
        </div>

        {/* Recent Violations Feed */}
        <div className="rounded-xl shadow-sm border p-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-slate-800">
              รายการฝ่าฝืนล่าสุด (Real-time)
            </h3>
          </div>

          <div className="overflow-y-auto h-[320px] p-4 space-y-3">
            {violations.map((v) => (
              <div
                key={v.id}
                className={`p-3 border rounded-lg text-sm transition-all hover:shadow-md ${
                  v.urgent
                    ? "bg-yellow-50 border-yellow-200"
                    : "border-slate-100"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-bold ${v.urgent ? "text-red-600" : "text-blue-600"}`}>
                    {v.type}
                  </span>
                  <span className="text-xs text-slate-400 px-2 py-0.5 rounded border border-slate-100 shadow-sm">
                    {v.plate}
                  </span>
                </div>
                <div className="text-slate-600 text-xs flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {v.location}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" /> {v.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t text-center">
            <button className="text-blue-600 text-xs font-semibold hover:underline">
              ดูรายการทั้งหมด →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnforcementDashboard;