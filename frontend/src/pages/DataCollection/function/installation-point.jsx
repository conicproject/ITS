import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import ReactApexCharts from 'react-apexcharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const InstallationPoint = () => {
  const stats = {
    totalRecords: 345,
    totalViolations: 145,
    totalInstallations: 200,
    violationRate: 25,
    totalPassingGreen: 45,
    totalViolatingRed: 20,
    vehicleTypes: {
      suv: { count: 5, violations: 0 },
      motorcycle: { count: 189, violations: 133 },
      sedan: { count: 5, violations: 4 },
      van: { count: 1, violations: 4 },
      pickupSmall: { count: 5, violations: 0 },
      truck: { count: 4, violations: 0 },
      bus: { count: 4, violations: 0 },
      personal: { count: 133, violations: 0 },
      pickup: { count: 0, violations: 0 },
      tuktuk: { count: 4, violations: 0 }
    }
  };

  // ข้อมูลสำหรับ Donut Chart
  const donutChartOptions = {
    chart: {
      type: 'donut',
      height: 250
    },
    labels: ['ปริมาณทั้งหมด', 'ฝ่าฝืนสัญญาณไฟ'],
    colors: ['#10b981', '#ef4444'],
    legend: {
      show: true,
      position: 'right',
      fontSize: '12px'
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px'
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 'bold'
            },
            total: {
              show: true,
              label: 'รวม',
              fontSize: '14px',
              formatter: () => stats.totalRecords.toString()
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const donutChartSeries = [stats.totalInstallations, stats.totalViolations];

  // ข้อมูลสำหรับ Line Chart
  const vehicleCategories = ['SUV', 'จักรยานยนต์', 'รถตู้', 'บรรทุก', 'บรรทุกขนาดเล็ก', 'รถเก๋ง', 'สามล้อเครื่อง', 'ส่วนบุคคล', 'รถโดยสาร', 'ยนต์', 'อื่นๆ'];
  
  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      }
    },
    colors: ['#1e40af', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626', '#db2777', '#65a30d', '#0d9488', '#6366f1'],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: vehicleCategories,
      labels: {
        style: {
          fontSize: '11px'
        }
      }
    },
    yaxis: {
      min: 0,
      max: 20000,
      tickAmount: 4
    },
    legend: {
      position: 'bottom',
      fontSize: '11px',
      markers: {
        width: 8,
        height: 8
      }
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4
    },
    tooltip: {
      shared: true,
      intersect: false
    }
  };

  const lineChartSeries = [
    {
      name: 'Blacklist',
      data: [150, 100, 180, 120, 190, 150, 170, 140, 160, 130, 180]
    },
    {
      name: 'ร้อยผ่านด่าน',
      data: [5000, 10500, 4000, 5500, 3500, 2000, 4500, 3000, 5000, 4000, 1500]
    },
    {
      name: 'มุมสมบูรณ์',
      data: [800, 1200, 900, 1100, 1000, 700, 1000, 800, 1100, 900, 600]
    },
    {
      name: 'ต้นป้องกันมือสัมผัส',
      data: [2000, 5000, 2500, 3000, 2000, 1500, 2500, 2000, 3000, 2500, 1000]
    },
    {
      name: 'จองตรมไปตรงข้าม',
      data: [1500, 4000, 2000, 2500, 1800, 1200, 2000, 1500, 2500, 2000, 800]
    },
    {
      name: 'รถมีร่างป้ายทะเบียน',
      data: [1000, 3000, 1500, 2000, 1500, 1000, 1800, 1200, 2000, 1500, 700]
    },
    {
      name: 'มีปัญหาป้ายทะเบียน',
      data: [800, 2500, 1200, 1800, 1300, 900, 1500, 1000, 1800, 1300, 600]
    },
    {
      name: 'รถบรรทุกทำงานพิเศษ',
      data: [500, 2000, 1000, 1500, 1000, 700, 1200, 800, 1500, 1000, 500]
    },
    {
      name: 'ล่วงหน้าพื้นที่ควบคุม',
      data: [300, 1500, 800, 1200, 800, 500, 1000, 600, 1200, 800, 400]
    },
    {
      name: 'อื่นๆ',
      data: [200, 1000, 600, 900, 600, 400, 800, 500, 900, 600, 300]
    }
  ];

  const handleSearch = (params) => {
    console.log("INSTALLATION SEARCH:", params);
  };

  return (
    <div className="fix-function-page-y-auto p-6 bg-white flex flex-col gap-6">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
            <FaMapMarkerAlt className="text-white w-4 h-4" />
          </div>
          <h1 className="text-xl font-semibold">จุดติดตั้งกล้อง</h1>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          วิเคราะห์การเดินทางของยานพาหนะทั้งหมด-ปลายทาง
        </p>

        {/* Filter Component */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex gap-4 items-center">
            <input 
              type="text" 
              placeholder="ค้นหาจุดติดตั้ง"
              className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm"
            />
            <select className="px-4 py-2 border border-gray-300 rounded text-sm">
              <option>Select Date</option>
            </select>
            <span className="text-gray-400">to</span>
            <select className="px-4 py-2 border border-gray-300 rounded text-sm">
              <option>Select Date</option>
            </select>
            <button className="bg-green-700 text-white px-6 py-2 rounded text-sm hover:bg-green-800">
              ค้นหา
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button className="bg-green-700 text-white px-6 py-2 rounded text-sm">
            จุดติดตั้งกล้อง
          </button>
          <button className="bg-white text-green-700 border border-green-700 px-6 py-2 rounded text-sm hover:bg-green-50">
            จุดติดตั้งกล้อง : ถ.แจ้งวัฒนะ
          </button>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-[380px_1fr_380px] gap-4">
          
          {/* Left Column - Camera Image and Map */}
          <div className="space-y-4">
            {/* Camera Image */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop" 
                  alt="Traffic camera view"
                  className="w-full h-[280px] object-cover"
                />
                <div className="absolute top-3 left-3 bg-white px-3 py-1.5 rounded text-xs font-medium">
                  📹 TF-YW-02-05
                </div>
                <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded text-xs">
                  Image จุดติดตั้งกล้อง
                </div>
                <div className="absolute top-3 right-3 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg">
                  ⚠️
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-[280px] overflow-hidden">
                <MapContainer 
                  center={[13.7563, 100.5018]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[13.7563, 100.5018]}>
                    <Popup>TF-YW-02-05</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Middle Column - 2 Rows of Cards */}
          <div className="space-y-4">
            {/* Card 1: Top Statistics Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-[280px] flex items-center">
              <div className="flex items-center justify-between w-full">
                {/* Left side */}
                <div className="flex-1 text-center">
                  <h3 className="text-xs text-gray-500 mb-2">ปริมาณการจราจรทั้งหมด</h3>
                  <div className="text-6xl font-bold text-blue-600 mb-1">{stats.totalRecords}</div>
                  <div className="text-sm text-gray-500">คัน</div>
                </div>

                {/* Divider */}
                <div className="h-32 w-px bg-gray-200 mx-6"></div>

                {/* Right side */}
                <div className="flex-1 space-y-8">
                  <div className="text-center">
                    <h3 className="text-xs text-gray-500 mb-2">ปริมาณการจราจร<br/>ผ่านเขียว</h3>
                    <div className="text-5xl font-bold text-green-600 mb-1">{stats.totalInstallations}</div>
                    <div className="text-sm text-gray-500">คัน</div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xs text-gray-500 mb-2">ปริมาณการจราจร<br/><span className="text-red-600">ฝ่าฝืนสัญญาณไฟ</span></h3>
                    <div className="text-5xl font-bold text-red-600 mb-1">{stats.totalViolations}</div>
                    <div className="text-sm text-gray-500">คัน</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Donut Chart Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 h-[280px] flex items-center justify-center">
              <ReactApexCharts
                options={donutChartOptions}
                series={donutChartSeries}
                type="donut"
                height={250}
              />
            </div>
          </div>

          {/* Right Column - 2 Rows of Cards */}
          <div className="space-y-4">
            {/* Card 3: Top Right Statistics */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-[280px]">
              <div className="flex items-center justify-between h-full">
                {/* Left side */}
                <div className="flex-1 space-y-6">
                  <div className="text-center">
                    <h3 className="text-xs text-gray-500 mb-2 leading-tight">จำนวนยานพาหนะผ่านสัญญาณ<br/>ไฟจราจร รวมทั้งหมด</h3>
                    <div className="text-5xl font-bold text-blue-600 mb-1">{stats.totalPassingGreen}</div>
                    <div className="text-sm text-gray-500">คัน</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-48 w-px bg-gray-200 mx-4"></div>

                {/* Right side */}
                <div className="flex-1 space-y-6">
                  <div className="text-center">
                    <h3 className="text-xs text-gray-500 mb-2 leading-tight">จำนวนยานพาหนะผ่านสัญญาณไฟจราจร<br/>ฝ่าฝืนสัญญาณไฟรวมทั้งหมด</h3>
                    <div className="text-5xl font-bold text-green-600 mb-1">{stats.violationRate}</div>
                    <div className="text-sm text-gray-500">คัน</div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xs text-gray-500 mb-2 leading-tight">จำนวนยานพาหนะผ่านสัญญาณไฟจราจร<br/>ฝ่าฝืนสัญญาณไฟรวมทั้งหมด</h3>
                    <div className="text-5xl font-bold text-red-600 mb-1">{stats.totalViolatingRed}</div>
                    <div className="text-sm text-gray-500">คัน</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Vehicle Types with 2 columns */}
            <div className="bg-white rounded-lg shadow-sm p-5 h-[280px]">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 h-full">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚙</span>
                      <span className="text-xs text-gray-700">รถ SUV</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.suv.count} <span className="text-xs text-gray-500">คัน</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏍️</span>
                      <span className="text-xs text-gray-700">รถจักรยานยนต์</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.motorcycle.count} <span className="text-xs text-gray-500">คัน</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚐</span>
                      <span className="text-xs text-gray-700">รถตู้</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.van.count} <span className="text-xs text-gray-500">คัน</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚚</span>
                      <span className="text-xs text-gray-700">รถบรรทุกขนาดเล็ก</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.pickupSmall.count} <span className="text-xs text-gray-500">คัน</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚛</span>
                      <span className="text-xs text-gray-700">รถบรรทุก</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.truck.count} <span className="text-xs text-gray-500">คัน</span></span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚗</span>
                      <span className="text-xs text-gray-700">รถยนต์ส่วนบุคคล</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.personal.count} <span className="text-xs text-gray-500">คัน</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🛺</span>
                      <span className="text-xs text-gray-700">รถสามล้อเครื่อง</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.tuktuk.count} <span className="text-xs text-gray-500">คัน</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚌</span>
                      <span className="text-xs text-gray-700">รถโดยสาร</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.bus.count} <span className="text-xs text-gray-500">คัน</span></span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚗</span>
                      <span className="text-xs text-gray-700">อื่นๆ</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.pickup.count} <span className="text-xs text-gray-500">คัน</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Chart - Line Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
          <ReactApexCharts
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height={350}
          />
        </div>

      </div>
    </div>
  );
};

export default InstallationPoint;