import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

export default function TrafficSignal() {
  const [selectedLocation, setSelectedLocation] = useState("สี่แยกราชดำเนิน");

  // Generate hourly data for chart
  const generateChartData = () => {
    const data = [
      120, 90, 80, 70, 60, 100, 400, 900, 1300, 1600, 1500, 1400,
      1450, 1500, 1700, 1800, 1600, 1200, 900, 700, 500, 300, 200, 150,
    ];
    return data;
  };

  const chartData = generateChartData();
  const maxValue = Math.max(...chartData);

  const CameraCard = ({ title, isLarge = false }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm font-medium text-gray-800">{title}</div>
          <div className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded font-medium">
            LIVE
          </div>
        </div>

        <div className={`bg-gray-900 rounded-lg ${isLarge ? "h-64" : "h-36"} mb-3`} />

        <div className="space-y-2">
          <div className="text-xs text-gray-600">การใช้งาน PCU</div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "23%" }} />
          </div>

          <div className="text-[11px] text-gray-600 space-y-0.5 pt-1">
            <div>
              Density: <span className="font-semibold text-gray-800">351 PCU/km</span>
            </div>
            <div>
              Flow(q): <span className="font-semibold text-gray-800">150 PCU/hr</span>
            </div>
            <div>
              ความเร็วเฉลี่ย(v): <span className="font-semibold text-gray-800">35 km/hr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <FaMapMarkerAlt size={18} />
            <h1 className="text-lg font-semibold text-gray-800">สถานที่:</h1>
          </div>
          <input
            type="text"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="ค้นหาสถานที่..."
          />
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <FaSearch size={14} />
            ค้นหา
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          {/* Left Camera */}
          <div className="col-span-3">
            <CameraCard title="เลนกลาง - สีแดง" isLarge={true} />
          </div>

          {/* Intersection Map */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full">
              <div className="p-3 border-b border-gray-200">
                <div className="text-sm font-medium text-gray-800">สี่แยกราชดำเนิน</div>
              </div>

              {/* Map SVG */}
              <div className="relative bg-gray-800 aspect-video">
                <svg viewBox="0 0 600 400" className="w-full h-full">
                  <rect width="600" height="400" fill="#1f2937" />

                  {/* Roads */}
                  <rect x="0" y="150" width="200" height="100" fill="#374151" />
                  <rect x="400" y="150" width="200" height="100" fill="#374151" />
                  <rect x="200" y="0" width="200" height="150" fill="#374151" />
                  <rect x="200" y="250" width="200" height="150" fill="#374151" />

                  {/* Intersection */}
                  <rect x="200" y="150" width="200" height="100" fill="#6b7280" />

                  {/* Lane Markings Horizontal */}
                  {[...Array(8)].map((_, i) => (
                    <line
                      key={`h-${i}`}
                      x1={i < 4 ? 50 + i * 40 : 420 + (i - 4) * 40}
                      y1="200"
                      x2={i < 4 ? 70 + i * 40 : 440 + (i - 4) * 40}
                      y2="200"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="15,10"
                    />
                  ))}

                  {/* Lane Markings Vertical */}
                  {[...Array(8)].map((_, i) => (
                    <line
                      key={`v-${i}`}
                      x1="300"
                      y1={i < 4 ? 30 + i * 30 : 260 + (i - 4) * 35}
                      x2="300"
                      y2={i < 4 ? 50 + i * 30 : 280 + (i - 4) * 35}
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="15,10"
                    />
                  ))}

                  {/* Crosswalks */}
                  {[...Array(10)].map((_, i) => (
                    <React.Fragment key={`cw-${i}`}>
                      <rect x={210 + i * 18} y="145" width="12" height="5" fill="white" />
                      <rect x={210 + i * 18} y="250" width="12" height="5" fill="white" />
                      <rect x="195" y={160 + i * 18} width="5" height="12" fill="white" />
                      <rect x="400" y={160 + i * 18} width="5" height="12" fill="white" />
                    </React.Fragment>
                  ))}

                  {/* Cars */}
                  <circle cx="100" cy="180" r="8" fill="#10b981" />
                  <circle cx="500" cy="220" r="8" fill="#10b981" />
                  <circle cx="270" cy="80" r="8" fill="#10b981" />
                  <circle cx="330" cy="320" r="8" fill="#10b981" />
                  <circle cx="150" cy="220" r="8" fill="#10b981" />
                  <circle cx="450" cy="180" r="8" fill="#10b981" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Four Lane Cameras */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <CameraCard title="เลน 1 - เหนือ" />
          <CameraCard title="เลน 2 - ใต้" />
          <CameraCard title="เลน 3 - ตะวันออก" />
          <CameraCard title="เลน 4 - ตะวันตก" />
        </div>

        {/* Traffic Chart */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            <div>
              <div className="text-base font-semibold text-gray-800">ปริมาณรถวนองค์ข้อมูล (1 วัน)</div>
              <div className="text-xs text-gray-500">ข้อมูลล่าสุด 24 ชั่วโมง</div>
            </div>
          </div>

          {/* Simple Line Chart */}
          <div className="relative h-64 mt-4">
            <svg viewBox="0 0 1200 300" className="w-full h-full">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1="50"
                  y1={30 + i * 50}
                  x2="1150"
                  y2={30 + i * 50}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
              ))}

              {/* Area under curve */}
              <path
                d={`M 50 ${280 - (chartData[0] / maxValue) * 250} ${chartData
                  .map(
                    (val, i) =>
                      `L ${50 + (i * 1100) / 23} ${280 - (val / maxValue) * 250}`
                  )
                  .join(" ")} L ${1150} 280 L 50 280 Z`}
                fill="url(#gradient)"
              />

              {/* Line */}
              <path
                d={`M 50 ${280 - (chartData[0] / maxValue) * 250} ${chartData
                  .map(
                    (val, i) =>
                      `L ${50 + (i * 1100) / 23} ${280 - (val / maxValue) * 250}`
                  )
                  .join(" ")}`}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
              />

              {/* X-axis labels */}
              {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((hour) => (
                <text
                  key={hour}
                  x={50 + (hour * 1100) / 24}
                  y="295"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#6b7280"
                >
                  {`${String(hour).padStart(2, "0")}:00`}
                </text>
              ))}

              {/* Y-axis labels */}
              {[0, 500, 1000, 1500, 2000].map((val, i) => (
                <text
                  key={val}
                  x="40"
                  y={285 - i * 62.5}
                  textAnchor="end"
                  fontSize="11"
                  fill="#6b7280"
                >
                  {val}
                </text>
              ))}
            </svg>
          </div>

          <div className="flex justify-end items-center gap-4 mt-3 text-xs text-gray-500">
            <span>ประมวลผลข้อมูล (1 วัน)</span>
            <span>25 ปิกกิตจป</span>
          </div>
        </div>
      </div>
    </div>
  );
}
