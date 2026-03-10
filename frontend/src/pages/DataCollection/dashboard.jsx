// frontend/src/pages/DataCollectionDashboard.jsx
import React, { useEffect, useRef, useMemo } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { BarChart } from "../../components/ui/BarChart";
import DateTimeDisplay from "../../components/ui/DateTimeDisplay";

// --- ICON COMPONENTS ---
const CarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>
);
const CameraIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
);
const ShieldIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const MapPinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
const AlertTriangleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const AlertCircleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);
const DatabaseIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
);

const DataCollectionDashboard = () => {
  const pieChartRef = useRef(null);
  
  // --- MOCK DATA (Memoized) ---
  const trafficData = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    vehicles: [10, 8, 5, 7, 18, 60, 82, 72, 65, 50, 48, 45, 42, 38, 45, 68, 82, 72, 60, 45, 32, 20, 15, 18][i],
    speed: [65, 68, 66, 64, 62, 58, 48, 42, 38, 36, 35, 38, 42, 45, 48, 52, 55, 58, 60, 62, 61, 63, 65, 68][i]
  })), []);

  const pieChartData = useMemo(() => [
    { category: "รัชดา-อโศก-สีลม", value: 35, color: "#6366F1" }, 
    { category: "วิภาวดี-ดินแดง-อโศก", value: 25, color: "#EC4899" },
    { category: "สีลม-สาทร-วงเวียนใหญ่", value: 20, color: "#06B6D4" },
    { category: "ลาดพร้าว-รัชดา-ห้วยขวาง", value: 15, color: "#F59E0B" },
    { category: "เส้นทางอื่นๆ", value: 5, color: "#3B82F6" }
  ], []);

  const alerts = useMemo(() => [
    { id: 1, type: 'ฝ่าไฟแดง', plate: '5กจ-8765', location: 'แยกอโศก ถนนสุขุมวิท', time: '14:12 น.', severity: 'critical' },
    { id: 2, type: 'ความเร็วเกินกำหนด', plate: '1กน-1234', location: 'ทางด่วนเฉลิมมหานคร', time: '14:15 น.', severity: 'warning', note: '88 กม./ชม. (เกินกำหนด 80)' },
    { id: 3, type: 'ฝ่าไฟแดง', plate: '3ขท-9988', location: 'แยกพระราม 9', time: '14:20 น.', severity: 'critical' }
  ], []);

  const barChartConfig = useMemo(() => ({
    seriesConfig: [
      { name: 'จำนวนรถ (คัน)', type: 'column', data: trafficData.map(d => d.vehicles) },
      { name: 'ความเร็วเฉลี่ย (Km/H)', type: 'line', data: trafficData.map(d => d.speed) }
    ],
    colors: ['#8B5CF6', '#F87171'],
    customOptions: {
      chart: {
        zoom: { enabled: false, type: 'x', autoScaleYaxis: false },
        toolbar: { show: false }
      },
      yaxis: {
        min: 0, max: 100,
        labels: { style: { fontSize: '11px', fontFamily: 'Sarabun' } }
      },
      // --- แก้ไขส่วนแกน X ตรงนี้ ---
      xaxis: {
         categories: trafficData.map(d => d.hour), // เพิ่มบรรทัดนี้: กำหนด labels เป็นเวลา 00:00 - 23:00
         tickAmount: 24, // แสดงครบทุกขีด
         labels: { 
           style: { fontSize: '10px', fontFamily: 'Sarabun' },
           rotate: -45, 
           hideOverlappingLabels: false, 
           trim: false 
         }
      }
    },
    legendConfig: { position: 'bottom', horizontalAlign: 'center', fontSize: '12px' }
  }), [trafficData]);

  // --- EFFECT: PIE CHART ---
  useEffect(() => {
    if (!pieChartRef.current) return;

    let root = am5.Root.new(pieChartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(65),
        radius: am5.percent(90)
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value", categoryField: "category", alignLabels: false
      })
    );
    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);

    series.data.setAll(pieChartData.map(d => ({ ...d, color: am5.color(d.color) })));
    series.slices.template.adapters.add("fill", (fill, target) => target.dataItem.dataContext.color);

    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: "525", fontSize: 32, fontWeight: "bold",
        centerX: am5.percent(50), centerY: am5.percent(50), fill: am5.color(0x1F2937)
      })
    );
    series.appear(1000, 100);

    return () => root.dispose();
  }, [pieChartData]);

  return (
    <div className="h-screen overflow-y-auto bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
        
        {/* Title Group */}
        <div className="w-full md:w-auto flex items-start gap-3">
            <span className="text-green-600 bg-green-50 p-2 rounded-lg shrink-0">
               <DatabaseIcon className="w-6 h-6" />
            </span>
            <div className="flex flex-col">
                <h1 className="text-xl md:text-3xl font-bold text-slate-800 leading-tight">
                    Traffic Data Collection
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                    ระบบจัดเก็บและวิเคราะห์ข้อมูลจราจร
                </p>
            </div>
        </div>

        {/* Time Component */}
        <DateTimeDisplay />
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { label: "ยานพาหนะทั้งหมด", val: "2,547", sub: "↗ +12% จากเมื่อวาน", color: "blue", icon: <CarIcon className="w-6 h-6" /> },
          { label: "กล้องที่ใช้งาน", val: "23/24", sub: "95.8% อัตราการทำงาน", color: "green", icon: <CameraIcon className="w-6 h-6" /> },
          { label: "การฝ่าฝืนวันนี้", val: "89", sub: "⚠️ ต้องตรวจสอบ", color: "red", icon: <ShieldIcon className="w-6 h-6" /> },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white rounded-2xl shadow-sm p-6 border-b-4 border-${stat.color}-500 hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start">
              <div>
                <div className={`text-4xl font-bold text-${stat.color}-600 mb-2`}>{stat.val}</div>
                <div className="text-slate-600 font-semibold">{stat.label}</div>
                <div className={`text-xs mt-1 font-medium ${stat.color === 'red' ? 'text-red-500' : 'text-slate-400'}`}>{stat.sub}</div>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-xl text-${stat.color}-500`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE ROW (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 flex flex-col h-full">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-l-4 border-slate-800 pl-3">
             📊 ปริมาณจราจรรายชั่วโมง
          </h2>
          <div className="flex-1 min-h-[300px]">
            <BarChart
              data={trafficData}
              height={300}
              showTitle={false}
              seriesConfig={barChartConfig.seriesConfig}
              colors={barChartConfig.colors}
              customOptions={barChartConfig.customOptions}
              legendConfig={barChartConfig.legendConfig}
            />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col h-full">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-l-4 border-slate-800 pl-3">
            📈 สัดส่วนตามพื้นที่
          </h2>
          <div className="flex flex-col items-center justify-center h-full">
            <div ref={pieChartRef} className="w-full h-[200px] mb-4 relative z-0"></div>
            <div className="w-full space-y-2">
               {pieChartData.map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between text-xs px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-slate-600 truncate max-w-[150px]">{item.category}</span>
                    </div>
                    <span className="font-bold text-slate-700">{item.value}%</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW (Lists & Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Violations List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 h-full">
          <div className="flex items-center justify-between mb-6 border-l-4 border-slate-800 pl-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangleIcon className="w-5 h-5" /> การฝ่าฝืนล่าสุด
            </h2>
            <button className="text-xs text-blue-600 hover:underline">ดูทั้งหมด</button>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="group flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl p-4 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg ${alert.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {alert.severity === 'critical' ? <AlertCircleIcon className="w-5 h-5"/> : <AlertTriangleIcon className="w-5 h-5"/>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 text-sm">{alert.type}</span>
                      {alert.note && <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{alert.note}</span>}
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><CarIcon className="w-3 h-3"/> {alert.plate}</span>
                      <span className="hidden md:inline text-slate-300">|</span>
                      <span className="flex items-center gap-1"><MapPinIcon className="w-3 h-3"/> {alert.location}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 md:mt-0 text-xs font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">
                  {alert.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Camera Status (Stacked Box) */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-l-4 border-slate-800 pl-3">
             📸 สถานะระบบ
          </h2>
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex-1 bg-green-50 border border-green-100 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-green-100 transition-colors cursor-pointer">
              <div className="text-4xl font-bold text-green-600 mb-1">24</div>
              <div className="text-xs font-medium text-green-700 uppercase tracking-wide">Online Cameras</div>
            </div>
            <div className="h-20 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between hover:bg-blue-100 transition-colors cursor-pointer">
               <span className="text-sm font-medium text-blue-700">กำลังซ่อมบำรุง</span>
               <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <div className="h-20 bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center justify-between hover:bg-orange-100 transition-colors cursor-pointer">
               <span className="text-sm font-medium text-orange-700">ซ่อมเสร็จสิ้น</span>
               <span className="text-2xl font-bold text-orange-600">5</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DataCollectionDashboard;