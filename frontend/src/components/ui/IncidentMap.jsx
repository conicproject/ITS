// src/components/ui/IncidentMap.jsx
import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { renderToString } from "react-dom/server"; 
import "leaflet/dist/leaflet.css";

// --- Import Icon Components ---
import HazardousIncidentIcon from "./Icon_Incident/hazardous-incident";
import IrregularitieIcon from "./Icon_Incident/irregularitie";
import RelateAccidentIcon from "./Icon_Incident/relate-accident";
import RoadObstructionIcon from "./Icon_Incident/road-obstruction";
import SpecialEventIcon from "./Icon_Incident/special-event";

// --- Import Popup Component ---
import IncidentPopup from "./IncidentPopup";

const createLeafletIcon = (Component, size) => {
  return L.divIcon({
    html: renderToString(Component),
    className: "custom-leaflet-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
};

const getIncidentIcon = (incident) => {
  const size = 35;
  const { type, subtype } = incident;

  if (["อุบัติเหตุ", "รถชน", "Accident"].includes(type)) {
    return createLeafletIcon(<RelateAccidentIcon variant={subtype || "crash"} size={size} />, size);
  } 
  if (["สิ่งกีดขวาง", "ของตกหล่น", "Obstruction"].includes(type)) {
    return createLeafletIcon(<RoadObstructionIcon variant={subtype || "debris"} size={size} />, size);
  }
  if (["อันตรายพิเศษ", "เหตุอันตราย", "ไฟไหม้", "อันตราย", "Hazard"].includes(type)) {
    return createLeafletIcon(<HazardousIncidentIcon variant={subtype || type} size={size} />, size);
  }
  if (["ความผิดปกติ", "ก่อสร้าง", "รถเสีย", "งานจราจร"].includes(type)) {
    return createLeafletIcon(<IrregularitieIcon variant={subtype || "road_work"} size={size} />, size);
  }
  if (["กิจกรรมพิเศษ", "เหตุการณ์พิเศษ", "Special Event"].includes(type)) {
    return createLeafletIcon(<SpecialEventIcon variant={subtype || "event"} size={size} />, size);
  }

  return L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
};

// --- ปรับปรุง Filter Hierarchy ---
const FILTER_HIERARCHY = [
  { 
    id: "accident", label: "อุบัติเหตุ", keywords: ["อุบัติเหตุ", "รถชน", "Accident"], color: "text-red-600",
    subtypes: [
      { id: "crash", label: "รถชน" },
      { id: "rollover", label: "พลิกคว่ำ" },
      { id: "breakdown", label: "รถเสีย" }
    ]
  },
  { 
    id: "obstruction", label: "สิ่งกีดขวาง", keywords: ["สิ่งกีดขวาง", "ของตกหล่น", "Obstruction"], color: "text-orange-600",
    subtypes: [
      { id: "debris", label: "ของตกหล่น" },
      { id: "natural", label: "ภัยธรรมชาติ" },
      { id: "collapse", label: "ทรุดตัว/แนวก่อสร้าง" }
    ]
  },
  { 
    id: "hazard", label: "อันตรายพิเศษ", keywords: ["อันตรายพิเศษ", "เหตุอันตราย", "ไฟไหม้", "อันตราย", "Hazard"], color: "text-yellow-600",
    subtypes: [
      { id: "fire", label: "ไฟไหม้" },
      { id: "chemical", label: "สารเคมีรั่วไหล" },
      { id: "smoke", label: "กลุ่มควัน" }
    ]
  },
  { 
    id: "irregularity", label: "ก่อสร้าง/จราจร/รถเสีย", keywords: ["ความผิดปกติ", "ก่อสร้าง", "รถเสีย", "งานจราจร"], color: "text-blue-600",
    subtypes: [
      { id: "road_work", label: "งานซ่อมแซม" },
      { id: "traffic_light", label: "สัญญาณไฟขัดข้อง" },
      { id: "breakdown", label: "รถจอดเสีย" } 
    ]
  },
  { 
    id: "special", label: "กิจกรรมพิเศษ", keywords: ["กิจกรรมพิเศษ", "เหตุการณ์พิเศษ", "Special Event"], color: "text-purple-600",
    subtypes: [
      { id: "festival", label: "เทศกาล" },
      { id: "marathon", label: "มาราธอน" },
      { id: "concert", label: "คอนเสิร์ต" },
      { id: "protest", label: "การชุมนุม" },
      { id: "event", label: "กิจกรรมทั่วไป" }
    ]
  }
];

function IncidentMap({ 
  incidents = [], 
  markers = [], 
  incidentMarkers = [], 
  mapCenter = [13.756, 100.501], 
  zoom = 12 
}) {
  
  const combinedData = useMemo(() => {
    return [...incidents, ...markers, ...incidentMarkers];
  }, [incidents, markers, incidentMarkers]);

  // --- State สำหรับเก็บสถานะเปิด/ปิด ของ Filter ---
  // รูปแบบ: { "accident": true, "accident_crash": true, ... }
  const [activeFilters, setActiveFilters] = useState(() => {
    const initial = {};
    FILTER_HIERARCHY.forEach(group => {
      initial[group.id] = true;
      group.subtypes.forEach(sub => {
        initial[`${group.id}_${sub.id}`] = true;
      });
    });
    return initial;
  });

  // --- State สำหรับเก็บสถานะย่อ/ขยาย ของแต่ละกลุ่ม ---
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleExpand = (groupId) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleToggleParent = (groupId) => {
    setActiveFilters(prev => {
      const newState = { ...prev };
      const willBeActive = !prev[groupId]; // สลับสถานะปัจจุบัน
      newState[groupId] = willBeActive;
      
      // อัปเดตลูกๆ ทั้งหมดให้เป็นสถานะเดียวกับแม่
      const group = FILTER_HIERARCHY.find(g => g.id === groupId);
      if (group && group.subtypes) {
        group.subtypes.forEach(sub => {
          newState[`${groupId}_${sub.id}`] = willBeActive;
        });
      }
      return newState;
    });
  };

  const handleToggleChild = (groupId, subtypeId) => {
    setActiveFilters(prev => {
      const newState = { ...prev };
      const childKey = `${groupId}_${subtypeId}`;
      newState[childKey] = !prev[childKey];

      // ถ้าลูกตัวไหนตัวหนึ่งถูกเปิด ให้แม่เปิดด้วย (เพื่อไม่ให้หมวดหมู่หลักหายไป)
      // แต่ถ้าลูกโดนปิดหมด แม่จะถูกปิดตาม
      const group = FILTER_HIERARCHY.find(g => g.id === groupId);
      const anyChildActive = group.subtypes.some(sub => newState[`${groupId}_${sub.id}`]);
      newState[groupId] = anyChildActive;

      return newState;
    });
  };

  // --- Logic กรองข้อมูล 2 ชั้น ---
  const filteredIncidents = useMemo(() => {
    return combinedData.filter((incident) => {
      const group = FILTER_HIERARCHY.find(g => g.keywords.includes(incident.type));
      if (!group) return true; // ถ้าไม่อยู่ในกลุ่มไหนเลย ให้แสดงไว้ก่อน
      
      // 1. เช็คว่า Parent ถูกเปิดอยู่ไหม
      if (!activeFilters[group.id]) return false;

      // 2. เช็ค Subtype (ถ้าข้อมูลนั้นมีส่ง Subtype มา)
      if (incident.subtype) {
        const childKey = `${group.id}_${incident.subtype}`;
        // ถ้า Filter มีตัวเลือกของ Subtype นี้ ให้เช็คสถานะ
        if (activeFilters[childKey] !== undefined) {
          return activeFilters[childKey];
        }
      }
      
      return true; // ถ้าไม่มี subtype ให้ผ่านไปแสดงผลได้เลย (อิงตาม Parent)
    });
  }, [combinedData, activeFilters]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full w-full min-h-[500px] overflow-hidden relative z-0">
      
      {/* --- Filter Box --- */}
      <div className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded-lg shadow-md border border-gray-200 w-56 max-h-[80%] overflow-y-auto">
        <h4 className="text-sm font-semibold mb-2 text-gray-700 border-b pb-1">กรองข้อมูลเหตุการณ์</h4>
        <div className="flex flex-col gap-1">
          {FILTER_HIERARCHY.map((group) => (
            <div key={group.id} className="flex flex-col">
              
              {/* ระดับที่ 1: Type (Parent) */}
              <div className="flex items-center justify-between p-1 hover:bg-gray-50 rounded transition-colors">
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                    checked={activeFilters[group.id]}
                    onChange={() => handleToggleParent(group.id)}
                  />
                  <span className={`text-sm ${group.color} font-medium`}>{group.label}</span>
                </label>
                
                {/* ปุ่มย่อ/ขยาย Subtype */}
                {group.subtypes && group.subtypes.length > 0 && (
                  <button 
                    onClick={() => toggleExpand(group.id)}
                    className="text-gray-400 hover:text-gray-600 px-2 cursor-pointer"
                  >
                    {expandedGroups[group.id] ? "▼" : "▶"}
                  </button>
                )}
              </div>

              {/* ระดับที่ 2: Subtype (Children) แสดงเมื่อถูกขยาย */}
              {expandedGroups[group.id] && group.subtypes && (
                <div className="flex flex-col gap-1 pl-6 pr-2 py-1 mb-1 border-l-2 border-gray-100 ml-2">
                  {group.subtypes.map(sub => (
                    <label key={sub.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 text-blue-500 rounded focus:ring-blue-400 border-gray-300 cursor-pointer"
                        checked={activeFilters[`${group.id}_${sub.id}`]}
                        onChange={() => handleToggleChild(group.id, sub.id)}
                      />
                      <span className="text-xs text-gray-600">{sub.label}</span>
                    </label>
                  ))}
                </div>
              )}
              
            </div>
          ))}
        </div>
      </div>

      {/* --- แผนที่ Leaflet --- */}
      <MapContainer center={mapCenter} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredIncidents.map((incident, idx) => {
          const lat = parseFloat(incident.lat || (incident.position && incident.position[0]));
          const lng = parseFloat(incident.lng || (incident.position && incident.position[1]));

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={incident.id || idx} position={[lat, lng]} icon={getIncidentIcon(incident)}>
              <IncidentPopup incident={incident} />
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default IncidentMap;