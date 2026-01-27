// src/components/ui/HotspotsPanel.jsx
import React from "react";
import { FaFireAlt, FaHistory, FaExclamationTriangle } from "react-icons/fa";

function HotspotsPanel({ hotspots = [], onHotspotClick }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-white z-10 sticky top-0">
        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
          <FaFireAlt className="text-red-500"/> จุดเกิดเหตุบ่อย (Hotspots)
        </h3>
      </div>
      <div className="p-2 space-y-3 overflow-y-auto flex-1 max-h-[400px] lg:max-h-full">
         {hotspots.map((spot, idx) => (
           <div 
              key={idx} 
              className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all relative overflow-hidden cursor-pointer group hover:border-blue-300" 
              onClick={() => onHotspotClick && onHotspotClick(spot)}
           >
              <div className="absolute top-0 right-0 bg-gray-100 px-2 py-1 rounded-bl-lg text-[10px] text-gray-500 font-bold">#{spot.rank}</div>
              <h4 className="font-bold text-sm text-gray-800 mb-1 pr-6 group-hover:text-blue-600 line-clamp-1">{spot.location || spot.name}</h4>
              <div className="flex gap-2 mb-2">
                 <span className={`text-[10px] px-2 py-0.5 rounded-full text-white ${spot.level === 'สูง' ? 'bg-red-500' : spot.level === 'กลาง' ? 'bg-orange-400' : 'bg-green-500'}`}>ความถี่: {spot.level || 'สูง'}</span>
                 <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">สะสม {spot.count || spot.incidents} ครั้ง</span>
              </div>
              <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded line-clamp-2">{spot.detail || "พื้นที่เฝ้าระวังพิเศษเนื่องจากเกิดเหตุบ่อยครั้ง"}</p>
              <div className="flex justify-end mt-2 pt-2 border-t border-gray-100">
                 <span className="text-[10px] text-blue-600 flex items-center gap-1 hover:underline font-medium"><FaHistory /> ดูประวัติ</span>
              </div>
           </div>
         ))}
         {hotspots.length === 0 && <div className="text-center text-gray-400 py-8">ไม่มีข้อมูล Hotspot</div>}
      </div>
    </div>
  );
}

export default HotspotsPanel;