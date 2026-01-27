// frontend/src/components/ui/ViolationList.jsx
import { ViolationCard } from './ViolationCard';

/**
 * Component แสดงรายการฝ่าฝืนทั้งหมด
 */
export const ViolationList = ({ 
  title, 
  violations = [], 
  type,
  timeRange,
  loading = false,
  onRowClick
}) => {
  // แสดง Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          <span className="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="font-medium text-lg">
          {title}
          {violations.length > 0 && ` (${violations.length} รายการ)`}
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
              key={violation.id || index} 
              violation={violation} 
              type={type}
              onClick={onRowClick}
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-lg font-medium mb-2">ไม่พบข้อมูล</div>
            <div className="text-sm">ลองค้นหาด้วยเงื่อนไขอื่น</div>
          </div>
        )}
      </div>
    </div>
  );
};