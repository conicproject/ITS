// frontend/src/pages/DataCollectionDashboard.jsx
import React, { useEffect, useRef, useMemo } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import DateTimeDisplay from "../../components/ui/DateTimeDisplay";

// --- ICON COMPONENTS ---
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
const DatabaseIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
);

// --- HELPERS ---
const gauss = (x, mu, sigma) => Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma));

const genHourlySeries = (peak, floor) => {
  const out = [];
  for (let h = 1; h <= 24; h++) {
    const bump = Math.max(gauss(h, 7, 1.7), gauss(h, 17, 1.7) * 0.98);
    out.push(Math.round(floor + (peak - floor) * bump));
  }
  return out;
};

const DataCollectionDashboard = () => {
  const donutChartRef = useRef(null);
  const lineChartRef = useRef(null);

  // --- VEHICLE TYPE DATA (Memoized) ---
  const vehicleTypes = useMemo(
    () => [
      { key: "suv", label: "SUV", total: 8900, in: 4449, out: 4451, color: "#14B8A6", icon: SuvIcon, peak: 830, floor: 15 },
      { key: "truck", label: "รถบรรทุก", total: 4250, in: 2122, out: 2128, color: "#A16207", icon: SmallTruckIcon, peak: 330, floor: 8 },
      { key: "motorcycle", label: "จักรยานยนต์", total: 6025, in: 3007, out: 3018, color: "#F97316", icon: MotorcycleIcon, peak: 520, floor: 10 },
      { key: "personal", label: "รถยนต์ส่วนบุคคล", total: 7290, in: 3639, out: 3651, color: "#EC4899", icon: CarIcon, peak: 690, floor: 12 },
      { key: "van", label: "รถตู้", total: 5685, in: 2838, out: 2847, color: "#3B82F6", icon: VanIcon, peak: 480, floor: 8 },
      { key: "trike", label: "รถสามล้อเครื่อง", total: 2140, in: 1068, out: 1072, color: "#F472B6", icon: TrikeIcon, peak: 150, floor: 4 },
      { key: "smalltruck", label: "รถบรรทุกขนาดเล็ก", total: 3470, in: 1731, out: 1739, color: "#84CC16", icon: SmallTruckIcon, peak: 300, floor: 6 },
      { key: "bus", label: "รถโดยสาร", total: 1825, in: 911, out: 914, color: "#8B5CF6", icon: BusIcon, peak: 100, floor: 3 },
      { key: "other", label: "อื่นๆ", total: 130, in: 65, out: 65, color: "#DC2626", icon: OtherIcon, peak: 20, floor: 1 },
    ],
    []
  );

  const totalAll = useMemo(() => vehicleTypes.reduce((s, v) => s + v.total, 0), [vehicleTypes]);
  const totalIn = useMemo(() => vehicleTypes.reduce((s, v) => s + v.in, 0), [vehicleTypes]);
  const totalOut = useMemo(() => vehicleTypes.reduce((s, v) => s + v.out, 0), [vehicleTypes]);

  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => (i === 23 ? "24:00" : `${(i + 1).toString().padStart(2, "0")}:00`));
    return hours.map((hour, i) => {
      const row = { hour };
      vehicleTypes.forEach((v) => {
        row[v.key] = genHourlySeries(v.peak, v.floor)[i];
      });
      return row;
    });
  }, [vehicleTypes]);

  // --- EFFECT: DONUT CHART ---
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

    series.data.setAll(
      vehicleTypes.map((v) => ({ category: v.label, value: v.total, color: am5.color(v.color) }))
    );
    series.slices.template.adapters.add("fill", (fill, target) => target.dataItem.dataContext.color);

    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: totalAll.toLocaleString(),
        fontSize: 26,
        fontWeight: "700",
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        fill: am5.color("#FFFFFF"),
      })
    );
    series.appear(800, 100);

    return () => root.dispose();
  }, [vehicleTypes, totalAll]);

  // --- EFFECT: LINE CHART ---
  useEffect(() => {
    if (!lineChartRef.current) return;

    let root = am5.Root.new(lineChartRef.current);
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

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "hour",
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 20,
          stroke: am5.color("#334155"),
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    xAxis.data.setAll(hourlyData);
    xAxis.get("renderer").labels.template.setAll({
      fill: am5.color("#94A3B8"),
      fontSize: 10,
    });
    xAxis.get("renderer").grid.template.setAll({ stroke: am5.color("#1E293B") });

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );
    yAxis.get("renderer").labels.template.setAll({ fill: am5.color("#94A3B8"), fontSize: 11 });
    yAxis.get("renderer").grid.template.setAll({ stroke: am5.color("#1E293B") });

    vehicleTypes.forEach((v) => {
      let series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: v.label,
          xAxis,
          yAxis,
          valueYField: v.key,
          categoryXField: "hour",
          stroke: am5.color(v.color),
          tooltip: am5.Tooltip.new(root, {
            labelText: "{name}: {valueY}",
          }),
        })
      );
      series.set("tensionX", 0.8);
      series.strokes.template.setAll({ strokeWidth: 2 });
      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 2.5,
            fill: am5.color(v.color),
            stroke: am5.color("#131B2E"),
            strokeWidth: 1,
          }),
        })
      );
      series.data.setAll(hourlyData);
      series.appear(800);
    });

    chart.appear(800, 100);

    return () => root.dispose();
  }, [hourlyData, vehicleTypes]);

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#0B1120] p-4 md:p-6 font-sans text-slate-200">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-xl bg-[#131B2E] border border-slate-800/60 mb-5">
        <div className="w-full md:w-auto flex items-start gap-3">
          <span className="text-emerald-400 bg-emerald-400/10 p-2 rounded-lg shrink-0">
            <DatabaseIcon className="w-6 h-6" />
          </span>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">Traffic Data Collection</h1>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">ระบบจัดเก็บและวิเคราะห์ข้อมูลจราจร</p>
          </div>
        </div>
        <DateTimeDisplay />
      </div>

      {/* TOP ROW: total + donut (left) | vehicle type grid (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5 items-stretch">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          {/* Total Card */}
          <div className="bg-[#131B2E] border border-slate-800/60 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 mb-2">ยานพาหนะทั้งหมด</div>
              <div className="text-4xl font-bold text-white">{totalAll.toLocaleString()}</div>
            </div>
            <div className="text-right text-xs space-y-2">
              <div>
                <span className="text-slate-400">ขาเข้า</span>
                <div className="text-emerald-400 font-bold text-base">
                  {totalIn.toLocaleString()} <span className="text-slate-500 font-normal text-[10px]">คัน</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400">ขาออก</span>
                <div className="text-orange-400 font-bold text-base">
                  {totalOut.toLocaleString()} <span className="text-slate-500 font-normal text-[10px]">คัน</span>
                </div>
              </div>
            </div>
          </div>

          {/* Donut Card */}
          <div className="bg-[#131B2E] border border-slate-800/60 rounded-2xl p-5 flex-1 flex flex-col">
            <h2 className="text-sm font-bold text-white mb-1">สัดส่วนประเภทยานพาหนะ</h2>
            <p className="text-xs text-slate-500 mb-2">รวม {totalAll.toLocaleString()} คัน</p>
            <div ref={donutChartRef} className="w-full h-[210px]"></div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3">
              {vehicleTypes.map((v) => (
                <div key={v.key} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: v.color }}></span>
                  <span className="truncate">{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Vehicle Type Grid */}
        <div className="lg:col-span-2 bg-[#131B2E] border border-slate-800/60 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">ประเภทยานพาหนะ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vehicleTypes.map((v) => (
              <div
                key={v.key}
                className="bg-[#0F1626] border border-slate-800/50 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: v.color }}
                  >
                    <v.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-400 mb-0.5 truncate">{v.label}</div>
                    <div className="text-xl font-bold text-white">{v.total.toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-right text-[11px] leading-tight shrink-0 pl-2">
                  <div className="text-slate-400">
                    ขาเข้า <span className="text-emerald-400 font-bold">{v.in.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-400">
                    ขาออก <span className="text-orange-400 font-bold">{v.out.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Hourly traffic line chart */}
      <div className="bg-[#131B2E] border border-slate-800/60 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-1">ปริมาณการจราจรตามช่วงเวลา</h2>
        <p className="text-xs text-slate-500 mb-4">จำนวนยานพาหนะรายชั่วโมง แยกตามประเภท (Volume / Time)</p>
        <div className="flex flex-col lg:flex-row gap-4">
          <div ref={lineChartRef} className="flex-1 h-[420px]"></div>
          <div className="lg:w-44 flex lg:flex-col flex-row flex-wrap gap-x-4 gap-y-2 lg:justify-center">
            {vehicleTypes.map((v) => (
              <div key={v.key} className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: v.color }}></span>
                <span className="truncate">{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCollectionDashboard;