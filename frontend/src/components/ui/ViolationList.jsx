// frontend/src/components/ui/ViolationList.jsx
import React from 'react';
import { ViolationCard } from './ViolationCard';

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="relative bg-white rounded-xl border border-gray-200 p-4 overflow-hidden animate-pulse">
    <div className="absolute inset-y-0 left-0 w-1 bg-green-200 rounded-l-xl" />
    <div className="pl-3 flex items-center gap-3 mb-3">
      <div className="h-8 w-36 bg-gray-200 rounded-lg" />
      <div className="h-6 w-20 bg-gray-100 rounded-full" />
    </div>
    <div className="pl-3 grid grid-cols-3 gap-x-5 gap-y-2.5">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="h-2 w-10 bg-gray-100 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Severity dot indicator ───────────────────────────────────────────────────
const severityDot = {
  สูง:      { color: 'bg-red-500',   label: 'สูง' },
  ปานกลาง: { color: 'bg-amber-400', label: 'ปานกลาง' },
  ต่ำ:      { color: 'bg-blue-400',  label: 'ต่ำ' },
};

// ─── ViolationList ────────────────────────────────────────────────────────────
export const ViolationList = ({
  title,
  violations = [],
  type,
  timeRange,
  loading = false,
  onRowClick,
}) => {
  const severityCounts = Object.keys(severityDot).reduce((acc, key) => {
    acc[key] = violations.filter(v => v.status === key).length;
    return acc;
  }, {});

  return (
    // เอา h-full ออกจาก div หลัก
    <div className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50/60 to-white">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-green-700 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 text-base leading-tight truncate">
              {title || 'รายการฝ่าฝืน'}
            </h2>
            {timeRange && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{timeRange}</p>
            )}
          </div>
        </div>
        {!loading && (
          <div className="flex-shrink-0 ml-3">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${violations.length > 0 ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {violations.length.toLocaleString()}
              <span className="text-xs font-normal opacity-70">รายการ</span>
            </span>
          </div>
        )}
      </div>

      {/* เอา overflow-y-auto ออก */}
      <div className="flex-1">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : violations.length > 0 ? (
          <div className="p-4 space-y-2.5">
            {violations.map((violation, index) => (
              <ViolationCard
                key={violation.id || index}
                violation={violation}
                type={type}
                onClick={onRowClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center select-none">
            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
              </svg>
            </div>
            <p className="font-semibold text-gray-500">ไม่พบข้อมูล</p>
            <p className="text-sm text-gray-400 mt-1">ลองค้นหาด้วยเงื่อนไขอื่น</p>
          </div>
        )}
      </div>

      {!loading && violations.length > 0 && (
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100 bg-gray-50/80">
          <span className="text-xs text-gray-400">
            แสดงทั้งหมด {violations.length.toLocaleString()} รายการ
          </span>
          <div className="flex items-center gap-3">
            {Object.entries(severityDot).map(([key, { color, label }]) => {
              const count = severityCounts[key];
              if (!count) return null;
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-xs text-gray-500 font-medium">{label} {count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};