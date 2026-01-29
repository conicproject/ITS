// src/components/ui/MapFilterControl.jsx
import React, { useState } from "react";
import { 
  FaLayerGroup, FaChevronDown, FaChevronUp, FaCheckSquare, FaSquare
} from "react-icons/fa";

// รับ filterItems เข้ามาเป็น Props
const MapFilterControl = ({ filterItems, filters, toggleFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // นับจำนวนที่ Active อยู่จริง (เฉพาะตัวที่มีใน list นี้)
  const activeCount = filterItems.filter(i => filters[i.type]).length;

  return (
    <div className="leaflet-bottom leaflet-left" style={{ bottom: "20px", left: "10px", zIndex: 1000, position: "absolute" }}>
      <div className="leaflet-control leaflet-bar bg-white rounded-lg shadow-xl border border-gray-200 text-sm overflow-hidden" 
           style={{ minWidth: isExpanded ? "200px" : "auto", maxWidth: "240px" }}>
        <div 
          className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 font-bold text-gray-700">
            <FaLayerGroup className="text-blue-600"/> 
            {isExpanded && <span>ตัวกรอง ({activeCount})</span>}
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
};

export default MapFilterControl;