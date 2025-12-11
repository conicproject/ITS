import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Filter } from "../../../components/ui/Filter";
import { DonutChart } from "../../../components/ui/DonutChart";
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
    vehicleTypes: {
      suv: { count: 5, violations: 0 },
      motorcycle: { count: 189, violations: 133 },
      sedan: { count: 5, violations: 4 },
      van: { count: 1, violations: 4 },
      pickupSmall: { count: 5, violations: 0 },
      truck: { count: 4, violations: 0 },
    }
  };

  // ข้อมูลสำหรับ DonutChart
  const chartData = {
    series: [200, 145], // ข้อมูลกราฟ
    options: {
      chart: {
        type: 'donut',
      },
      labels: ['ปริมาณทั้งหมด', 'ฝ่าฝืนสัญญาณไฟ'],
      colors: ['#10b981', '#ef4444'],
      legend: {
        show: true,
        position: 'bottom'
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

            {/* Map only */}
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

          {/* Middle Column - Statistics with DonutChart */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm text-gray-600 mb-4">ปริมาณการจราจรทั้งหมด</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-1">{stats.totalRecords}</div>
                  <div className="text-xs text-gray-600">คัน</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-1">{stats.totalInstallations}</div>
                  <div className="text-xs text-gray-600">คัน</div>
                </div>
              </div>

              <h3 className="text-sm text-gray-600 mb-4">ปริมาณการจราจร<br/>ฝ่าฝืนสัญญาณไฟ</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-4xl font-bold text-red-600 mb-1">{stats.totalViolations}</div>
                  <div className="text-xs text-gray-600">คัน</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-1">{stats.violationRate}</div>
                  <div className="text-xs text-gray-600">คัน</div>
                </div>
              </div>

              {/* DonutChart Component */}
              <div className="flex justify-center">
                <DonutChart
                  height={300}
                  headerShow={false}
                  btnShow={false}
                  dataChart={chartData}
                />
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>รถ SUV</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>รถ 5AD</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>รถบรรทุก</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Vehicle Types */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-4">
              ข้อมูลยานพาหนะฝ่าฝืนสัญญาณไฟจราจร
              <br />
              ที่จุดติดตั้งทั้งหมด
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.violationRate}</div>
                <div className="text-xs text-gray-600">คัน</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">20</div>
                <div className="text-xs text-gray-600">คัน</div>
              </div>
            </div>

            <h3 className="text-sm font-semibold mb-4">
              ข้อมูลยานพาหนะฝ่าฝืนสัญญาณไฟจราจร
              <br />
              ที่ฝ่าฝืนสัญญาณไฟแยกเข้าอ
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">45</div>
                <div className="text-xs text-gray-600">คัน</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">20</div>
                <div className="text-xs text-gray-600">คัน</div>
              </div>
            </div>

            {/* Vehicle Types Icons */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚙</span>
                  <span>รถ SUV</span>
                </div>
                <span className="font-semibold">{stats.vehicleTypes.suv.count} คัน</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏍️</span>
                  <span>รถจักรยานยนต์</span>
                </div>
                <span className="font-semibold">{stats.vehicleTypes.motorcycle.count} คัน</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚐</span>
                  <span>รถตู้</span>
                </div>
                <span className="font-semibold">{stats.vehicleTypes.van.count} คัน</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚚</span>
                  <span>รถบรรทุกขนาดเล็ก</span>
                </div>
                <span className="font-semibold">{stats.vehicleTypes.pickupSmall.count} คัน</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚛</span>
                  <span>รถบรรทุก</span>
                </div>
                <span className="font-semibold">{stats.vehicleTypes.truck.count} คัน</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚗</span>
                  <span>รถเก๋งที่มีบนท้าย</span>
                </div>
                <span className="font-semibold">{stats.vehicleTypes.sedan.count} คัน</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚌</span>
                  <span>รถโดยสาร</span>
                </div>
                <span className="font-semibold">4 คัน</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚗</span>
                  <span>ยานพาหนะส่วนบุคคล</span>
                </div>
                <span className="font-semibold">133 คัน</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚛</span>
                  <span>ปิคอัพ</span>
                </div>
                <span className="font-semibold">0 คัน</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
          <div className="h-64 flex items-end justify-around gap-2">
            {['SUV', 'รถยนต์ส่วนตัว', 'รถตู้', 'บรรทุก', 'บรรทุกขนาดเล็ก', 'จักรยานยนต์', 'สามล้อเครื่อง', 'รถเก๋ง', 'รถโดยสาร', 'ยนต์', 'อื่นๆ'].map((type, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ 
                    height: `${Math.random() * 80 + 20}%`,
                    opacity: 0.7
                  }}
                ></div>
                <span className="text-xs mt-2 text-gray-600">{type}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstallationPoint;