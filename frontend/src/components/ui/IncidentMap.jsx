// src/components/ui/IncidentMap.jsx
import React, { useState, useEffect, useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
  FaMapMarkerAlt, FaExclamationTriangle, FaCarCrash, FaTools, 
  FaClock, FaFireAlt, FaFlag, FaRoad
} from "react-icons/fa";

import RelateAccidentIcon from "./Icon_Incident/relate-accident";
import IrregularitieIcon from "./Icon_Incident/irregularitie";
import RoadObstructionIcon from "./Icon_Incident/road-obstruction";
import HazardousIncidentIcon from "./Icon_Incident/hazardous-incident";
import SpecialEventIcon from "./Icon_Incident/special-event";
import MapFilterControl from "./MapFilterControl";

// --- Configuration: รายการตัวกรองทั้งหมดที่มีในระบบ ---
const MASTER_FILTER_CONFIG = [
  { type: "อุบัติเหตุ", icon: FaCarCrash, color: "#EF4444" },
  { type: "รถเสีย", icon: FaTools, color: "#F97316" },
  { type: "สิ่งกีดขวาง", icon: FaExclamationTriangle, color: "#EAB308" },
  { type: "อันตราย", icon: FaFireAlt, color: "#DC2626" },
  { type: "กิจกรรมพิเศษ", icon: FaFlag, color: "#8B5CF6" },
  { type: "ก่อสร้าง", icon: FaRoad, color: "#6B7280" },
];

const createLeafletIcon = (Component, size = 36, variant = 'default') => {
  const iconHtml = renderToStaticMarkup(<Component size={size} variant={variant} />);
  return L.divIcon({
    html: iconHtml, className: 'custom-marker-icon', iconSize: [size, size], iconAnchor: [size / 2, size], popupAnchor: [0, -size]
  });
};

const getMarkerIcon = (category, subtype = 'default') => {
  switch (category) {
    case "อุบัติเหตุ": return createLeafletIcon(RelateAccidentIcon, 40, subtype);
    case "รถเสีย": return createLeafletIcon(IrregularitieIcon, 40, subtype);
    case "สิ่งกีดขวาง": return createLeafletIcon(RoadObstructionIcon, 40, subtype);
    case "อันตราย": return createLeafletIcon(HazardousIncidentIcon, 40, subtype);
    case "กิจกรรมพิเศษ": return createLeafletIcon(SpecialEventIcon, 40, subtype);
    case "ก่อสร้าง": return createLeafletIcon(RoadObstructionIcon, 40, 'road');
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

// --- Main Component ---
const IncidentMap = ({ incidents = [], mapCenter = [13.7563, 100.5018], zoom = 12, allowedCategories = null }) => {
  
  // 1. คำนวณว่าหน้าปัจจุบันควรแสดงตัวกรองอะไรบ้าง
  const currentFilters = useMemo(() => {
    if (!allowedCategories) return MASTER_FILTER_CONFIG; // ถ้าไม่ส่งมา (เช่น Dashboard) ให้โชว์หมด
    return MASTER_FILTER_CONFIG.filter(f => allowedCategories.includes(f.type));
  }, [allowedCategories]);

  // 2. State สำหรับเปิด/ปิดตัวกรอง
  const [activeFilters, setActiveFilters] = useState(() => {
    const initialState = {};
    // เปิด default เป็น true เฉพาะตัวที่มีใน currentFilters
    currentFilters.forEach(f => initialState[f.type] = true);
    return initialState;
  });

  const toggleFilter = (type) => {
    setActiveFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

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
        
        {/* ส่ง currentFilters ที่คำนวณแล้วไปให้ Control แสดงผล */}
        <MapFilterControl filterItems={currentFilters} filters={activeFilters} toggleFilter={toggleFilter} />
        
        <FitBounds markers={filteredIncidents} />
        
        {filteredIncidents.map((i) => (
          <Marker key={i.id} position={[i.lat, i.lng]} icon={getMarkerIcon(i.category, i.subtype)}>
            <Popup>
              {/* (Popup Content Code เหมือนเดิม) */}
              <div className="font-sans text-gray-800 min-w-[280px] max-w-[320px]">
                <div className="bg-slate-900 h-32 relative flex items-center justify-center overflow-hidden">
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase z-10 ${
                      i.displayStatus === 'New' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {i.displayStatus || i.status}
                  </div>
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