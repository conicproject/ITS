// frontend/src/components/ui/ViolationList.jsx
import { ViolationCard } from './ViolationCard';

/**
 * Component แสดงรายการฝ่าฝืนทั้งหมด
 * @param {string} title - หัวข้อ
 * @param {Array} violations - รายการฝ่าฝืน
 * @param {string} type - ประเภท
 * @param {string} timeRange - ช่วงเวลา (สำหรับ barrier)
 */
export const ViolationList = ({ 
  title, 
  violations = [], 
  type,
  timeRange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="font-medium text-lg">
          {title} ({violations.length} รายการ)
          {timeRange && (
            <span className="text-sm text-gray-500 ml-2">
              {timeRange}
            </span>
          )}
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {violations.length > 0 ? (
          violations.map((violation, index) => (
            <ViolationCard 
              key={index} 
              violation={violation} 
              type={type}
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            ไม่พบข้อมูลการฝ่าฝืน
          </div>
        )}
      </div>
    </div>
  );
};
