// src/components/ui/IncidentMap.jsx
import React, { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
  FaMapMarkerAlt, FaExclamationTriangle, FaCarCrash, FaTools, 
  FaWater, FaFlag, FaRoad, FaPlay, FaClock, FaLayerGroup, 
  FaChevronDown, FaChevronUp, FaCheckSquare, FaSquare, FaFireAlt
} from "react-icons/fa";

// --- Imports Icon Components ---
import RelateAccidentIcon from "./Icon_Incident/relate-accident";
import IrregularitieIcon from "./Icon_Incident/irregularitie";
import RoadObstructionIcon from "./Icon_Incident/road-obstruction";
import HazardousIncidentIcon from "./Icon_Incident/hazardous-incident";
import SpecialEventIcon from "./Icon_Incident/special-event";

// --- Helper Functions ---
const createLeafletIcon = (Component, size = 36, variant = 'default') => {
  const iconHtml = renderToStaticMarkup(<Component size={size} variant={variant} />);
  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

const getMarkerIcon = (category, subtype = 'default') => {
  // [FIX] ใช้ category ในการเลือก Icon
  switch (category) {
    case "อุบัติเหตุ": return createLeafletIcon(RelateAccidentIcon, 40, subtype);
    case "รถเสีย": return createLeafletIcon(IrregularitieIcon, 40, subtype);
    case "สิ่งกีดขวาง": return createLeafletIcon(RoadObstructionIcon, 40, subtype);
    case "อันตราย": return createLeafletIcon(HazardousIncidentIcon, 40, subtype);
    case "กิจกรรมพิเศษ": return createLeafletIcon(SpecialEventIcon, 40, subtype);
    case "ก่อสร้าง": return createLeafletIcon(RoadObstructionIcon, 40, 'road'); // ใช้ Icon ถนนสำหรับหมวดก่อสร้าง
    default: return createLeafletIcon(RoadObstructionIcon, 40, 'default');
  }
};

function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (!markers || markers.length === 0) return;
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [markers, map]);
  return null;
}

function MapFilterControl({ filters, toggleFilter }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // รายการตัวกรองต้องตรงกับ Category ที่เราตั้งไว้ใน Dashboard
  const filterItems = [
    { type: "อุบัติเหตุ", icon: FaCarCrash, color: "#EF4444" },
    { type: "รถเสีย", icon: FaTools, color: "#F97316" },
    { type: "สิ่งกีดขวาง", icon: FaExclamationTriangle, color: "#EAB308" },
    { type: "อันตราย", icon: FaFireAlt, color: "#DC2626" },
    { type: "กิจกรรมพิเศษ", icon: FaFlag, color: "#8B5CF6" },
    { type: "ก่อสร้าง", icon: FaRoad, color: "#6B7280" },
  ];

  return (
    <div className="leaflet-bottom leaflet-left" style={{ bottom: "20px", left: "10px", zIndex: 1000 }}>
      <div className="leaflet-control leaflet-bar bg-white rounded-lg shadow-xl border border-gray-200 text-sm overflow-hidden" 
           style={{ minWidth: isExpanded ? "200px" : "auto", maxWidth: "240px" }}>
        <div 
          className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 font-bold text-gray-700">
            <FaLayerGroup className="text-blue-600"/> 
            {isExpanded && <span>ตัวกรอง ({filterItems.filter(i => filters[i.type]).length})</span>}
          </div>
          {isExpanded ? <FaChevronDown className="text-gray-400"/> : <FaChevronUp className="text-gray-400"/>}
        </div>
        {isExpanded && (
          <div className="p-2 bg-white max-h-[250px] overflow-y-auto">
            {filterItems.map((item) => (
              <div 
                key={item.type} 
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${filters[item.type] ? 'hover:bg-blue-50' : 'opacity-50 hover:opacity-80 hover:bg-gray-50'}`}
                onClick={() => toggleFilter(item.type)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm shrink-0" 
                       style={{ backgroundColor: item.color, transform: filters[item.type] ? 'scale(1)' : 'scale(0.8) grayscale(100%)' }}>
                    <item.icon />
                  </div>
                  <span className={`font-medium text-xs md:text-sm ${filters[item.type] ? 'text-gray-700' : 'text-gray-400'}`}>{item.type}</span>
                </div>
                <div className="text-lg">
                  {filters[item.type] ? <FaCheckSquare className="text-blue-500" /> : <FaSquare className="text-gray-300" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Component ---
const IncidentMap = ({ incidents = [], mapCenter = [13.7563, 100.5018], zoom = 12 }) => {
  const [activeFilters, setActiveFilters] = useState({
    "อุบัติเหตุ": true, "รถเสีย": true, "สิ่งกีดขวาง": true, "อันตราย": true, "กิจกรรมพิเศษ": true, "ก่อสร้าง": true
  });

  const toggleFilter = (type) => {
    setActiveFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // [FIX] กรองโดยใช้ item.category แทน item.type
  const filteredIncidents = incidents.filter(i => activeFilters[i.category]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative z-0 flex flex-col h-full w-full">
      <style>{`
        .leaflet-popup-content-wrapper { padding: 0 !important; overflow: hidden; border-radius: 12px; }
        .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .custom-marker-icon { background: transparent; border: none; }
      `}</style>
      
      <MapContainer center={mapCenter} zoom={zoom} className="h-full w-full min-h-[400px]">
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapFilterControl filters={activeFilters} toggleFilter={toggleFilter} />
        <FitBounds markers={filteredIncidents} />
        
        {filteredIncidents.map((i) => (
          // [FIX] ส่ง category ไปให้ getMarkerIcon
          <Marker key={i.id} position={[i.lat, i.lng]} icon={getMarkerIcon(i.category, i.subtype)}>
            <Popup>
              <div className="font-sans text-gray-800 min-w-[280px] max-w-[320px]">
                <div className="bg-slate-900 h-32 relative flex items-center justify-center overflow-hidden">
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase z-10 ${
                      i.displayStatus === 'New' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {i.displayStatus || i.status}
                  </div>
                  {/* แสดง Icon ใน Popup ตาม Category */}
                  <div className="text-white text-4xl opacity-80">
                      {i.category === 'อุบัติเหตุ' ? <FaCarCrash/> : i.category === 'รถเสีย' ? <FaTools/> : <FaExclamationTriangle/>}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-white">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm truncate">{i.type}</span> 
                      {i.subtype && <span className="text-[10px] bg-white/20 px-1 rounded w-fit mt-1">{i.subtype}</span>}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <div className="flex items-start gap-2 mb-2 text-gray-700">
                    <FaMapMarkerAlt className="mt-1 text-red-500 flex-shrink-0" />
                    <span className="font-semibold text-sm line-clamp-2">{i.location}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 pl-4 border-l-2 border-gray-300 line-clamp-3">{i.detail}</p>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 border-t pt-2">
                    <div className="flex items-center gap-1"><FaClock /> {i.datetime}</div>
                    <span className={`px-2 py-0.5 rounded-full text-white ${i.severity === 'Severe' ? 'bg-red-500' : 'bg-yellow-500'}`}>{i.severity}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IncidentMap;