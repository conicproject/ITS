import React, { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaCar,
  FaBell,
  FaSearch,
  FaMapMarkerAlt,
  FaVideo,
  FaBicycle,
  FaMotorcycle,
  FaBus,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { BarChart } from '../../components/ui/BarChart';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FitBounds({ incidents }) {
  const map = useMap();

  useEffect(() => {
    if (!incidents || incidents.length === 0) return;

    const bounds = L.latLngBounds(
      incidents.map((i) => [i.lat, i.lng])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 20,
    });
  }, [incidents, map]);

  return null;
}

function IncidentAccidentDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const incidents = [
    {
      id: "#1061",
      type: "รถยนต์",
      vehicle: "Bus",
      location: "ถนนพหลโยธิน กรุงเทพมหานคร",
      datetime: "7/10/2568 16:28:59",
      severity: "Severe",
      status: "Verified",
      cctv: true,
      lat: 13.812657,
      lng: 100.717611,
    },
    {
      id: "#1024",
      type: "รถยนต์",
      vehicle: "Bicycle",
      location: "ถนนพระรามที่ 4 กรุงเทพมหานคร",
      datetime: "26/9/2568 16:28:59",
      severity: "Minor",
      status: "In-Process",
      cctv: true,
      lat: 13.813343,
      lng: 100.718194,
    },
    {
      id: "#1042",
      type: "รถยนต์",
      vehicle: "Bus",
      location: "ถนนสุขุมวิท กรุงเทพมหานคร",
      datetime: "20/9/2568 16:28:59",
      severity: "Minor",
      status: "Verified",
      cctv: true,
      lat: 13.812528,
      lng: 100.718307,
    },
    {
      id: "#1021",
      type: "รถยนต์",
      vehicle: "Motorcycle",
      location: "ถนนพระรามที่ 4 กรุงเทพมหานคร",
      datetime: "20/9/2568 16:28:59",
      severity: "Minor",
      status: "Verified",
      cctv: true,
      lat: 13.812129,
      lng: 100.717101,
    },
    {
      id: "#1027",
      type: "รถยนต์",
      vehicle: "Bicycle",
      location: "ถนนพหลโยธิน กรุงเทพมหานคร",
      datetime: "19/9/2568 16:28:59",
      severity: "Severe",
      status: "Verified",
      cctv: true,
      lat: 13.812865,
      lng: 100.717024,
    },

    // ===== random ใกล้ center =====
    {
      id: "#1029",
      type: "รถจักรยาน",
      vehicle: "Car",
      location: "ถนนสาทรใต้ เขตสาทร",
      datetime: "19/9/2568 16:28:59",
      severity: "Severe",
      status: "New",
      cctv: true,
      lat: 13.813120,
      lng: 100.717880,
    },
    {
      id: "#1020",
      type: "รถยนต์",
      vehicle: "Bicycle",
      location: "ถนนพหลโยธิน กรุงเทพมหานคร",
      datetime: "16/9/2568 16:28:59",
      severity: "Minor",
      status: "New",
      cctv: true,
      lat: 13.812300,
      lng: 100.718050,
    },
    {
      id: "#1043",
      type: "รถยนต์",
      vehicle: "Bus",
      location: "ถนนพระรามที่ 4 กรุงเทพมหานคร",
      datetime: "12/9/2568 16:28:59",
      severity: "Severe",
      status: "Closed",
      cctv: true,
      lat: 13.813500,
      lng: 100.716950,
    },
    {
      id: "#1012",
      type: "รถยนต์",
      vehicle: "Motorcycle",
      location: "ถนนพหลโยธิน กรุงเทพมหานคร",
      datetime: "11/9/2568 16:28:59",
      severity: "Moderate",
      status: "Verified",
      cctv: true,
      lat: 13.812050,
      lng: 100.717950,
    },
    {
      id: "#1015",
      type: "รถยนต์",
      vehicle: "Motorcycle",
      location: "ถนนพหลโยธิน กรุงเทพมหานคร",
      datetime: "11/9/2568 16:28:59",
      severity: "Moderate",
      status: "Closed",
      cctv: true,
      lat: 13.813750,
      lng: 100.718300,
    },
  ];


  const totalPages = Math.ceil(incidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIncidents = incidents.slice(startIndex, endIndex);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Severe": return "text-red-500 bg-red-50";
      case "Moderate": return "text-yellow-600 bg-yellow-50";
      case "Minor": return "text-green-600 bg-green-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Verified": return "text-yellow-700 bg-yellow-100";
      case "In-Process": return "text-orange-600 bg-orange-100";
      case "New": return "text-blue-600 bg-blue-100";
      case "Closed": return "text-gray-600 bg-gray-200";
      default: return "text-gray-500 bg-gray-100";
    }
  };
  // ข้อมูลสำหรับ Bar Chart
  const barData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    vehicles: Math.floor(Math.random() * 60) + 10,
    speed: Math.floor(Math.random() * 30) + 40
  }));
  return (
    <div className="fix-function-page-y-auto p-6 bg-white flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500">Vehicle Incident Data</p>
      </div>

      {/* สรุปเหตุการณ์ทั้งหมด */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">สรุปเหตุการณ์ทั้งหมด</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "เหตุการณ์ทั้งหมด", value: 5, color: "text-blue-600", bgColor: "bg-blue-50" },
            { label: "ใหม่ (Active)", value: 2, color: "text-red-500", bgColor: "bg-red-50" },
            { label: "กำลังดำเนินการ", value: 2, color: "text-orange-500", bgColor: "bg-orange-50" },
            { label: "แก้ไขแล้ว", value: 1, color: "text-green-600", bgColor: "bg-green-50" },
          ].map((item, i) => (
            <div key={i} className={`p-6 ${item.bgColor} rounded-lg shadow-sm flex flex-col items-center justify-center`}>
              <p className="text-gray-600 text-sm mb-2">{item.label}</p>
              <p className={`text-4xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ประเภทเหตุการณ์ */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">ประเภทเหตุการณ์</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "อุบัติเหตุ/เฉี่ยวชน", value: 2, icon: <FaCar />, color: "text-purple-600", bgColor: "bg-purple-50" },
            { label: "สิ่งกีดขวาง", value: 2, icon: <FaExclamationTriangle />, color: "text-yellow-600", bgColor: "bg-yellow-50" },
            { label: "กิจกรรมพิเศษ", value: 1, icon: <FaBell />, color: "text-blue-600", bgColor: "bg-blue-50" },
          ].map((item, i) => (
            <div key={i} className={`p-6 ${item.bgColor} rounded-lg shadow-sm flex items-center gap-4`}>
              <div className={`text-3xl ${item.color}`}>{item.icon}</div>
              <div>
                <p className="text-gray-600 text-sm">{item.label}</p>
                <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Warning */}
      <div className="w-full p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
        <div className="bg-red-100 p-2 rounded-full">
          <FaBell className="text-lg text-red-600" />
        </div>
        <div>
          <span className="font-semibold">แจ้งเตือนความหนาแน่นสูง</span>
          <p className="text-sm">ผลการคาดการณ์บริเวณจุดต่าง ๆ 5 รายการ และอัตโนมัติ 1 รายการ ที่ตรวจจับพบว่ามีความหนาแน่นสูงเข้มข้น</p>
        </div>
      </div>

      {/* Map & Hotspots */}
      <div className="grid grid-cols-3 gap-4">
        {/* Map */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm overflow-hidden h-full">
          {/* <div className="bg-gray-800 text-white p-3 flex items-center gap-2">
            <FaMapMarkerAlt />
            <span className="text-sm font-medium">แผนที่จุด - กรุงเทพมหานคร</span>
          </div> */}0

          <div className="h-full">
            <MapContainer
              center={[13.7563, 100.5018]}
              zoom={11}
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* ⭐ auto zoom ตาม incident */}
              <FitBounds incidents={incidents} />

              {incidents.map((i) => (
                <Marker key={i.id} position={[i.lat, i.lng]}>
                  <Popup>
                    <p className="font-semibold">{i.id}</p>
                    <p>{i.location}</p>
                    <p className="text-xs">{i.datetime}</p>
                    <p className="text-xs text-red-500">
                      ระดับ: {i.severity}
                    </p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

          </div>

        </div>

        {/* Hotspots */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">จุดเกิดเหตุบ่อย (Hotspots)</h3>
          {[
            { id: 1, location: "ถนนพหลโยธิน", time: "15 นาทีที่แล้ว", detail: "บริเวณจุดตัดแยกกับถนนพระราม 6", level: "สูง", count: 12 },
            { id: 2, location: "ถนนพระราม 4", time: "จาม", detail: "ช่วงสะพานข้ามคลอง แยกสี่แยกมหานาค", level: "กลาง", count: 10 },
            { id: 3, location: "ถนนสุขุมวิท", time: "11 นาทีที่แล้ว", detail: "ช่วงห้าแยกอโศก - สถานีบีทีเอส อโศก", level: "ปานกลาง", count: 8 },
            { id: 4, location: "ถนนรัชดาภิเษก", time: "จาม", detail: "บริเวณหัวลำโพง ใกล้สถานีรถไฟฟ้า MRT", level: "กลาง", count: 7 },
            { id: 5, location: "ทางด่วนกรุงเทพ", time: "11 นาทีที่แล้ว", detail: "ช่วงบางนา-อาจณรงค์ ช่วงเข้าออกที่ 2", level: "สูง", count: 9 },
          ].map((spot) => (
            <div key={spot.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-800">#{spot.id} {spot.location}</p>
                  <p className="text-xs text-gray-500">{spot.time}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${spot.level === 'สูง' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                  {spot.count}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{spot.detail}</p>
              <div className="flex items-center gap-2">
                <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">รายละเอียด</button>
                <span className="text-xs text-gray-500">อัปเดต: 2021-03-18 13:30:20</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24h Graph */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">แนวโน้มเหตุการณ์ (24 ชั่วโมง)</h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-600">เหตุการณ์ที่เกิดขึ้น</span>
              <span className="font-semibold text-red-500">59 รายการ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600">แก้ไขแล้ว</span>
              <span className="font-semibold text-green-600">43 รายการ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">อัตราความสำเร็จ</span>
              <span className="font-semibold text-blue-600">73%</span>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <BarChart 
            data={barData}
            height={300}
            title="📊 ปริมาณรถตามเวลา"
            showTitle={true}
            colors={['#8B5CF6', '#EF4444']}
          />
        </div>
      </div>

      {/* Traffic Speed */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">สภาพการจราจร</h3>
        <div className="space-y-4">
          {[
            { road: "ทางหลวง 1", speed: 25, maxSpeed: 80, color: "bg-red-500", label: "ติดขัด" },
            { road: "ทางด่วนพิเศษ", speed: 65, maxSpeed: 100, color: "bg-yellow-500", label: "ปานกลาง" },
            { road: "ถนนพระราม 4", speed: 20, maxSpeed: 60, color: "bg-red-600", label: "ติดขัดมาก" },
            { road: "ถนนรัชดาภิเษก", speed: 55, maxSpeed: 80, color: "bg-green-500", label: "คล่องตัว" },
            { road: "ทางหลวง 9", speed: 70, maxSpeed: 90, color: "bg-green-600", label: "คล่องตัวดี" },
          ].map((r, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">{r.road}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{r.speed} กม./ชม.</span>
                  <span className={`text-xs px-2 py-1 rounded ${r.speed < 30 ? 'bg-red-100 text-red-700' : r.speed < 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {r.label}
                  </span>
                  <span className="text-xs text-gray-500">เฉลี่ย {r.maxSpeed} กม./ชม.</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${r.color} rounded-full transition-all`} style={{ width: `${(r.speed / r.maxSpeed) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Incidents Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">เหตุการณ์ล่าสุด</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <FaSearch className="text-gray-400" />
              <input className="bg-transparent outline-none text-sm w-48" placeholder="ค้นหารายการเหตุการณ์นี้..." />
            </div>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none">
              <option>ทั้งหมด</option>
            </select>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none">
              <option>ทั้งหมด</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">แสดง 30 รายการ</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600 text-left">
                <th className="py-3 px-2 font-medium">รหัส</th>
                <th className="py-3 px-2 font-medium">ประเภทยาน</th>
                <th className="py-3 px-2 font-medium">ประเภทเหตุ</th>
                <th className="py-3 px-2 font-medium">ตำแหน่ง</th>
                <th className="py-3 px-2 font-medium">วันที่-เวลา</th>
                <th className="py-3 px-2 font-medium">ระดับ</th>
                <th className="py-3 px-2 font-medium">สถานะ</th>
                <th className="py-3 px-2 font-medium">กล้อง</th>
                <th className="py-3 px-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {currentIncidents.map((incident, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium text-gray-800">{incident.id}</td>
                  <td className="py-3 px-2 text-gray-700">{incident.type}</td>
                  <td className="py-3 px-2 text-gray-700">{incident.vehicle}</td>
                  <td className="py-3 px-2 text-gray-600">{incident.location}</td>
                  <td className="py-3 px-2 text-gray-600">{incident.datetime}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-1 text-red-500">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs">CCTV</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <span className="text-gray-600">หน้า 1 จาก 5 (500 รายการทั้งหมด)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              <FaChevronLeft className="text-xs" />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <span className="px-2">...</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentAccidentDashboard;