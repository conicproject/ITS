// frontend/src/components/ui/ViolationCard.jsx
import React from 'react';
import { violationConfigs } from '../../config/ViolationConfig';

// ─── Severity System ──────────────────────────────────────────────────────────
const severityMap = {
  สูง: {
    bar:   'bg-red-500',
    badge: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    dot:   'bg-red-500 animate-pulse',
    ring:  'ring-red-300',
    hover: 'hover:border-red-200 hover:shadow-red-100/60',
  },
  ปานกลาง: {
    bar:   'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dot:   'bg-amber-400',
    ring:  'ring-amber-200',
    hover: 'hover:border-amber-200 hover:shadow-amber-100/60',
  },
  ต่ำ: {
    bar:   'bg-blue-400',
    badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    dot:   'bg-blue-400',
    ring:  'ring-blue-200',
    hover: 'hover:border-blue-200 hover:shadow-blue-100/60',
  },
  'Green List': {
    bar:   'bg-green-600',
    badge: 'bg-green-50 text-green-700 ring-1 ring-green-200',
    dot:   'bg-green-500',
    ring:  'ring-green-300',
    hover: 'hover:border-green-300 hover:shadow-green-100/60',
  },
  'No Green List': {
    bar:   'bg-yellow-400',
    badge: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
    dot:   'bg-yellow-400',
    ring:  'ring-yellow-200',
    hover: 'hover:border-yellow-200 hover:shadow-yellow-100/60',
  },
  default: {
    bar:   'bg-green-700',
    badge: 'bg-green-50 text-green-800 ring-1 ring-green-200',
    dot:   'bg-green-600',
    ring:  'ring-green-200',
    hover: 'hover:border-green-300 hover:shadow-green-100/60',
  },
};

// ─── ViolationCard ────────────────────────────────────────────────────────────
export const ViolationCard = ({ violation, type, onClick }) => {
  const config = violationConfigs?.[type] || violationConfigs?.lprsearch || { fields: [] };
  const fields = config.fields || [];
  const status = violation.status;
  const sev    = severityMap[status] || severityMap.default;
  const plate  = violation.lpr || violation.plate_no || 'ไม่ทราบทะเบียน';

  return (
    <div
      onClick={() => onClick?.(violation)}
      className={`group relative bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5 ${sev.hover}`}
    >
      <div className={`absolute inset-y-0 left-0 w-1 ${sev.bar} rounded-l-xl transition-all duration-200 group-hover:w-[5px]`} />

      <div className="pl-5 pr-4 pt-3.5 pb-3">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex flex-col gap-1.5 min-w-0">
            
            {/* Plate & Status */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white font-mono font-bold text-sm tracking-widest ring-2 ${sev.ring} shadow-sm transition-shadow duration-200 group-hover:ring-offset-1`}>
                <svg className="w-3 h-3 opacity-40 flex-shrink-0" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="1" width="22" height="14" rx="2"/>
                  <line x1="4" y1="5" x2="4" y2="11"/><line x1="20" y1="5" x2="20" y2="11"/>
                </svg>
                {plate}
              </div>

              {status && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sev.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                  {status}
                </span>
              )}
            </div>

            {/* ส่วนแสดงเวลา */}
            {violation.time && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 mt-0.5">
                <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {violation.time}
              </div>
            )}
            
          </div>

          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors duration-200 mt-1">
            <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-green-700 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Dynamic Fields Section */}
        {fields.length > 0 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-0 border-t border-gray-100 pt-2.5 mt-2">
            {fields.map((field, idx) => {
              if (field.key === 'time') return null;

              const value = violation[field.key];
              if (field.optional && !value) return null;
              const isHighSpeed = field.key === 'speed' && status === 'สูง';
              
              return (
                <div key={idx} className="flex items-baseline justify-between gap-2 py-1 border-b border-gray-50 last:border-0">
                  <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap shrink-0">{field.label}</span>
                  <span className={`text-xs font-bold text-right truncate ${isHighSpeed ? 'text-red-600' : 'text-gray-800'}`}>
                    {value ?? <span className="text-gray-300 font-normal">—</span>}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};