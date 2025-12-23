// frontend/src/components/IncidentMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaSearch } from "react-icons/fa";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

function IncidentMap({ incidentMarkers = [], mapCenter = [13.7563, 100.5018] }) {
  // Safety check - ป้องกัน undefined
  const markers = Array.isArray(incidentMarkers) ? incidentMarkers : [];
  
  return (
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
          {markers.map((marker) => (
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
  );
}

export default IncidentMap;