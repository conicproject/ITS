// frontend/src/pages/TrafficSignal.jsx
import React from "react";
import {
  FaCar,
  FaTruck,
  FaMotorcycle,
  FaCarSide,
  FaShuttleVan,
  FaTaxi,
  FaTruckPickup,
  FaBus,
  FaEllipsisH,
} from "react-icons/fa";
import { Filter } from "../../../components/ui/Filter";

import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

/* ============================== MOCK DATA ============================== */

const VEHICLE_TYPES = [
  { id: "suv", name: "SUV", total: 5925, in: 2963, out: 2962, color: "#2dd4bf", Icon: FaCar },
  { id: "truck", name: "รถบรรทุก", total: 2102, in: 1051, out: 1051, color: "#fb923c", Icon: FaTruck },
  { id: "moto", name: "จักรยานยนต์", total: 7189, in: 3595, out: 3594, color: "#f472b6", Icon: FaMotorcycle },
  { id: "car", name: "รถยนต์ส่วนบุคคล", total: 8756, in: 4378, out: 4378, color: "#fb7185", Icon: FaCarSide },
  { id: "van", name: "รถตู้", total: 4173, in: 2087, out: 2086, color: "#818cf8", Icon: FaShuttleVan },
  { id: "tuktuk", name: "รถสามล้อเครื่อง", total: 1860, in: 930, out: 930, color: "#facc15", Icon: FaTaxi },
  { id: "pickup", name: "รถกระบะบรรทุกเล็ก", total: 5586, in: 2793, out: 2793, color: "#34d399", Icon: FaTruckPickup },
  { id: "bus", name: "รถโดยสาร", total: 3409, in: 1705, out: 1704, color: "#a78bfa", Icon: FaBus },
];

const OTHER = { id: "other", name: "อื่นๆ", total: 715, in: 358, out: 357, color: "#ef4444", Icon: FaEllipsisH };

const ALL_TYPES = [...VEHICLE_TYPES, OTHER];

const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

// synthetic bimodal curve (morning + evening peak), scaled to a total
function hourlyCurve(peak) {
  return Array.from({ length: 24 }, (_, h) => {
    const g1 = Math.exp(-((h - 7.5) ** 2) / 8);
    const g2 = Math.exp(-((h - 17.5) ** 2) / 8);
    const base = 0.04;
    return Math.round((g1 + g2 + base) * peak);
  });
}

/* ============================== COMPONENT ============================== */

export default function TrafficSignal() {
  const totalAll = ALL_TYPES.reduce((s, v) => s + v.total, 0);
  const totalIn = ALL_TYPES.reduce((s, v) => s + v.in, 0);
  const totalOut = ALL_TYPES.reduce((s, v) => s + v.out, 0);

  const handleSearch = (e) => {
    console.log("Searching...", e);
  };

  /* ---- donut ---- */
  const donutData = {
    labels: ALL_TYPES.map((v) => v.name),
    datasets: [
      {
        data: ALL_TYPES.map((v) => v.total),
        backgroundColor: ALL_TYPES.map((v) => v.color),
        borderColor: "#0b1220",
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toLocaleString()} คัน` },
      },
    },
  };

  /* ---- volume line chart ---- */
  const volumeData = {
    labels: HOURS,
    datasets: ALL_TYPES.map((v) => ({
      label: v.name,
      data: hourlyCurve(v.total * 0.11),
      borderColor: v.color,
      backgroundColor: v.color + "22",
      borderWidth: 1.75,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointBackgroundColor: v.color,
      fill: false,
    })),
  };
  const volumeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15,22,40,.95)",
        titleColor: "#e5edff",
        bodyColor: "#c7d5f0",
        borderColor: "rgba(255,255,255,.1)",
        borderWidth: 1,
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} คัน` },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,.05)" },
        ticks: { color: "rgba(220,234,255,.5)", font: { size: 10 }, maxRotation: 0 },
      },
      y: {
        grid: { color: "rgba(255,255,255,.06)", borderDash: [4, 4] },
        ticks: { color: "rgba(220,234,255,.5)", font: { size: 10 } },
        beginAtZero: true,
      },
    },
  };

  /* ---- inbound/outbound diverging bar chart ---- */
  const flowData = {
    labels: HOURS,
    datasets: [
      { label: "ขาเข้า", data: hourlyCurve(totalIn * 0.11), backgroundColor: "#34d399", borderRadius: 3, stack: "flow" },
      { label: "ขาออก", data: hourlyCurve(totalOut * 0.11).map((v) => -v), backgroundColor: "#fb923c", borderRadius: 3, stack: "flow" },
    ],
  };
  const flowOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15,22,40,.95)",
        titleColor: "#e5edff",
        bodyColor: "#c7d5f0",
        borderColor: "rgba(255,255,255,.1)",
        borderWidth: 1,
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${Math.abs(ctx.parsed.y).toLocaleString()} คัน` },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "rgba(220,234,255,.5)", font: { size: 10 }, maxRotation: 0 } },
      y: {
        grid: { color: "rgba(255,255,255,.06)", borderDash: [4, 4] },
        ticks: { color: "rgba(220,234,255,.5)", font: { size: 10 }, callback: (v) => Math.abs(v).toLocaleString() },
      },
    },
  };

  const cardStyle = {
    background: "rgba(255,255,255,.035)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "16px",
    padding: "16px",
  };

  return (
    <div
      className="h-screen overflow-y-auto font-sans text-white pb-10"
      style={{ background: "linear-gradient(160deg,#0e1526,#0a0f1d 55%,#0b1220)" }}
    >
      <div className="p-4 md:p-6 flex flex-col gap-5 max-w-[1800px] mx-auto">
        {/* --- Filter Section --- */}
        <div className="mb-1">
          <Filter type="trafficVolume" onSearch={handleSearch} dark />
        </div>

        {/* ===================== TOP: total + donut / vehicle cards ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-4 items-stretch">
          {/* LEFT */}
          <div className="flex flex-col gap-4">
            <div style={cardStyle}>
              <div className="inline-block text-[13px] text-[rgba(220,234,255,.7)] bg-white/5 px-3.5 py-1 rounded-lg">
                ยานพาหนะทั้งหมด
              </div>
              <div className="text-[42px] font-bold tracking-tight mt-2 leading-none">
                {totalAll.toLocaleString()}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4 pt-[15px] border-t border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-[9px] h-[9px] rounded-full bg-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs text-emerald-300 font-semibold">ขาเข้า</div>
                    <div className="text-xl font-bold leading-tight">{totalIn.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-[9px] h-[9px] rounded-full bg-orange-400 shrink-0" />
                  <div>
                    <div className="text-xs text-orange-300 font-semibold">ขาออก</div>
                    <div className="text-xl font-bold leading-tight">{totalOut.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={cardStyle} className="flex flex-col flex-1">
              <div className="font-semibold text-[15px]">สัดส่วนประเภทยานพาหนะ</div>
              <div className="relative flex-1 min-h-[300px] mt-2.5">
                <Doughnut data={donutData} options={donutOptions} />
              </div>
              <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 mt-3 justify-center">
                {ALL_TYPES.map((v) => (
                  <div key={v.id} className="flex items-center gap-1.5 text-[11.5px] text-[rgba(220,234,255,.72)]">
                    <span className="w-2 h-2 rounded-full" style={{ background: v.color }} />
                    {v.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: vehicle type cards */}
          <div style={cardStyle} className="flex flex-col">
            <div className="text-center font-semibold text-[15px] pb-3.5 border-b border-white/10 mb-3.5">
              ประเภทยานพาหนะ
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VEHICLE_TYPES.map((v) => (
                <VehicleCard key={v.id} v={v} />
              ))}
            </div>
            <div className="mt-3">
              <VehicleCard v={OTHER} />
            </div>
          </div>
        </div>

        {/* ===================== VOLUME LINE CHART ===================== */}
        <div style={cardStyle} className="flex flex-col">
          <div>
            <div className="font-semibold text-[15px]">ปริมาณการจราจรตามช่วงเวลา</div>
            <div className="text-[11.5px] text-[rgba(220,234,255,.5)] mt-0.5">
              จำนวนยานพาหนะ (Volume) / ช่วงเวลา (Time)
            </div>
          </div>
          <div className="relative h-[400px] mt-2.5">
            <Line data={volumeData} options={volumeOptions} />
          </div>
        </div>

        {/* ===================== INBOUND/OUTBOUND BAR CHART ===================== */}
        <div style={cardStyle} className="flex flex-col">
          <div className="flex items-end justify-between flex-wrap gap-2">
            <div>
              <div className="font-semibold text-[15px]">รถขาเข้า / ขาออก ตามช่วงเวลา</div>
              <div className="text-[11.5px] text-[rgba(220,234,255,.5)] mt-0.5">
                ขาเข้า (Inbound) / ขาออก (Outbound) ต่อช่วงเวลา (Time)
              </div>
            </div>
            <div className="flex gap-3.5 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> ขาเข้า
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400" /> ขาออก
              </span>
            </div>
          </div>
          <div className="relative h-[360px] mt-2.5">
            <Bar data={flowData} options={flowOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== SUB-COMPONENT ============================== */

function VehicleCard({ v }) {
  const Icon = v.Icon;
  return (
    <div className="relative flex items-center gap-3 rounded-[14px] border border-white/8 bg-white/[.03] p-3 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: v.color }} />
      <div
        className="w-9 h-9 rounded-lg grid place-items-center shrink-0 ml-1"
        style={{ background: v.color + "22", color: v.color }}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0 border-r border-white/8 pr-2.5">
        <div className="text-[12.5px] text-[rgba(220,234,255,.75)] whitespace-nowrap overflow-hidden text-ellipsis">
          {v.name}
        </div>
        <div className="text-[23px] font-bold tracking-tight">{v.total.toLocaleString()}</div>
      </div>
      <div className="flex-none flex flex-col gap-1 text-right">
        <div>
          <span className="text-[10.5px] text-emerald-300">ขาเข้า</span>{" "}
          <span className="text-[12.5px] font-semibold">{v.in.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[10.5px] text-orange-300">ขาออก</span>{" "}
          <span className="text-[12.5px] font-semibold">{v.out.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}