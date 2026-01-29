// frontend/src/components/ui/ViolationCard.jsx
import React from 'react';
import { violationConfigs } from '../../config/ViolationConfig';

export const ViolationCard = ({ violation, type, onClick }) => {
  // ดึง config ตามประเภท
  const config = violationConfigs[type] || violationConfigs.lprsearch;
  const fields = config.fields || [];

  return (
    <div 
      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onClick?.(violation)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* ทะเบียนรถ - แสดงเด่น */}
          <div className="mb-3">
            <span className="text-lg font-bold text-gray-900">
              {violation.lpr || violation.plate_no || "ไม่ทราบทะเบียน"}
            </span>
          </div>

          {/* ข้อมูลตาม config */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {fields.map((field, idx) => {
              const value = violation[field.key];
              
              // ข้าม field ที่ optional และไม่มีค่า
              if (field.optional && !value) return null;
              
              return (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">{field.label}:</span>
                  <span className={`font-medium ${
                    field.key === 'speed' && violation.status === 'สูง' 
                      ? 'text-red-600' 
                      : 'text-gray-900'
                  }`}>
                    {value || '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Badge */}
        {violation.status && (
          <div className="ml-4 flex-shrink-0">
            <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
              violation.status === "สูง" 
                ? "bg-red-100 text-red-800" 
                : violation.status === "ปานกลาง"
                ? "bg-orange-100 text-orange-800"
                : violation.status === "Green List"
                ? "bg-green-100 text-green-800"
                : violation.status === "No Green List"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}>
              {violation.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};