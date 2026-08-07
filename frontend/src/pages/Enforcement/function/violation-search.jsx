// violation-search.jsx
import React, { useEffect, useRef, useMemo, useState } from "react";
import axios from "axios";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// --- ICON COMPONENTS (ประเภทการกระทำผิด) ---
const HelmetIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 15a8 8 0 0 1 16 0" /><path d="M2 15h20" /><path d="M4 15v2a2 2 0 0 0 2 2h2" /><path d="M18 15v2a2 2 0 0 1-2 2h-2" /></svg>
);
const TruckClockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 15V9a1 1 0 0 1 1-1h9v7" /><path d="M12 11h4.5L20 14v4" /><path d="M2 15h9" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="6.5" r="3.5" /><path d="M17.5 4.8v1.9l1.3 1" /></svg>
);
const WrongWayIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 7h13" /><path d="M13 3l4 4-4 4" /><path d="M20 17H7" /><path d="M11 21l-4-4 4-4" /></svg>
);
const LaneChangeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 3v6l-4 4 4 4v4" /><path d="M17 3v6l4 4-4 4v4" /></svg>
);
const TrafficLightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="8" y="2" width="8" height="16" rx="2" /><circle cx="12" cy="6" r="1.3" fill="currentColor" /><circle cx="12" cy="10" r="1.3" /><circle cx="12" cy="14" r="1.3" /><path d="M12 18v4M9 22h6" /></svg>
);
const PedestrianIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="13" cy="4" r="1.6" /><path d="M10 22l1.5-6.5L9 14l1-5 3-1 3 2 3 1" /><path d="M11.5 15.5L15 17l1.5 5" /></svg>
);
const ParkingBanIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="9" /><path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9" /><path d="M5 5l14 14" /></svg>
);
const SpeedIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 15a8 8 0 1 1 16 0" /><path d="M12 15l3.5-4.5" /><path d="M12 15h.01" /></svg>
);

// --- ICON COMPONENTS (ประเภทยานพาหนะ) ---
const SuvIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 16V9.5a1.5 1.5 0 0 1 .5-1.1L6 6h9l3.5 3.5H21a1 1 0 0 1 1 1V16" /><path d="M3 16h18" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>
);
const CarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>
);
const MotorcycleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="5.5" cy="17.5" r="2.5" /><circle cx="18.5" cy="17.5" r="2.5" /><path d="M15 17.5H8l2-6h3l4 3.5h1" /><path d="M10 11.5l1.5-3H14" /></svg>
);
const VanIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 16V7a1 1 0 0 1 1-1h11l5 4v6" /><path d="M3 16h17" /><path d="M11 6v10" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>
);
const TrikeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="9" y="8" width="8" height="7" rx="1" /><path d="M4 17.5h3M4 17.5a1.8 1.8 0 1 0 3.6 0 1.8 1.8 0 0 0-3.6 0Z" /><circle cx="19" cy="17.5" r="2" /><path d="M9 11.5H6l-2 6" /><path d="M17 8V6h2" /></svg>
);
const SmallTruckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 15V9a1 1 0 0 1 1-1h9v7" /><path d="M12 11h4.5L20 14v4" /><path d="M2 15h18" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="16.5" cy="17.5" r="1.8" /></svg>
);
const BusIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="5" width="18" height="11" rx="1.5" /><path d="M3 10h18" /><path d="M7 5v11M17 5v11" /><circle cx="7" cy="18.5" r="1.5" /><circle cx="17" cy="18.5" r="1.5" /></svg>
);
const OtherIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.3a2.5 2.5 0 0 1 4.9.7c0 1.7-2.4 1.9-2.4 3.5" /><circle cx="12" cy="17" r="0.6" fill="currentColor" /></svg>
);
const ShieldIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" /></svg>
);

const getTodayLabel = () =>
  new Date().toLocaleDateString("th-TH-u-ca-buddhist", { day: "numeric", month: "short", year: "numeric" });

const getTodayRange = () => {
  const today = new Date().toISOString().split("T")[0];
  return { startDate: `${today}T00:00:00`, endDate: `${today}T23:59:59` };
};

// ✅ ตั้งค่าประเภทการกระทำผิด — key ต้องตรงกับ field ที่ backend ส่งมา (ปรับตาม API จริง)
const VIOLATION_META = [
  { key: "no_helmet", label: "ไม่สวมหมวกนิรภัย", icon: HelmetIcon, color: "#EF4444" },
  { key: "truck_hours", label: "รถบรรทุกเกินเวลา", icon: TruckClockIcon, color: "#F59E0B" },
  { key: "wrong_way", label: "ขับรถย้อนศร", icon: WrongWayIcon, color: "#EAB308" },
  { key: "sudden_lane_change", label: "เปลี่ยนเลนกะทันหัน", icon: LaneChangeIcon, color: "#8B5CF6" },
  { key: "red_light", label: "ฝ่าฝืนสัญญาณไฟแดง", icon: TrafficLightIcon, color: "#3B82F6" },
  { key: "sidewalk", label: "ยานพาหนะบนทางเท้า", icon: PedestrianIcon, color: "#EC4899" },
  { key: "no_parking", label: "เขตห้ามจอด/จอด", icon: ParkingBanIcon, color: "#22D3EE" },
  { key: "overspeed", label: "ตรวจจับความเร็ว", icon: SpeedIcon, color: "#22C55E" },
];

// ✅ ตั้งค่าประเภทยานพาหนะ
const VEHICLE_META = [
  { key: "suv", label: "SUV", icon: SuvIcon, color: "#2DD4BF" },
  { key: "truck", label: "รถบรรทุก", icon: SmallTruckIcon, color: "#EAB308" },
  { key: "motorcycle", label: "จักรยานยนต์", icon: MotorcycleIcon, color: "#C2703D" },
  { key: "personal_car", label: "รถยนต์ส่วนบุคคล", icon: CarIcon, color: "#F472B6" },
  { key: "van", label: "รถตู้", icon: VanIcon, color: "#3B82F6" },
  { key: "tuk_tuk", label: "รถสามล้อเครื่อง", icon: TrikeIcon, color: "#E879F9" },
  { key: "small_truck", label: "รถบรรทุกขนาดเล็ก", icon: SmallTruckIcon, color: "#22C55E" },
  { key: "bus", label: "รถโดยสาร", icon: BusIcon, color: "#A855F7" },
  { key: "other", label: "อื่นๆ", icon: OtherIcon, color: "#F87171" },
];

// ✅ ข้อมูลตั้งต้น (mock) อ้างอิงจากภาพตัวอย่าง ใช้ระหว่างรอเชื่อม API จริง
const DEFAULT_VIOLATION_TOTALS = {
  no_helmet: { in: 4418, out: 4420 },
  truck_hours: { in: 3628, out: 3629 },
  wrong_way: { in: 2990, out: 2992 },
  sudden_lane_change: { in: 2819, out: 2820 },
  red_light: { in: 2106, out: 2107 },
  sidewalk: { in: 1721, out: 1721 },
  no_parking: { in: 1060, out: 1061 },
  overspeed: { in: 939, out: 940 },
};

const DEFAULT_VEHICLE_TOTALS = {
  suv: { in: 2380, out: 2380 },
  truck: { in: 4637, out: 4639 },
  motorcycle: { in: 7236, out: 7238 },
  personal_car: { in: 1949, out: 1949 },
  van: { in: 1519, out: 1520 },
  tuk_tuk: { in: 584, out: 585 },
  small_truck: { in: 927, out: 928 },
  bus: { in: 432, out: 433 },
  other: { in: 17, out: 17 },
};

const ViolationSearch = () => {
  const donutChartRef = useRef(null);
  const barChartRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([{ value: "all", label: "ทุกจุด" }]);
  const [filters, setFilters] = useState({ location: "all", vehicleType: "all", date: getTodayLabel() });
  const [violationTotals, setViolationTotals] = useState(DEFAULT_VIOLATION_TOTALS);
  const [vehicleTotals, setVehicleTotals] = useState(DEFAULT_VEHICLE_TOTALS);

  // ✅ ดึงข้อมูลสรุปจาก backend — ปรับ endpoint / field ให้ตรงกับ API จริงของโปรเจกต์
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { startDate, endDate } = getTodayRange();
      const { data } = await axios.post(
        "/api/get_violation_summary",
        {
          location: filters.location !== "all" ? filters.location : null,
          vehicle_type: filters.vehicleType !== "all" ? filters.vehicleType : null,
          start_date: startDate,
          end_date: endDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.violation_totals) setViolationTotals(data.violation_totals);
      if (data?.vehicle_totals) setVehicleTotals(data.vehicle_totals);
      if (Array.isArray(data?.locations)) {
        setLocations([{ value: "all", label: "ทุกจุด" }, ...data.locations.map((l) => ({ value: l.id, label: l.name }))]);
      }
    } catch (err) {
      console.error("fetchSummary error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.location, filters.vehicleType]);

  const violationTypes = useMemo(
    () =>
      VIOLATION_META.map((v) => {
        const t = violationTotals[v.key] || { in: 0, out: 0 };
        return { ...v, in: t.in, out: t.out, total: t.in + t.out };
      }),
    [violationTotals]
  );

  const vehicleTypes = useMemo(
    () =>
      VEHICLE_META.map((v) => {
        const t = vehicleTotals[v.key] || { in: 0, out: 0 };
        return { ...v, in: t.in, out: t.out, total: t.in + t.out };
      }),
    [vehicleTotals]
  );

  const totalIn = violationTypes.reduce((s, v) => s + v.in, 0);
  const totalOut = violationTypes.reduce((s, v) => s + v.out, 0);
  const totalAll = totalIn + totalOut;
  const vehicleTotalAll = vehicleTypes.reduce((s, v) => s + v.total, 0);

  const sortedViolations = useMemo(
    () => [...violationTypes].sort((a, b) => a.total - b.total), // ascending: แท่งยาวสุดจะขึ้นบนสุดของแกน Y
    [violationTypes]
  );

  // --- EFFECT: DONUT CHART (สัดส่วนประเภทยานพาหนะ) ---
  useEffect(() => {
    if (!donutChartRef.current) return;

    let root = am5.Root.new(donutChartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(68),
        radius: am5.percent(90),
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        alignLabels: false,
      })
    );
    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);
    series.slices.template.setAll({ stroke: am5.color("#131B2E"), strokeWidth: 3 });

    series.data.setAll(vehicleTypes.map((v) => ({ category: v.label, value: v.total, color: am5.color(v.color) })));
    series.slices.template.adapters.add("fill", (fill, target) => target.dataItem.dataContext.color);

    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: vehicleTotalAll.toLocaleString(),
        fontSize: 24,
        fontWeight: "800",
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        fill: am5.color("#FFFFFF"),
      })
    );
    series.appear(800, 100);

    return () => root.dispose();
  }, [vehicleTypes, vehicleTotalAll]);

  // --- EFFECT: BAR CHART (การกระทำผิดแยกตามประเภท) ---
  useEffect(() => {
    if (!barChartRef.current) return;

    let root = am5.Root.new(barChartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo?.dispose();

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
        paddingLeft: 0,
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "label",
        renderer: am5xy.AxisRendererY.new(root, { minGridDistance: 20 }),
      })
    );
    yAxis.data.setAll(sortedViolations);
    yAxis.get("renderer").labels.template.setAll({ fill: am5.color("#94A3B8"), fontSize: 12 });
    yAxis.get("renderer").grid.template.setAll({ stroke: am5.color("#1E293B") });

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );
    xAxis.get("renderer").labels.template.setAll({ fill: am5.color("#94A3B8"), fontSize: 11 });
    xAxis.get("renderer").grid.template.setAll({ stroke: am5.color("#1E293B") });

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis,
        yAxis,
        valueXField: "total",
        categoryYField: "label",
        tooltip: am5.Tooltip.new(root, { labelText: "{categoryY}: {valueX}" }),
      })
    );
    series.columns.template.setAll({ height: am5.percent(55), cornerRadiusTR: 6, cornerRadiusBR: 6, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", (fill, target) => target.dataItem.dataContext.color);

    series.data.setAll(sortedViolations.map((v) => ({ ...v, color: am5.color(v.color) })));
    series.appear(800);
    chart.appear(800, 100);

    return () => root.dispose();
  }, [sortedViolations]);

  const resetFilters = () => setFilters({ location: "all", vehicleType: "all", date: getTodayLabel() });

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#0B1120] p-4 md:p-6 font-sans text-slate-200">
      {/* --- แถบตัวกรอง --- */}
      <div className="flex flex-col md:flex-row gap-3 mb-5 items-stretch">
        <div className="relative bg-[#131B2E] border border-slate-800/60 rounded-2xl px-4 py-3 flex-1">
          <p className="text-[11px] text-slate-400 mb-1">จุดติดตั้ง</p>
          <select
            value={filters.location}
            onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
            className="bg-transparent w-full appearance-none outline-none cursor-pointer text-sm font-bold text-slate-100"
          >
            {locations.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#131B2E]">{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="relative bg-[#131B2E] border border-slate-800/60 rounded-2xl px-4 py-3 flex-1">
          <p className="text-[11px] text-slate-400 mb-1">ประเภทยานพาหนะ</p>
          <select
            value={filters.vehicleType}
            onChange={(e) => setFilters((f) => ({ ...f, vehicleType: e.target.value }))}
            className="bg-transparent w-full appearance-none outline-none cursor-pointer text-sm font-bold text-slate-100"
          >
            <option value="all" className="bg-[#131B2E]">ทุกประเภท</option>
            {VEHICLE_META.map((v) => (
              <option key={v.key} value={v.key} className="bg-[#131B2E]">{v.label}</option>
            ))}
          </select>
        </div>
        <div className="relative bg-[#131B2E] border border-slate-800/60 rounded-2xl px-4 py-3 flex-1">
          <p className="text-[11px] text-slate-400 mb-1">วันที่</p>
          <p className="text-sm font-bold text-slate-100">{filters.date}</p>
        </div>
        <button
          onClick={resetFilters}
          title="ล้างตัวกรอง"
          className="w-9 h-9 shrink-0 rounded-full bg-[#131B2E] border border-slate-800/60 text-slate-400 hover:text-white transition-colors self-center flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* --- สรุปยอดรวม + การ์ดประเภทการกระทำผิด --- */}
      <div className="flex flex-col lg:flex-row gap-4 mb-5">
        <div className="bg-[#131B2E] border border-red-500/20 rounded-2xl p-5 w-full lg:w-[300px] shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-red-500 border-[3px] border-red-600 rounded-full w-9 h-9 flex items-center justify-center shrink-0">
              <ShieldIcon className="w-4 h-4" />
            </span>
            <span className="text-sm font-black text-slate-100 leading-tight">ยานพาหนะที่ทำผิดทั้งหมด</span>
          </div>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold text-white">{totalAll.toLocaleString()}</span>
            <span className="text-sm text-slate-400 mb-1">รายการ</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0F1626] rounded-xl px-3 py-2">
              <p className="text-xs text-slate-400 mb-1">ขาเข้า</p>
              <p className="text-lg font-bold text-emerald-400">{totalIn.toLocaleString()}</p>
            </div>
            <div className="bg-[#0F1626] rounded-xl px-3 py-2">
              <p className="text-xs text-slate-400 mb-1">ขาออก</p>
              <p className="text-lg font-bold text-orange-400">{totalOut.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 flex-1">
          {violationTypes.map((v) => (
            <div key={v.key} className="bg-[#131B2E] border border-slate-800/60 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${v.color}22`, color: v.color }}>
                  <v.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 truncate">{v.label}</p>
                  <p className="text-lg font-bold text-white leading-tight">{v.total.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right shrink-0 text-[11px] leading-tight">
                <p className="text-slate-400">ขาเข้า <span className="font-bold text-emerald-400">{v.in.toLocaleString()}</span></p>
                <p className="text-slate-400">ขาออก <span className="font-bold text-orange-400">{v.out.toLocaleString()}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- โดนัทชาร์ต + รายการประเภทรถ --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <div className="bg-[#131B2E] border border-slate-800/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-1">สัดส่วนประเภทยานพาหนะที่กระทำผิด</h2>
          <p className="text-xs text-slate-500 mb-2">จำนวน (Count) / ประเภทยานพาหนะ (Type)</p>
          <div ref={donutChartRef} className="w-full h-[260px]"></div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 justify-center">
            {vehicleTypes.map((v) => (
              <div key={v.key} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: v.color }}></span>
                {v.label}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#131B2E] border border-slate-800/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-white">ยานพาหนะที่กระทำผิด - แยกตามประเภทรถ</h2>
              <p className="text-xs text-slate-500">จำนวนการกระทำผิดของยานพาหนะแต่ละประเภท</p>
            </div>
            <select className="bg-[#0F1626] border border-slate-800/60 rounded-lg text-xs font-bold text-blue-400 px-3 py-1.5 outline-none">
              <option>การกระทำผิดทั้งหมด</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vehicleTypes.map((v, i) => (
              <div
                key={v.key}
                className={`bg-[#0F1626] border border-slate-800/50 rounded-xl p-3 flex items-center justify-between gap-3 ${i === vehicleTypes.length - 1 ? "sm:col-span-2" : ""}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: v.color }}>
                    <v.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 truncate">{v.label}</p>
                    <p className="text-lg font-bold text-white leading-tight">{v.total.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 text-[11px] leading-tight">
                  <p className="text-slate-400">ขาเข้า <span className="font-bold text-emerald-400">{v.in.toLocaleString()}</span></p>
                  <p className="text-slate-400">ขาออก <span className="font-bold text-orange-400">{v.out.toLocaleString()}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- กราฟแท่งแยกตามประเภทการกระทำผิด --- */}
      <div className="bg-[#131B2E] border border-slate-800/60 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-1">การกระทำผิดแยกตามประเภท</h2>
        <p className="text-xs text-slate-500 mb-4">จำนวน (Count) / ประเภทการกระทำผิด - เรียงจากมากไปน้อย</p>
        <div ref={barChartRef} className="w-full h-[360px]"></div>
      </div>

      {loading && <p className="text-center text-xs text-slate-500 mt-4">กำลังอัปเดตข้อมูล...</p>}
    </div>
  );
};

export default ViolationSearch;