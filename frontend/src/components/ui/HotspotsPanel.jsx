// frontend/src/components/HotspotsPanel.jsx
import React from "react";
import { FaEye } from "react-icons/fa";

function HotspotsPanel({ hotspots }) {
  return (
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
  );
}

export default HotspotsPanel;