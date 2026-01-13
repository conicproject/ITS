import { ViolationCard } from './ViolationCard';
import { FaListUl, FaLayerGroup } from 'react-icons/fa';

// รับ prop onSelectViolation เพิ่ม
export const ViolationList = ({ 
  title = "รายการความเร็วเกินกำหนด", 
  violations = [], 
  timeRange,
  onSelectViolation // <-- รับฟังก์ชันเมื่อมีการเลือกรายการ
}) => {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="px-3 py-2 md:px-6 md:py-4 border-b border-gray-100 flex items-center justify-between gap-2 bg-white sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-blue-50 p-1.5 md:p-2 rounded-lg text-blue-600 shrink-0">
            <FaLayerGroup className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </div>
          <div className="min-w-0">
             <h2 className="font-bold text-gray-800 text-sm md:text-lg leading-tight truncate">{title}</h2>
             {timeRange && <p className="text-[10px] md:text-xs text-gray-400 mt-0.5 truncate hidden sm:block">{timeRange}</p>}
          </div>
        </div>
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap">
            {violations.length} คัน
        </span>
      </div>
      
      {/* Scrollable List */}
      <div className="p-2 md:p-4 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/50">
        {violations.length > 0 ? (
          <div className="flex flex-col gap-2 md:gap-3">
            {violations.map((violation, index) => (
              // ส่ง onSelectViolation ไปที่ onClick ของ Card
              <ViolationCard 
                key={index} 
                violation={violation} 
                onClick={onSelectViolation} 
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <FaListUl className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm">ไม่พบข้อมูล</p>
          </div>
        )}
      </div>
    </div>
  );
};