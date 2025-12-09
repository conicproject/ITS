import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { FaExclamationTriangle, FaCar, FaWrench, FaEye, FaVideo, FaDownload, FaSearch } from "react-icons/fa";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different incident types
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

function RoadObstruction() {
  const [selectedSort, setSelectedSort] = useState("ล่าสุด");
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);

  // Bangkok center
  const mapCenter = [13.7563, 100.5018];

  const stats = [
    { label: "ตำรวจตู้ที่แจ้งเข้าหมาย", value: 50, icon: FaExclamationTriangle, color: "text-yellow-500" },
    { label: "ชนรถ (Collision)", value: 20, icon: FaCar, color: "text-red-500" },
    { label: "วางเสีย (Breakdown)", value: 19, icon: FaWrench, color: "text-blue-500" },
    { label: "ชุดกำ (Overturn)", value: 11, icon: FaExclamationTriangle, color: "text-purple-500" },
  ];

  // Incident markers on map
  const incidentMarkers = [
    { id: 1, position: [13.7563, 100.5018], type: "ชนรถ", color: "#ef4444", severity: "Severe" },
    { id: 2, position: [13.7463, 100.5118], type: "วางเสีย", color: "#f59e0b", severity: "Moderate" },
    { id: 3, position: [13.7663, 100.4918], type: "ชนรถ", color: "#ef4444", severity: "Severe" },
    { id: 4, position: [13.7363, 100.5218], type: "วางกำ", color: "#3b82f6", severity: "Minor" },
    { id: 5, position: [13.7763, 100.5318], type: "วางเสีย", color: "#f59e0b", severity: "Moderate" },
    { id: 6, position: [13.7263, 100.4818], type: "ชนรถ", color: "#ef4444", severity: "Severe" },
    { id: 7, position: [13.7863, 100.5118], type: "วางเสีย", color: "#f59e0b", severity: "Minor" },
    { id: 8, position: [13.7463, 100.4718], type: "ชนรถ", color: "#ef4444", severity: "Moderate" },
  ];

  const incidents = [
    {
      id: "#1001",
      type: "ชนรถ",
      vehicle: "Bus",
      location: "ถนนพหลโยธิน แขวงจันทรเกษม",
      datetime: "7/10/2568 16:28:59",
      severity: "Severe",
      status: "Verified",
      cctv: true,
    },
    {
      id: "#1024",
      type: "วางเสีย",
      vehicle: "Bicycle",
      location: "ถนนสาธรใต้ แขวงยานนาวา",
      datetime: "26/9/2568 16:28:59",
      severity: "Minor",
      status: "Verified",
      cctv: true,
    },
    {
      id: "#1022",
      type: "วางเสีย",
      vehicle: "Truck",
      location: "ถนนสุขุมวิท แขวงคลองตัน",
      datetime: "22/9/2568 16:28:59",
      severity: "Severe",
      status: "New",
      cctv: true,
    },
    {
      id: "#1021",
      type: "ชนรถ",
      vehicle: "Motorcycle",
      location: "ถนนสาธรใต้ แขวงยานนาวา",
      datetime: "20/9/2568 16:28:59",
      severity: "Minor",
      status: "Verified",
      cctv: true,
    },
    {
      id: "#1027",
      type: "ชนรถ",
      vehicle: "Bicycle",
      location: "ถนนพหลโยธิน แขวงลาดยาว",
      datetime: "19/9/2568 16:28:59",
      severity: "Severe",
      status: "Verified",
      cctv: true,
    },
    {
      id: "#1029",
      type: "วางกำ",
      vehicle: "Car",
      location: "ถนนเพชรบุรี แขวงมักกะสัน",
      datetime: "19/9/2568 16:28:59",
      severity: "Severe",
      status: "New",
      cctv: true,
    },
    {
      id: "#1020",
      type: "ชนรถ",
      vehicle: "Bicycle",
      location: "ถนนพหลโยธิน แขวงลาดยาว",
      datetime: "18/9/2568 16:28:59",
      severity: "Severe",
      status: "New",
      cctv: true,
    },
    {
      id: "#1043",
      type: "วางเสีย",
      vehicle: "Bicycle",
      location: "ถนนสาธรใต้ แขวงยานนาวา",
      datetime: "12/9/2568 16:28:59",
      severity: "Severe",
      status: "Closed",
      cctv: true,
    },
    {
      id: "#1012",
      type: "วางเสีย",
      vehicle: "Motorcycle",
      location: "ถนนพระราม 4 แขวงคลองเตย",
      datetime: "11/9/2568 16:28:59",
      severity: "Moderate",
      status: "Verified",
      cctv: true,
    },
    {
      id: "#1015",
      type: "ชนรถ",
      vehicle: "Motorcycle",
      location: "ถนนพหลโยธิน แขวงลาดยาว",
      datetime: "11/9/2568 16:28:59",
      severity: "Moderate",
      status: "Closed",
      cctv: true,
    },
  ];

  const hotspots = [
    {
      rank: 1,
      name: "แยกร็อกทอง-ร่มเกล้า",
      location: "สี่แยกร็อกทอง-ร่มเกล้า",
      time: "แหล่งอุบัติเหตุต่อเนื่อง",
      incidents: "ประมวลคำเข้อมูล: 12 เคส",
      updated: "ปรับปรุงล่าสุด: 2025-01-16 16:29:25",
      icon: "🚗",
    },
    {
      rank: 2,
      name: "สะพานพระราม 6",
      location: "สะพานพระราม 6-ท่าพระ",
      time: "แหล่งอุบัติเหตุต่อเนื่อง",
      incidents: "ประมวลคำเข้อมูล: 11 เคส",
      updated: "ปรับปรุงล่าสุด: 2025-01-15 14:58:02",
      icon: "🚗",
    },
    {
      rank: 3,
      name: "แยกอโศก-สุขุมวิท",
      location: "สี่แยกอโศก-สุขุมวิท",
      time: "แหล่งอุบัติเหตุต่อเนื่อง",
      incidents: "ประมวลคำเข้อมูล: 9 เคส",
      updated: "ปรับปรุงล่าสุด: 2025-01-14 13:48:20",
      icon: "🚗",
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Severe":
        return "bg-red-100 text-red-700";
      case "Moderate":
        return "bg-yellow-100 text-yellow-700";
      case "Minor":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Verified":
        return "bg-yellow-400 text-gray-900";
      case "New":
        return "bg-blue-400 text-white";
      case "Closed":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 text-white p-2 rounded-lg">
              <FaExclamationTriangle size={24} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">ระบบบันทึกและแสดงข้อมูลอุบัติเหตุ</h1>
              <p className="text-sm text-gray-500">Vehicle Incident Data Workflow</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              <FaDownload size={16} />
              Export Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">
              + แจ้งเหตุอุบัติเหตุ
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">{stat.label}</div>
                <Icon className={stat.color} size={20} />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Map Section */}
        <div className="col-span-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">แผนที่สถานที่ - กรุงเทพฯ</span>
              </div>
              <div className="text-xs text-gray-400">อัพเดตล่าสุด: 15:45:49</div>
            </div>
            <div className="relative" style={{ height: 'calc(100% - 57px)' }}>
              {/* Leaflet Map */}
              <MapContainer 
                center={mapCenter} 
                zoom={12} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Incident Markers */}
                {incidentMarkers.map((marker) => (
                  <Marker 
                    key={marker.id} 
                    position={marker.position}
                    icon={createCustomIcon(marker.color)}
                  >
                    <Popup>
                      <div className="text-sm">
                        <div className="font-semibold">{marker.type}</div>
                        <div className="text-xs text-gray-600">ระดับ: {marker.severity}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              
              {/* Search box overlay */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 w-80 z-[1000]">
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
                  <FaSearch className="text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="ค้นหาสถานที่หรือเหตุการณ์..."
                    className="w-full text-sm outline-none"
                  />
                </div>
              </div>

              {/* Legend overlay */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
                <div className="text-xs font-semibold mb-2">ประเภทอุบัติเหตุ</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>ชนรถ</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>วางเสีย</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>ชุดกำ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hotspots Section */}
        <div className="col-span-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">ชุดที่เกิดอุบัติเหตุบ่อย (Hotspots)</h3>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1">
              {hotspots.map((spot) => (
                <div key={spot.rank} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{spot.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">#{spot.rank} {spot.name}</div>
                          <div className="text-xs text-gray-500">{spot.location}</div>
                        </div>
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {spot.rank}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{spot.time}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{spot.incidents}</span>
                        {spot.updated && (
                          <span className="text-orange-600">{spot.updated}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                    <FaEye size={12} />
                    ชมตัวอย่าง
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex gap-2">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>ล่าสุด</option>
              <option>เก่าสุด</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>ทั้งหมด</option>
              <option>Verified</option>
              <option>New</option>
              <option>Closed</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">แสดง 50 รายการ</div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">รหัส</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">ประเภทเหตุการณ์</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">ประเภทรถ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">สถานที่</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">วัน/เวลา</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">ระดับ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">สถานะ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">แหล่งที่มา</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{incident.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{incident.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{incident.vehicle}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{incident.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{incident.datetime}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {incident.cctv && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-700">CCTV</span>
                        <FaVideo size={14} className="text-red-500" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">แสดง 1 จาก 5,100 รายการทั้งหมด</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">2</button>
            <span className="px-2">...</span>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">5</button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoadObstruction;