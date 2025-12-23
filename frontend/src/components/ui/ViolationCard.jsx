// frontend/src/components/ui/ViolationCard.jsx
import { violationConfigs, statusColors } from "../../config/ViolationConfig";

export const ViolationCard = ({ violation, type }) => {
  const config = violationConfigs[type] || { fields: [], showDetail: false };
  const { fields, showDetail } = config;
  
  const visibleFields = fields.filter((field) => !field.optional || violation[field.key]);
  const hasSpeed = !!violation.speed;

  // เลือกจำนวนคอลัมน์อย่างปลอดภัย
  const cols = Math.max(1, visibleFields.length || 1);
  const gridTemplate = `repeat(${cols}, minmax(0, 1fr))`;

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="p-2 flex flex-col gap-3">

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 text-xs bg-gray-500 text-white">{violation.lpr ?? "-"}</span>
          <span className="px-2 py-1 text-xs bg-gray-500 text-white">{violation.type ?? "-"}</span>
          {!hasSpeed && (
            <span className={`px-2 py-1 text-xs text-white rounded ${statusColors[violation.status] || "bg-gray-400"}`}>
              {violation.status ?? "-"}
            </span>
          )}
        </div>

        {/* Fields - dynamic grid that can shrink */}
        <div className="grid gap-4" style={{ gridTemplateColumns: gridTemplate, minWidth: 0 }}>
          {visibleFields.map((field) => (
            <div key={field.key} className="text-sm text-gray-600 break-words">
              <div className="text-xs text-gray-500">{field.label}</div>
              <div className="text-xs font-medium text-black truncate">{violation[field.key] ?? "-"}</div>
            </div>
          ))}
        </div>

        {/* Detail */}
        {showDetail && violation.detail && (
          <div className="text-xs bg-gray-200 p-2 rounded break-words">
            หมายเหตุ: {violation.detail}
          </div>
        )}
      </div>
    </div>
  );
};
