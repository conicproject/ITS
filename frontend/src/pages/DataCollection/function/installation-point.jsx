import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Filter } from "../../../components/ui/Filter";
import { DonutChart } from "../../../components/ui/DonutChart";
import ReactApexChart from 'react-apexcharts';
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
    totalPassingIntersection: 45,
    totalViolatingIntersection: 20,
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

  // ข้อมูลสำหรับ DonutChart
  const chartData = {
    series: [200, 145],
    options: {
      chart: {
        type: 'donut',
      },
      labels: ['ปริมาณทั้งหมด', 'ฝ่าฝืนสัญญาณไฟ'],
      colors: ['#10b981', '#ef4444'],
      legend: {
        show: true,
        position: 'right'
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
                show: true
              },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 'bold'
              },
              total: {
                show: true,
                label: 'รวม',
                fontSize: '16px',
                formatter: () => stats.totalRecords
              }
            }
          }
        }
      }
    }
  };

  // ข้อมูลสำหรับ Line Chart (กราฟเส้นด้านล่าง)
  const vehicleCategories = ['SUV', 'จักรยานยนต์', 'รถตู้', 'บรรทุก', 'บรรทุกขนาดเล็ก', 'รถเก๋งบนท้าย', 'สามล้อเครื่อง', 'ส่วนบุคคล', 'รถโดยสาร', 'ยนต์', 'อื่นๆ'];
  
  const lineChartData = {
    series: [
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
        name: 'ต้นป้องกันมือสัมผัสในพื้นที่',
        data: [2000, 5000, 2500, 3000, 2000, 1500, 2500, 2000, 3000, 2500, 1000]
      },
      {
        name: 'จองตรมไปตรงข้ามทาง',
        data: [1500, 4000, 2000, 2500, 1800, 1200, 2000, 1500, 2500, 2000, 800]
      },
      {
        name: 'รถมีร่างป้ายทะเบียนที่',
        data: [1000, 3000, 1500, 2000, 1500, 1000, 1800, 1200, 2000, 1500, 700]
      },
      {
        name: 'มีปัญหาป้ายทะเบียน',
        data: [800, 2500, 1200, 1800, 1300, 900, 1500, 1000, 1800, 1300, 600]
      },
      {
        name: 'รถบรรทุกเอามีงานพิเศษทำหนักบิด',
        data: [500, 2000, 1000, 1500, 1000, 700, 1200, 800, 1500, 1000, 500]
      },
      {
        name: 'ล่วงหน้าพื้นที่คุมบริเวณ',
        data: [300, 1500, 800, 1200, 800, 500, 1000, 600, 1200, 800, 400]
      },
      {
        name: 'อื่นๆ',
        data: [200, 1000, 600, 900, 600, 400, 800, 500, 900, 600, 300]
      }
    ],
    options: {
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
    }
  };

  const handleSearch = (params) => {
    console.log("INSTALLATION SEARCH:", params);
  };

  return (
    <div className="fix-function-page-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        
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
        <Filter type="installation" onSearch={handleSearch} />

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
        <div className="grid grid-cols-3 gap-4">
          
          {/* Left Column - Camera Image and Map */}
          <div className="space-y-4">
            {/* Camera Image */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop" 
                  alt="Traffic camera view"
                  className="w-full h-64 object-cover rounded"
                />
                <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs">
                  📹 TF-YW-02-05
                </div>
                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs">
                  Image จุดติดตั้งกล้อง
                </div>
                <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  ⚠️
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="h-64 rounded border border-gray-200 overflow-hidden">
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
              <div className="mt-2 text-sm text-gray-600 flex items-center">
                <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                ตำแหน่งกล้อง: TF-YW-02-05
              </div>
            </div>
          </div>

          {/* Middle Column - 2 Rows of Cards */}
          <div className="space-y-4">
            {/* Card 1: Top Statistics Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                {/* Left side */}
                <div className="flex-1">
                  <h3 className="text-sm text-gray-600 mb-3">ปริมาณการจราจรทั้งหมด</h3>
                  <div className="mb-8">
                    <div className="text-7xl font-bold text-blue-600">{stats.totalRecords}</div>
                    <div className="text-base text-gray-600 mt-1">คัน</div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex-1 text-right">
                  <h3 className="text-sm text-gray-600 mb-3">ปริมาณการจราจร<br/>ผ่านเขียว</h3>
                  <div className="mb-8">
                    <div className="text-7xl font-bold text-green-600">{stats.totalInstallations}</div>
                    <div className="text-base text-gray-600 mt-1">คัน</div>
                  </div>
                  
                  <h3 className="text-sm text-gray-600 mb-3 mt-4">ปริมาณการจราจร<br/><span className="text-red-600">ฝ่าฝืนสัญญาณไฟ</span></h3>
                  <div>
                    <div className="text-7xl font-bold text-red-600">{stats.totalViolations}</div>
                    <div className="text-base text-gray-600 mt-1">คัน</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Donut Chart Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <DonutChart
                height={300}
                headerShow={false}
                btnShow={false}
                dataChart={chartData}
              />
            </div>
          </div>

          {/* Right Column - 2 Rows of Cards */}
          <div className="space-y-4">
            {/* Card 3: Top Right Statistics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                {/* Left side */}
                <div className="flex-1">
                  <h3 className="text-sm text-gray-600 mb-3">จำนวนยานพาหนะผ่าสัญญาณ<br/>ไฟจราจร รวมทั้งหมด</h3>
                  <div className="mb-8">
                    <div className="text-7xl font-bold text-blue-600">{stats.totalPassingGreen}</div>
                    <div className="text-base text-gray-600 mt-1">คัน</div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex-1 text-right">
                  <h3 className="text-sm text-gray-600 mb-3">จำนวนยานพาหนะผ่าสัญญาณไฟจราจร<br/>ฝ่าฝืนสัญญาณไฟรวมทั้งหมด</h3>
                  <div className="mb-8">
                    <div className="text-7xl font-bold text-green-600">{stats.violationRate}</div>
                    <div className="text-base text-gray-600 mt-1">คัน</div>
                  </div>
                  
                  <h3 className="text-sm text-gray-600 mb-3 mt-4">จำนวนยานพาหนะผ่าสัญญาณไฟจราจร<br/>ฝ่าฝืนสัญญาณไฟรวมทั้งหมด</h3>
                  <div>
                    <div className="text-7xl font-bold text-red-600">{stats.totalViolatingRed}</div>
                    <div className="text-base text-gray-600 mt-1">คัน</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Vehicle Types with 2 columns */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🚙</span>
                      <span className="text-sm">รถ SUV</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.suv.count} คัน</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏍️</span>
                      <span className="text-sm">รถจักรยานยนต์</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.motorcycle.count} คัน</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🚐</span>
                      <span className="text-sm">รถตู้</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.van.count} คัน</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🚚</span>
                      <span className="text-sm">รถบรรทุกขนาดเล็ก</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.pickupSmall.count} คัน</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🚛</span>
                      <span className="text-sm">รถบรรทุก</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.truck.count} คัน</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🚗</span>
                      <span className="text-sm">รถยนต์ส่วนบุคคล</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.personal.count} คัน</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🛺</span>
                      <span className="text-sm">รถสามล้อเครื่อง</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.tuktuk.count} คัน</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🚌</span>
                      <span className="text-sm">รถโดยสาร</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.bus.count} คัน</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🚗</span>
                      <span className="text-sm">อื่นๆ</span>
                    </div>
                    <span className="font-semibold text-blue-600 text-sm">{stats.vehicleTypes.pickup.count} คัน</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Chart - Line Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
          <ReactApexChart
            options={lineChartData.options}
            series={lineChartData.series}
            type="line"
            height={350}
          />
        </div>

      </div>
    </div>
  );
};

export default InstallationPoint;