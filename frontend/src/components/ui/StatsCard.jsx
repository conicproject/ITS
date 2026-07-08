// frontend/src/components/StatsCard.jsx
import React from "react";

function StatsCard({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        // ดึงสีจาก class ที่ส่งมา (เช่น "text-red-500") เพื่อนำไปทำ Border
        // หรือถ้าไม่มีก็ใช้สีเทาเป็นค่าเริ่มต้น
        const colorClass = stat.color || "text-gray-500";
        // แปลง text-color เป็น border-color แบบง่ายๆ หรือใช้ style inline
        
        return (
          <div 
            key={index} 
            className="rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between hover:shadow-md transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group"
          >
            {/* Decoration Bar ด้านข้าง */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorClass.replace('text-', 'bg-')}`}></div>

            <div className="flex items-center justify-between mb-3 pl-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-2 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')} ${colorClass}`}>
                <Icon size={20} />
              </div>
            </div>
            
            <div className="pl-2">
              <h3 className="text-3xl font-bold text-gray-800">
                {stat.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCard;