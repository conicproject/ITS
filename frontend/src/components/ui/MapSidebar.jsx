// frontend/src/components/ui/MapSidebar.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Component ส่วนด้านข้างแสดงแผนที่และข้อมูล
 * @param {string} cameraId - รหัสกล้อง
 * @param {Array} position - [latitude, longitude] ตำแหน่งกล้อง
 * @param {Object} stats - สถิติต่างๆ
 */
export const MapSidebar = ({ 
  cameraId = "1xn-2345", 
  position = [13.7563, 100.5018], // Default: Bangkok
  stats = {
    totalDays: 3,
    hasViolation: true,
    violations: []
  }
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-medium mb-3">รายละเอียดยานพาหนะ</h3>
      
      {/* แผนที่ Leaflet */}
      <div className="mb-4">
        <div className="relative rounded border border-gray-200 overflow-hidden" style={{ height: '250px' }}>
          <MapContainer 
            center={position} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                กล้อง: {cameraId}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="mt-2 text-sm text-gray-600 flex items-center">
          <FaMapMarkerAlt className="w-4 h-4 mr-1" />
          ตำแหน่งกล้อง: {cameraId}
        </div>
      </div>

      {/* ภาพกล้อง */}
      <div className="bg-black rounded mb-4 flex items-center justify-center" style={{ height: '200px' }}>
        <div className="text-white text-sm">
          {cameraId}
        </div>
      </div>

      <button className="w-full bg-white border border-gray-300 rounded py-2 text-sm hover:bg-gray-50 transition-colors">
        Image Cap
      </button>

      {/* สถิติ */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalDays}</div>
          <div className="text-xs text-gray-600">วันทั้งหมด</div>
        </div>
        <div>
          {stats.hasViolation ? (
            <div className="text-sm px-2 py-1 bg-red-100 text-red-600 rounded">
              มีการละเมิด
            </div>
          ) : (
            <div className="text-sm px-2 py-1 bg-green-100 text-green-600 rounded">
              ไม่มีการละเมิด
            </div>
          )}
        </div>
        <div className="text-xs text-gray-600">
          ข้อมูลเพิ่มเติม
        </div>
      </div>

      {/* ข้อมูลการละเมิด */}
      {stats.hasViolation && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
          <div className="text-sm font-medium text-orange-800">
            มีข้อมูลการละเมิดในระบบ
          </div>
        </div>
      )}

      {/* ตารางข้อมูล */}
      {stats.violations && stats.violations.length > 0 && (
        <div className="mt-4 text-xs space-y-2">
          {stats.violations.map((v, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 text-gray-600">
              <div>{v.camera}</div>
              <div>{v.datetime}</div>
              <div>{v.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
