import React from 'react';
import { FaClock, FaVideo, FaMapMarkerAlt, FaExclamationCircle } from 'react-icons/fa';

export const ViolationCard = ({ violation, onClick }) => {
  const data = {
    lpr: violation.lpr || "1กก-xxxx",
    type: violation.type || "รถยนต์",
    time: violation.time || "2025-01-24 14:25",
    camera: violation.camera || "CAM-002",
    location: violation.location || "แยกรัชดา-ห้วยขวาง",
    detail: violation.detail || "รายละเอียด...",
    status: violation.status || "สูง",
  };

  // --- Dynamic Theme Logic ---
  const getStatusTheme = (status) => {
      // สีแดง (ฝ่าฝืน)
      if (['สูง', 'No Green List', 'ฝ่าฝืน'].includes(status)) {
          return {
              bar: 'bg-red-500',
              badge: 'bg-red-50 text-red-600 border-red-100',
              borderHover: 'hover:border-red-400'
          };
      }
      // สีเขียว (Green List / ผ่าน)
      if (['ต่ำ', 'Green List', 'ผ่าน', 'ปกติ'].includes(status)) {
          return {
              bar: 'bg-green-500',
              badge: 'bg-green-50 text-green-600 border-green-100',
              borderHover: 'hover:border-green-400'
          };
      }
      // สีส้ม (ปานกลาง)
      if (['ปานกลาง', 'Warning'].includes(status)) {
          return {
              bar: 'bg-orange-400',
              badge: 'bg-orange-50 text-orange-600 border-orange-100',
              borderHover: 'hover:border-orange-400'
          };
      }
      // Default
      return {
          bar: 'bg-gray-300',
          badge: 'bg-gray-100 text-gray-600 border-gray-200',
          borderHover: 'hover:border-gray-300'
      };
  };

  const theme = getStatusTheme(data.status);

  return (
    <div 
      onClick={() => onClick && onClick(violation)}
      className={`group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md ${theme.borderHover} transition-all duration-200 relative overflow-hidden w-full cursor-pointer p-2 sm:p-3 md:p-4`}
    >
      {/* Left Bar (Dynamic Color) */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 md:w-1.5 rounded-l-xl transition-colors ${theme.bar}`} />

      <div className="pl-2 md:pl-3">
        {/* Header */}
        <div className="flex justify-between items-start mb-1.5 sm:mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <div className="bg-white border border-gray-800 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow-sm self-start">
                    <span className="text-xs sm:text-sm font-bold text-gray-900 tracking-wider block leading-none whitespace-nowrap">
                        {data.lpr}
                    </span>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md whitespace-nowrap self-start sm:self-auto">
                    {data.type}
                </span>
            </div>
            
            {/* Status Badge (Dynamic Color) */}
            <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full border whitespace-nowrap ${theme.badge}`}>
                {data.status}
            </span>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-2 sm:gap-3 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
            <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-400 uppercase font-bold">
                    <FaClock className="shrink-0" /> เวลา
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-gray-700 truncate">{data.time.includes(' ') ? data.time.split(' ')[1] : data.time} น.</div>
            </div>
             <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-400 uppercase font-bold">
                    <FaMapMarkerAlt className="shrink-0" /> จุดตรวจจับ
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-gray-700 truncate">{data.location}</div>
            </div>
            <div className="flex flex-col col-span-2 lg:col-span-1">
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-400 uppercase font-bold">
                    <FaVideo className="shrink-0" /> กล้อง
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-gray-700 truncate">{data.camera}</div>
            </div>
        </div>

        {/* Footer */}
        <div className="hidden sm:flex items-start gap-2 text-xs text-gray-500 pl-1 mt-2 bg-white pt-1">
            <FaExclamationCircle className="text-gray-400 mt-0.5 shrink-0" />
            <span className="break-words truncate line-clamp-1">{data.detail}</span>
        </div>
      </div>
    </div>
  );
};