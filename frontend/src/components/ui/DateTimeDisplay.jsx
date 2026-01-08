import React, { useState, useEffect } from 'react';

// --- Icons (Copy มาไว้เพื่อให้ Component นี้จบในตัว หรือจะ Import จากที่กลางก็ได้) ---
const ClockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

const CalendarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);

const DateTimeDisplay = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // อัปเดตเวลาทุก 1 วินาที
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    // Clear timer เมื่อ Component ถูกทำลาย
    return () => clearInterval(timer);
  }, []);

  // ฟอร์แมตวันที่แบบไทย (เช่น วันจันทร์ที่ 23 มิถุนายน 2568)
  const formattedDate = date.toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // ฟอร์แมตเวลา (เช่น 14:20:39)
  const formattedTime = date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div className="w-full md:w-auto bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-lg flex flex-row md:flex-col justify-between md:justify-end items-center md:items-end gap-2">
      {/* เวลา */}
      <div className="text-xl md:text-2xl font-bold text-slate-800 font-mono flex items-center gap-2 order-2 md:order-1">
        <ClockIcon className="w-5 h-5 text-slate-400 hidden md:block" />
        <span suppressHydrationWarning>{formattedTime} น.</span>
      </div>
      
      {/* วันที่ */}
      <div className="text-xs md:text-sm text-slate-500 flex items-center gap-2 order-1 md:order-2">
        <CalendarIcon className="w-4 h-4" />
        <span suppressHydrationWarning>{formattedDate}</span>
      </div>
    </div>
  );
};

export default DateTimeDisplay;