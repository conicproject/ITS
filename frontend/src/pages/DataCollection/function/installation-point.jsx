import React from "react";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { 
  FaMapMarkerAlt, 
  FaCar, 
  FaMotorcycle, 
  FaBus, 
  FaShuttleVan, 
  FaTruckPickup, 
  FaQuestionCircle,
  FaTruck, 
  FaCarSide
} from 'react-icons/fa';
import ReactApexCharts from 'react-apexcharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- IMPORT FILTER ---
import { Filter } from './../../../components/ui/Filter'; 

// --- Components ย่อย ---
const TukTukIcon = ({ className, size = "1em" }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height={size} width={size} xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M448 160h-32V96c0-17.67-14.33-32-32-32H128c-17.67 0-32 14.33-32 32v64H64c-35.35 0-64 28.65-64 64v160c0 17.67 14.33 32 32 32h32c0 17.67 14.33 32 32 32s32-14.33 32-32h256c0 17.67 14.33 32 32 32s32-14.33 32-32h32c17.67 0 32-14.33 32-32V224c0-35.35-28.65-64-64-64zm-64 224H128v-96h256v96zM128 96h256v64H128V96z"/>
  </svg>
);

// --- Configuration ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const InstallationPoint = () => {
  
  const handleSearch = (filterData) => {
    console.log("Searching with:", filterData);
  };

  // Mock Data
  const stats = {
    totalRecords: 345,
    trafficInbound: 200,
    trafficOutbound: 145,
    totalViolations: 45,
    violationInbound: 25,
    violationOutbound: 20,
    vehicleTypes: {
      suv: { count: 5, color: '#10b981' }, 
      motorcycle: { count: 189, color: '#f97316' }, 
      sedan: { count: 5, color: '#ec4899' }, 
      van: { count: 1, color: '#6366f1' }, 
      pickupSmall: { count: 5, color: '#84cc16' }, 
      truck: { count: 4, color: '#eab308' }, 
      bus: { count: 4, color: '#1e40af' }, 
      personal: { count: 133, color: '#3b82f6' }, 
      tuktuk: { count: 4, color: '#a855f7' }, 
      others: { count: 0, color: '#6b7280' } 
    }
  };

  const vehiclesList = [
    { key: 'suv', label: 'รถ SUV', icon: <FaCarSide /> },
    { key: 'motorcycle', label: 'รถจักรยานยนต์', icon: <FaMotorcycle /> },
    { key: 'van', label: 'รถตู้', icon: <FaShuttleVan /> },
    { key: 'pickupSmall', label: 'รถบรรทุกขนาดเล็ก', icon: <FaTruckPickup /> },
    { key: 'truck', label: 'รถบรรทุก', icon: <FaTruck /> },
    { key: 'personal', label: 'รถยนต์ส่วนบุคคล', icon: <FaCar /> },
    { key: 'tuktuk', label: 'รถสามล้อเครื่อง', icon: <TukTukIcon /> },
    { key: 'bus', label: 'รถโดยสาร', icon: <FaBus /> },
    { key: 'others', label: 'อื่นๆ', icon: <FaQuestionCircle /> },
  ];

  const donutOptions = {
    chart: { type: 'donut', fontFamily: 'Sarabun, sans-serif' },
    labels: vehiclesList.map(v => v.label),
    colors: vehiclesList.map(v => stats.vehicleTypes[v.key].color),
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'รวม',
              formatter: () => stats.totalRecords.toString(),
              fontSize: '20px',
              fontWeight: 600,
              color: '#374151'
            },
            value: {
              fontSize: '24px',
              fontWeight: 700,
              offsetY: 2,
            }
          }
        }
      }
    },
    stroke: { width: 0 }
  };

  const donutSeries = vehiclesList.map(v => stats.vehicleTypes[v.key].count);

  // --- FIX: เพิ่ม Responsive Configuration ให้กราฟเส้น ---
  const lineOptions = {
    chart: { type: 'line', height: 300, toolbar: { show: false }, fontFamily: 'Sarabun, sans-serif' },
    colors: ['#a855f7', '#ef4444', '#06b6d4', '#f59e0b', '#3b82f6', '#10b981', '#6366f1'],
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { 
        categories: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00'] 
    },
    grid: { borderColor: '#f3f4f6', strokeDashArray: 5 },
    legend: { position: 'top', horizontalAlign: 'right' },
    // เพิ่มส่วน Responsive
    responsive: [
      {
        breakpoint: 768, // สำหรับหน้าจอ Tablet และ Mobile
        options: {
          legend: {
            position: 'bottom', // ย้าย Legend มาไว้ด้านล่าง
            horizontalAlign: 'left',
            offsetY: 0,
            itemMargin: {
                horizontal: 5,
                vertical: 5
            }
          },
          chart: {
            height: 350 // เพิ่มความสูงกราฟเล็กน้อยเพื่อรองรับ Legend ด้านล่าง
          },
          xaxis: {
            labels: {
                rotate: -45, // เอียงตัวหนังสือแกน X ป้องกันการซ้อนทับ
                style: {
                    fontSize: '10px'
                }
            }
          }
        }
      }
    ]
  };

  const lineSeries = [
    { name: 'Blacklist', data: [10, 15, 8, 12, 20, 18, 5, 10, 8] },
    { name: 'วิ่งบนทางเท้า', data: [45, 50, 35, 60, 40, 55, 30, 45, 50] },
    { name: 'เปลี่ยนช่องในเขตเส้นทึบ', data: [80, 95, 70, 85, 100, 90, 75, 80, 85] },
    { name: 'จอดในที่ห้ามจอด', data: [50, 80, 40, 60, 30, 90, 50, 70, 60] },
    { name: 'ฝ่าสัญญาณไฟ', data: [150, 100, 180, 120, 190, 150, 170, 140, 160] },
    { name: 'รถบรรทุกในเวลาห้ามเดินรถ', data: [25, 30, 20, 35, 15, 25, 40, 20, 30] },
    { name: 'ความเร็วเกินกำหนด', data: [200, 180, 220, 190, 210, 230, 170, 195, 205] }
  ];

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-4 md:p-6 font-sans text-gray-800">
      <div className="max-w-[1600px] mx-auto space-y-6 pb-10">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <FaMapMarkerAlt size={20} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">จุดติดตั้งกล้อง</h1>
            <p className="text-xs md:text-sm text-gray-500">ระบบวิเคราะห์ข้อมูลจราจรและตรวจจับการฝ่าฝืน</p>
          </div>
        </div>

        {/* Filter Section */}
        <Filter
            onSearch={handleSearch}
            showLocation={true}
            showDistrict={true}
            showDateRange={true}
            showPlate={false}
            showVehicleType={false}
            locationColSpan="col-span-12 md:col-span-4 lg:col-span-4"
            districtColSpan="col-span-12 md:col-span-4 lg:col-span-3"
            dateColSpan="col-span-12 md:col-span-12 lg:col-span-4"
            placeholderLocation="ระบุชื่อจุดติดตั้ง..."
        />

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-gray-200 pb-1 overflow-x-auto no-scrollbar">
          <button className="px-6 py-2 text-sm font-semibold text-emerald-600 border-b-2 border-emerald-600 whitespace-nowrap">
            ภาพรวมจุดติดตั้ง / รวมทั้งเขต : หลักสี่
          </button>
          <button className="px-6 py-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">
            จุดติดตั้ง : ถ.แจ้งวัฒนะ
          </button>
          <button className="px-6 py-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">
            จุดติดตั้ง : แยกหลักสี่
          </button>
          <button className="px-6 py-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">
            จุดติดตั้ง : IT Square
          </button>
          <button className="px-6 py-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors whitespace-nowrap">
            จุดติดตั้ง : ศูนย์ราชการฯ
          </button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* COLUMN 1: Visuals */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="relative h-[240px] md:h-[280px]">
                <img src="https://images.unsplash.com/photo-1566371486490-560ded23b5e4?w=600&auto=format&fit=crop&q=60" alt="CCTV" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1">
                  🔴 LIVE
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  กล้อง: TF-YW-02-05
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[240px] md:h-[300px] relative z-0">
               <MapContainer 
                 center={[13.7563, 100.5018]} 
                 zoom={13} 
                 style={{ height: '100%', width: '100%' }} 
                 zoomControl={false} 
                 dragging={false} 
                 scrollWheelZoom={false}
               >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[13.7563, 100.5018]} icon={new L.Icon.Default()} />
              </MapContainer>
            </div>
          </div>

          {/* COLUMN 2: Traffic Stats */}
          <div className="col-span-12 lg:col-span-5 md:col-span-6 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between h-auto md:h-[200px]">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">ปริมาณการจราจรทั้งหมด</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-bold text-blue-600 tracking-tight">{stats.totalRecords}</span>
                    <span className="text-sm text-gray-400">คัน</span>
                  </div>
                </div>
                <div className="space-y-3 w-full md:w-auto text-left md:text-right flex flex-row md:flex-col justify-between md:justify-start border-t md:border-t-0 pt-4 md:pt-0">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">ขาเข้าเมือง</div>
                    <div className="text-xl md:text-2xl font-bold text-emerald-500">{stats.trafficInbound}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">ขาออกเมือง</div>
                    <div className="text-xl md:text-2xl font-bold text-red-500">{stats.trafficOutbound}</div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-auto min-h-[380px] relative flex flex-col items-center justify-center">
               <h4 className="absolute top-4 left-6 text-sm font-semibold text-gray-700">สัดส่วนยานพาหนะ</h4>
               <div className="w-full flex justify-center mt-6 md:mt-0">
                 <ReactApexCharts options={donutOptions} series={donutSeries} type="donut" width="100%" height={320} />
               </div>
            </div>
          </div>

          {/* COLUMN 3: Violations & List */}
          <div className="col-span-12 lg:col-span-4 md:col-span-6 flex flex-col gap-6">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between h-auto md:h-[200px]">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">ยานพาหนะฝ่าฝืนทั้งหมด</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-bold text-blue-600 tracking-tight">{stats.totalViolations}</span>
                    <span className="text-sm text-gray-400">คัน</span>
                  </div>
                </div>
                 <div className="space-y-3 w-full md:w-auto text-left md:text-right flex flex-row md:flex-col justify-between md:justify-start border-t md:border-t-0 pt-4 md:pt-0">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">ขาเข้าเมือง</div>
                    <div className="text-xl md:text-2xl font-bold text-emerald-500">{stats.violationInbound}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">ขาออกเมือง</div>
                    <div className="text-xl md:text-2xl font-bold text-red-500">{stats.violationOutbound}</div>
                  </div>
                </div>
              </div>
               <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-[380px] overflow-hidden flex flex-col">
               <h4 className="text-sm font-semibold text-gray-700 mb-3">จำแนกตามประเภท</h4>
               <div className="overflow-y-auto pr-2 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    {vehiclesList.map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-opacity-10 shrink-0" style={{ backgroundColor: stats.vehicleTypes[item.key].color + '20' }}>
                            <span className="text-lg" style={{ color: stats.vehicleTypes[item.key].color }}>{item.icon}</span>
                          </div>
                          <span className="text-xs text-gray-600 font-medium truncate max-w-[90px] md:max-w-[70px]">{item.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-700">{stats.vehicleTypes[item.key].count}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Chart Section */}
        {/* FIX: ปรับ padding-6 เป็น p-4 md:p-6 เพื่อให้พื้นที่แสดงผลบนมือถือมากขึ้น */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
             <h3 className="text-lg font-bold text-gray-800">สถิติการฝ่าฝืนย้อนหลัง</h3>
             <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1 focus:outline-none w-full sm:w-auto">
               <option>7 วันล่าสุด</option>
               <option>30 วันล่าสุด</option>
             </select>
          </div>
          <div className="w-full overflow-hidden">
             {/* กราฟจะใช้ options ที่เพิ่ม responsive แล้ว */}
             <ReactApexCharts options={lineOptions} series={lineSeries} type="line" height={320} width="100%" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstallationPoint;