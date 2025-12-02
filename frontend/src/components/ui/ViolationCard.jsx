// ViolationCard.jsx
import { violationConfigs, statusColors } from "../../config/ViolationConfig";

export const ViolationCard = ({ violation, type }) => {
  const { fields, showDetail } = violationConfigs[type];
  
  // กรอง fields ที่จะแสดง
  const visibleFields = fields.filter((field) => !field.optional || violation[field.key]);
  
  // เช็คว่ามี speed หรือไม่
  const hasSpeed = violation.speed;

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="p-2 flex flex-col gap-3">
        {/* Tags */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs bg-gray-500 text-white">{violation.lpr}</span>
          <span className="px-2 py-1 text-xs bg-gray-500 text-white">{violation.type}</span>
          
          {/* แสดง status เฉพาะเมื่อไม่มี speed */}
          {!hasSpeed && (
            <span className={`px-2 py-1 text-xs text-white rounded ${statusColors[violation.status] || "bg-gray-400"}`}>
              {violation.status}
            </span>
          )}
        </div>

        {/* Fields - grid แบบ dynamic */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${visibleFields.length}, 1fr)` }}>
          {visibleFields.map((field) => (
            <div key={field.key} className="text-sm text-gray-600">
              {field.label}
              <div className="text-xs font-medium text-black">{violation[field.key]}</div>
            </div>
          ))}
        </div>

        {/* Detail */}
        {showDetail && violation.detail && (
          <div className="text-xs bg-gray-200 p-2 rounded">
            หมายเหตุ: {violation.detail}
          </div>
        )}
      </div>
    </div>
  );
};