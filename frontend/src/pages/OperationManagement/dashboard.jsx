import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { FaCamera, FaMapMarkerAlt, FaDirections, FaClock, FaAmbulance, FaMapPin, FaPlay, FaCar, FaExclamationTriangle } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

function OperationManagementDashboard() {
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Mock data
  const stats = [
    { label: 'ทั้งหมด', value: '12 ครั้อง', sublabel: 'วันนี้ทั้งหมด', color: 'bg-blue-500', icon: FaCamera },
    { label: 'คันทางการ', value: '1,820', sublabel: 'คันทางเฉลี่ย', unit: 'คัน/ชม', color: 'bg-green-500', icon: FaCar },
    { label: 'เหตุการณ์', value: '7 ครั้ง', sublabel: 'เหตุการณ์ทั้งหมด', color: 'bg-orange-500', icon: FaMapMarkerAlt },
    { label: 'รายการ', value: '1 รายการ', sublabel: 'รอดำเนินการ', color: 'bg-red-500', icon: FaExclamationTriangle },
  ];

  const alerts = Array(7).fill(null).map((_, i) => ({
    id: i,
    type: 'Ambulance detected',
    camera: `@CAM-001`,
    time: '14:20:39',
    location: 'ถนนพระราม 5 กทม กรุงเทพมหานคร'
  }));

  const trafficData = {
    labels: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
    datasets: [{
      data: [250, 300, 400, 600, 800, 1200, 1400, 1500, 1400, 1300, 1200, 1300, 1400, 1500, 1600, 1800, 1900, 1700, 1400, 1100, 900, 700, 600, 500],
      fill: true,
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      borderColor: 'rgba(147, 51, 234, 0.8)',
      tension: 0.4,
      pointRadius: 0,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: true, grid: { display: false } },
      y: { display: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { stepSize: 250 } }
    }
  };

  const pcuData = [
    { lane: 'เลน 1', label: 'เหนือ', value: 80, status: 'ปกติ', color: 'bg-green-100 text-green-800' },
    { lane: 'เลน 2', label: 'ใต้', value: 75, status: 'ปกติ', color: 'bg-green-100 text-green-800' },
    { lane: 'เลน 3', label: 'ตะวันออก', value: 90, status: 'พอใช้', color: 'bg-yellow-100 text-yellow-800' },
    { lane: 'เลน 4', label: 'ตะวันตก', value: 85, status: 'ปานกลาง', color: 'bg-orange-100 text-orange-800' },
  ];

  return (
    <div className="min-h-screen overflow-y-auto p-6 bg-gray-50 flex flex-col gap-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
            <FaMapPin className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">การจัดการ</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-800">14:20:39</p>
          <p className="text-xs text-gray-500">วันพุธที่ 23 ธันวาคม 2568</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.color} relative overflow-hidden rounded-xl p-5 text-white shadow-lg`}>
            <div className="relative z-10">
              <p className="mb-1 text-sm opacity-90">{stat.label}</p>
              <p className="mb-1 text-3xl font-bold">{stat.value}</p>
              <p className="text-xs opacity-80">{stat.sublabel} {stat.unit}</p>
            </div>
            <stat.icon className="absolute bottom-2 right-2 text-6xl opacity-20" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="space-y-4 lg:col-span-2">
          {/* Alert Banner */}
          <div className="flex items-center gap-4 rounded-lg border-2 border-red-200 bg-red-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500">
              <FaExclamationTriangle className="text-xl text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">เหตุการณ์พิเศษ</span>
                <span className="font-semibold text-red-900">Car VIP detected @1669-VIP-456</span>
              </div>
              <p className="text-sm text-red-700">ตรวจจับรถ VIP เลขทะเบียน กข-คค กรุงเทพมหานคร ครั้งที่ 9 ครั้ง</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-red-900">14:20:39</p>
              <p className="text-xs text-red-700">วันพุธที่ 23 ธันวาคม 2568</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 rounded-lg bg-white p-3 shadow">
            <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600">
              <FaCamera /> Camera
              <span className="rounded bg-blue-700 px-2 py-0.5 text-xs">CAM-001</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FaMapMarkerAlt /> Location
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FaDirections /> Direction
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FaClock /> ETA
              <span className="text-xs">3 นาที</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FaAmbulance /> Ambulance ID
              <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white">ABX-654</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FaMapPin /> Destination
            </button>
          </div>

          {/* Map */}
          <div className="h-96 overflow-hidden rounded-lg bg-white shadow">
            <MapContainer center={[13.756, 100.502]} zoom={12} className="h-full w-full" scrollWheelZoom={false}>
              <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
            </MapContainer>
          </div>

          {/* Real-time Monitoring */}
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="mb-3 flex items-center gap-2">
              <FaClock className="text-purple-600" />
              <h3 className="font-semibold text-gray-800">สัญญาณเรียลไทม์ - Real-time Monitoring</h3>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
              <svg viewBox="0 0 600 400" className="w-full h-full">
                <rect width="600" height="400" fill="#1f2937" />

                {/* Roads */}
                <rect x="0" y="150" width="200" height="100" fill="#374151" />
                <rect x="400" y="150" width="200" height="100" fill="#374151" />
                <rect x="200" y="0" width="200" height="150" fill="#374151" />
                <rect x="200" y="250" width="200" height="150" fill="#374151" />

                {/* Intersection */}
                <rect x="200" y="150" width="200" height="100" fill="#6b7280" />

                {/* Lane Markings Horizontal */}
                {[...Array(8)].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1={i < 4 ? 50 + i * 40 : 420 + (i - 4) * 40}
                    y1="200"
                    x2={i < 4 ? 70 + i * 40 : 440 + (i - 4) * 40}
                    y2="200"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="15,10"
                  />
                ))}

                {/* Lane Markings Vertical */}
                {[...Array(8)].map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1="300"
                    y1={i < 4 ? 30 + i * 30 : 260 + (i - 4) * 35}
                    x2="300"
                    y2={i < 4 ? 50 + i * 30 : 280 + (i - 4) * 35}
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="15,10"
                  />
                ))}

                {/* Crosswalks */}
                {[...Array(10)].map((_, i) => (
                  <g key={`cw-${i}`}>
                    <rect x={210 + i * 18} y="145" width="12" height="5" fill="white" />
                    <rect x={210 + i * 18} y="250" width="12" height="5" fill="white" />
                    <rect x="195" y={160 + i * 18} width="5" height="12" fill="white" />
                    <rect x="400" y={160 + i * 18} width="5" height="12" fill="white" />
                  </g>
                ))}

                {/* Cars */}
                <circle cx="100" cy="180" r="8" fill="#10b981" />
                <circle cx="500" cy="220" r="8" fill="#10b981" />
                <circle cx="270" cy="80" r="8" fill="#10b981" />
                <circle cx="330" cy="320" r="8" fill="#10b981" />
                <circle cx="150" cy="220" r="8" fill="#10b981" />
                <circle cx="450" cy="180" r="8" fill="#10b981" />
              </svg>
            </div>
          </div>

          {/* PCU Stats */}
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">การตรวจสอบ PCU</h3>
              <button className="rounded-lg bg-green-500 px-4 py-1 text-sm text-white hover:bg-green-600">เปิดใช้งาน</button>
            </div>
            <div className="mb-4 flex justify-between text-center">
              <div>
                <p className="text-xs text-gray-500">Domain</p>
                <p className="text-lg font-bold">80 PCU/1u</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Humidity</p>
                <p className="text-lg font-bold">75 PCU/1u</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ช่องตรงที่</p>
                <p className="text-lg font-bold">32 PCU/1u</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {pcuData.map((item, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.lane}</span>
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${item.color}`}>{item.status}</span>
                  </div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-xl font-bold text-gray-800">{item.value} PCU/1u</p>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Chart */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-3 font-semibold text-gray-800">ปริมาณการจราจร (1 วัน)</h3>
            <div className="h-64">
              <Line data={trafficData} options={chartOptions} />
            </div>
          </div>

          {/* Sequence */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-3 font-semibold text-gray-800">Sequence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-200">
                <MapContainer 
                  center={[13.756, 100.502]} 
                  zoom={11} 
                  className="h-full w-full" 
                  zoomControl={false} 
                  dragging={false}
                  scrollWheelZoom={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </MapContainer>
                <button className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black bg-opacity-70 hover:bg-opacity-90">
                  <FaPlay className="text-white" />
                </button>
              </div>
              <div className="rounded-lg bg-gray-900 p-4">
                <div className="flex h-full flex-col justify-center">
                  <div className="rounded-lg bg-white p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <FaCar className="text-green-600" />
                      <span className="text-sm">ทะเบียน : ทท 1234</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCar className="text-blue-600" />
                      <span className="text-sm">ยี่ห้อ / สี : Honda / ดำ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-600" />
                      <span className="text-sm">ประเภทรถ : กระบะ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCamera className="text-purple-600" />
                      <span className="text-sm">กล้อง : CAM-001</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-orange-600" />
                      <span className="text-sm">ความเร็ว : ปกติ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-3 font-semibold text-gray-800">รายการล่าสุด (7 รายการ)</h3>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-gray-600 font-medium">ทท-1234</span>
                    <span className="text-sm text-gray-600">Honda</span>
                    <div className="flex items-center gap-1">
                      <FaCamera className="text-yellow-500" />
                      <span className="text-xs">CAM-001</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-green-600" />
                      <span className="text-xs">สาทร</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock className="text-blue-600" />
                      <span className="text-xs">3 ชั่วโมง</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600">ข้อมูล</button>
                    <button className="rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600">รายละเอียด</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Alerts & Cameras */}
        <div className="space-y-4">
          {/* Recent Alerts */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-3 font-semibold text-gray-800">Recent Alerts</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <div key={alert.id} className="rounded-lg border-l-4 border-red-500 bg-red-50 p-3">
                  <div className="mb-1 flex items-start gap-2">
                    <FaExclamationTriangle className="mt-1 text-red-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900">{alert.type} {alert.camera}</p>
                      <p className="text-xs text-red-700">{alert.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-red-600">Alert ID: 001</span>
                    <span className="text-xs font-medium text-red-900">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Response Workflow */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-3 font-semibold text-gray-800">Emergency Response Workflow</h3>
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-200 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                    <FaCamera className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium">ตรวจจับ CCTV</span>
                </div>
                <button className="w-full rounded bg-gray-800 py-1 text-xs text-white hover:bg-gray-900">เปิดใช้งาน</button>
              </div>

              <div className="rounded-lg border border-gray-200 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                    <FaMapMarkerAlt className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium">ติดตามตำแหน่ง</span>
                </div>
                <button className="w-full rounded bg-gray-800 py-1 text-xs text-white hover:bg-gray-900">เปิดใช้งาน</button>
              </div>

              <div className="rounded-lg border border-gray-200 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                    <FaClock className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">คำนวณ ETA</span>
                </div>
                <button className="w-full rounded bg-red-500 py-1 text-xs text-white hover:bg-red-600">ใช้งาน</button>
              </div>

              <div className="rounded-lg border border-gray-200 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
                    <FaMapPin className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium">Quick Action Panel</span>
                </div>
                <button className="w-full rounded bg-gray-300 py-1 text-xs text-gray-700 hover:bg-gray-400">รอดำเนินการ</button>
              </div>

              <div className="rounded-lg border border-gray-200 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
                    <FaPlay className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium">เล่นย้อนหลัง</span>
                </div>
                <button className="w-full rounded bg-gray-300 py-1 text-xs text-gray-700 hover:bg-gray-400">รอดำเนินการ</button>
              </div>
            </div>
          </div>

          {/* Live Camera Feeds */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-3 font-semibold text-gray-800">Live Camera Feeds</h3>
            <div className="space-y-3">
              {['CAM-804003', 'CAM-804004', 'CAM-804005', 'CAM-804006'].map((cam) => (
                <div key={cam} className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <FaCamera className="mb-2 text-4xl opacity-50" />
                    <p className="text-sm font-medium">{cam}</p>
                    <p className="text-xs opacity-75">ไม่พร้อมใช้งาน</p>
                  </div>
                  <span className="absolute left-2 top-2 rounded bg-green-500 px-2 py-1 text-xs font-bold text-white flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    {cam}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-2">
            <button className="flex w-full items-center justify-between rounded-lg bg-blue-500 p-3 text-white hover:bg-blue-600">
              <span className="text-sm font-medium">ดูแผนที่ทั้งหมด</span>
              <FaMapMarkerAlt />
            </button>
            <button className="flex w-full items-center justify-between rounded-lg bg-purple-500 p-3 text-white hover:bg-purple-600">
              <span className="text-sm font-medium">รายงานสรุป</span>
              <FaPlay />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperationManagementDashboard;