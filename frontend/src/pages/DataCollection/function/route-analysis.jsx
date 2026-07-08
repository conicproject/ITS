// frontend/src/pages/RouteAnalysis.jsx
import React, { useState } from "react";
import {
  FaTruck,
  FaChartLine,
  FaExclamationTriangle,
  FaRoad,
  FaSortAmountDown,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Filter } from "../../../components/ui/Filter";
import { DonutChart } from "../../../components/ui/DonutChart";
import { BarChart } from "../../../components/ui/BarChart";

// --- Components ---
const KPICard = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="rounded-xl p-4 shadow-sm border border-gray-100 flex items-start justify-between h-full">
    <div>
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      {subtext && (
        <p
          className={`text-xs mt-1 ${
            subtext.includes("+") ? "text-red-500" : "text-green-500"
          }`}
        >
          {subtext}
        </p>
      )}
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
      <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
    </div>
  </div>
);

const RouteCard = ({
  route,
  time,
  distance,
  avgSpeed,
  vehicleCount,
  status,
}) => {
  const getStatusColor = (s) => {
    switch (s) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "warning":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };
  const getStatusLabel = (s) => {
    switch (s) {
      case "critical":
        return "รถหนาแน่นมาก";
      case "warning":
        return "การจราจรปานกลาง";
      default:
        return "คล่องตัว";
    }
  };
  const [origin, destination] = route.split(" → ");

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200 h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="h-6 w-0.5 bg-gray-200 border-dashed border-l"></div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">
                {origin}
              </div>
              <div className="text-xs text-gray-400 my-1">
                {distance} กม. • {time} นาที
              </div>
              <div className="text-sm font-semibold text-gray-800">
                {destination}
              </div>
            </div>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full border font-medium whitespace-nowrap ${getStatusColor(
              status,
            )}`}
          >
            {getStatusLabel(status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 bg-gray-50/50 -mx-4 -mb-4 px-4 py-3 rounded-b-xl">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">ความเร็วเฉลี่ย</div>
          <div className="font-bold text-gray-800">
            {avgSpeed}{" "}
            <span className="text-xs font-normal text-gray-500">km/h</span>
          </div>
        </div>
        <div className="text-center border-l border-gray-200">
          <div className="text-xs text-gray-500 mb-1">ปริมาณรถ</div>
          <div className="font-bold text-gray-800">
            {vehicleCount}{" "}
            <span className="text-xs font-normal text-gray-500">คัน</span>
          </div>
        </div>
        <div className="text-center border-l border-gray-200">
          <div className="text-xs text-gray-500 mb-1">เวลาที่ใช้</div>
          <div className="font-bold text-gray-800">
            {time}{" "}
            <span className="text-xs font-normal text-gray-500">นาที</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function RouteAnalysis() {
  const [sortBy, setSortBy] = useState("volume");

  const handleSearch = (filters) => {
    console.log("Search Route Filters:", filters);
  };

  // --- Mock Data ---
  const routes = [
    {
      id: 1,
      route: "รังสิต → อโศก",
      time: "45",
      distance: "28.5",
      avgSpeed: "25",
      vehicleCount: "8,450",
      status: "critical",
    },
    {
      id: 2,
      route: "สีลม → สะพานพระราม 6",
      time: "30",
      distance: "12.2",
      avgSpeed: "45",
      vehicleCount: "3,240",
      status: "warning",
    },
    {
      id: 3,
      route: "บางนา → ตราด",
      time: "20",
      distance: "15.0",
      avgSpeed: "80",
      vehicleCount: "1,200",
      status: "normal",
    },
    {
      id: 4,
      route: "ดินแดง → วิภาวดี",
      time: "60",
      distance: "10.5",
      avgSpeed: "15",
      vehicleCount: "12,500",
      status: "critical",
    },
  ];

  const donutChartData = {
    series: [35, 25, 20, 15, 5],
    options: {
      chart: { type: "donut", fontFamily: "Inherit" },
      labels: [
        "รังสิต-อโศก",
        "ดินแดง-วิภาวดี",
        "สีลม-พระราม6",
        "บางนา-ตราด",
        "อื่นๆ",
      ],
      colors: ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#94A3B8"],
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: { show: true, name: { show: true }, value: { show: true } },
          },
        },
      },
      legend: { position: "bottom" },
    },
  };

  const barData = Array.from({ length: 12 }, (_, i) => ({
    hour: `${(i + 6).toString().padStart(2, "0")}:00`,
    vehicles: Math.floor(Math.random() * 500) + 100,
    speed: Math.floor(Math.random() * 60) + 20,
  }));

  return (
    // ✅ 1. ปรับ Main Wrapper ให้เหมือน InstallationPoint (bg-gray-50, p-4 md:p-6)
    <div className="h-screen overflow-y-auto p-4 md:p-6 pb-32 font-sans text-gray-800">
      
      {/* ✅ 2. ปรับ Max Width เป็น 1600px เพื่อให้เต็มจอเท่ากัน */}
      <div className="max-w-[1600px] mx-auto space-y-6 pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaRoad className="text-indigo-600" />
              วิเคราะห์เส้นทาง (Route Analysis)
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              ติดตามปริมาณรถและความหนาแน่นของเส้นทางหลัก
            </p>
          </div>
        </div>

        {/* Filter */}
        <Filter
          onSearch={handleSearch}
          // เปิดเฉพาะส่วนที่ต้องการ
          showRouteName={true}
          showOriginDest={true}
          showDateRange={true}
          // ปิดส่วนที่ไม่ต้องการ
          showPlate={false}
          showLocation={false}
          showDistrict={false}
          showVehicleType={false}
          // จัด Layout แนวนอน
          routeNameColSpan="col-span-12 md:col-span-12 lg:col-span-3"
          originDestColSpan="col-span-12 md:col-span-12 lg:col-span-5"
          dateColSpan="col-span-12 md:col-span-12 lg:col-span-3"
          placeholderRoute="ค้นหาเส้นทาง..."
        />

        {/* KPIs Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="ปริมาณรถทั้งหมด (วันนี้)"
            value="24,592"
            subtext="+12% จากเมื่อวาน"
            icon={FaTruck}
            color="bg-blue-500"
          />
          <KPICard
            title="ความเร็วเฉลี่ยรวม"
            value="42 km/h"
            subtext="-5% รถติดขึ้น"
            icon={FaChartLine}
            color="bg-orange-500"
          />
          <KPICard
            title="เส้นทางวิกฤต (Critical)"
            value="3 เส้นทาง"
            subtext="ต้องการการจัดการ"
            icon={FaExclamationTriangle}
            color="bg-red-500"
          />
          <KPICard
            title="ระยะทางรวมที่ตรวจจับ"
            value="1,240 km"
            icon={FaMapMarkerAlt}
            color="bg-green-500"
          />
        </div>

        {/* Main Content Grid (Balanced Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column (2 Parts) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaTruck className="text-gray-400" />
                สถานะเส้นทางรายจุด
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaSortAmountDown />
                <select
                  className="bg-transparent border-none focus:ring-0 cursor-pointer hover:text-gray-800 outline-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="volume">เรียงตามปริมาณรถ</option>
                  <option value="speed">เรียงตามความเร็ว</option>
                  <option value="status">เรียงตามสถานะ</option>
                </select>
              </div>
            </div>

            {/* Routes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map((route) => (
                <RouteCard key={route.id} {...route} />
              ))}
            </div>

            {/* Bar Chart */}
            <div className="rounded-xl shadow-sm p-6 border border-gray-100 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  ปริมาณจราจรรายชั่วโมง
                </h3>
              </div>
              <BarChart
                data={barData}
                height={220}
                title=""
                colors={["#818CF8", "#FCA5A5"]}
              />
            </div>
          </div>

          {/* Right Column (1 Part) */}
          <div className="space-y-6 flex flex-col">
            <div className="rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                สัดส่วนความหนาแน่น
              </h3>
              <DonutChart
                height={300}
                headerShow={false}
                dataChart={donutChartData}
              />
            </div>

            <div className="rounded-xl shadow-sm p-6 border border-gray-100 flex-grow">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                5 อันดับ เส้นทางล่าช้าสุด
              </h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          รังสิต - ดินแดง
                        </div>
                        <div className="text-xs text-gray-400">
                          เฉลี่ย 12 km/h
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
                      +25 นาที
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteAnalysis;