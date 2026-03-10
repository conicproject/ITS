import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaCalendarAlt, FaChevronDown, FaChartBar, FaCalendarDay, FaCalendarWeek } from "react-icons/fa";

function EnforcementReportFunction() {
  const navigate = useNavigate();

  // --- States ---
  const [selectData, setSelectData] = useState(0);
  
  // ค่าที่ใช้ส่งไป Backend หรือคำนวณ
  const [date, setDate] = useState("");
  const [week, setWeek] = useState("");
  const [month, setMonth] = useState("");
  const [selectYear, setSelectYear] = useState("");

  // State สำหรับเก็บช่วงวันที่ของสัปดาห์ (เพื่อการแสดงผล)
  const [selectedWeekRange, setSelectedWeekRange] = useState({ start: null, end: null });

  // Picker Visibility
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Calendar View States
  const [currentDayPickerMonth, setCurrentDayPickerMonth] = useState(new Date());
  const [currentMonthPickerYear, setCurrentMonthPickerYear] = useState(new Date().getFullYear());

  // Refs for Click Outside
  const dayPickerRef = useRef(null);
  const weekPickerRef = useRef(null);
  const monthPickerRef = useRef(null);
  const yearPickerRef = useRef(null);

  const items_selectData = [
    { key: 0, name: "ข้อมูลจราจรทั่วไป" },
    { key: 1, name: "ข้อมูลการฝ่าฝืนสัญญาณไฟจราจร" },
  ];

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const currentThaiYear = today.getFullYear() + 543;
  const startYear = 2565;
  const years = Array.from({ length: currentThaiYear - startYear + 1 }, (_, i) => startYear + i);

  // --- Logic Helpers ---
  
  // ฟังก์ชันหาวันจันทร์และอาทิตย์ของสัปดาห์จากวันที่ระบุ
  const getWeekRange = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) - 6 (Sat)
    
    // หาวันจันทร์ (ถ้าเป็นวันอาทิตย์ day=0 ให้ลบ 6 วัน, ถ้าวันอื่นให้ลบ day-1)
    const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diffToMon));
    
    // หาวันอาทิตย์ (บวกไปอีก 6 วันจากวันจันทร์)
    const sunday = new Date(new Date(monday).setDate(monday.getDate() + 6));
    
    return { start: monday, end: sunday };
  };

  const formatDateThai = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const thaiYear = parseInt(year) + 543;
    return `${day}/${month}/${thaiYear}`;
  };

  const formatMonthThai = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const thaiYear = parseInt(year) + 543;
    const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    return `${monthNames[parseInt(month) - 1]} ${thaiYear}`;
  };

  // Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dayPickerRef.current && !dayPickerRef.current.contains(event.target)) setShowDayPicker(false);
      if (weekPickerRef.current && !weekPickerRef.current.contains(event.target)) setShowWeekPicker(false);
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target)) setShowMonthPicker(false);
      if (yearPickerRef.current && !yearPickerRef.current.contains(event.target)) setShowYearPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirm = () => {
    if (!date && !week && !month && !selectYear) {
      alert("กรุณาเลือกช่วงเวลาที่ต้องการออกรายงาน");
      return;
    }

    const paramType = date ? "day" : week ? "week" : month ? "month" : selectYear ? "year" : "";
    const year = selectYear ? parseInt(selectYear - 543) : null;
    const paramDate = date || week || month || year;
    const checkpoint = "34";

    navigate("/enforcement/function/detail-report-vehicle", {
      state: { type: paramType, date: paramDate, checkpoint, typeData: selectData },
    });
  };

  // --- Selection Handlers ---

  const handleSelectDay = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    setDate(`${year}-${month}-${day}`);
    
    // Clear others
    setWeek(""); setSelectedWeekRange({ start: null, end: null }); setMonth(""); setSelectYear("");
    setShowDayPicker(false);
  };

  const handleSelectWeekDate = (dateObj) => {
    // 1. หาช่วง จันทร์-อาทิตย์
    const { start, end } = getWeekRange(dateObj);
    setSelectedWeekRange({ start, end });

    // 2. คำนวณ Week String (YYYY-Wxx)
    const oneJan = new Date(start.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((start - oneJan) / (24 * 60 * 60 * 1000));
    const weekNum = Math.ceil((start.getDay() + 1 + numberOfDays) / 7);
    const weekStr = `${start.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
    setWeek(weekStr);

    // 3. Clear others
    setDate(""); setMonth(""); setSelectYear("");
    setShowWeekPicker(false);
  };

  const handleSelectMonth = (monthIndex) => {
    setMonth(`${currentMonthPickerYear}-${String(monthIndex + 1).padStart(2, "0")}`);
    setDate(""); setWeek(""); setSelectedWeekRange({ start: null, end: null }); setSelectYear("");
    setShowMonthPicker(false);
  };

  const handleSelectYear = (y) => {
    setSelectYear(y.toString());
    setDate(""); setWeek(""); setSelectedWeekRange({ start: null, end: null }); setMonth("");
    setShowYearPicker(false);
  };

  // --- Renderers ---

  const renderDayCalendar = () => {
    if (!showDayPicker) return null;
    const currentYear = currentDayPickerMonth.getFullYear();
    const currentMonth = currentDayPickerMonth.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startingDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    for (let i = 0; i < startingDay; i++) days.push(<div key={`empty-${i}`} />);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      const dateStr = dateObj.toISOString().split('T')[0];
      const isValid = dateObj <= yesterday;
      const isSelected = dateStr === date;

      days.push(
        <button key={day} onClick={() => isValid && handleSelectDay(dateObj)} disabled={!isValid}
          className={`p-2 rounded-lg text-sm font-medium transition-all ${isSelected ? "bg-green-600 text-white shadow-md" : isValid ? "hover:bg-green-50 text-gray-700 hover:text-green-700" : "text-gray-300 cursor-not-allowed"}`}>
          {day}
        </button>
      );
    }

    return (
      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-[320px] animate-fade-in z-[100]">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentDayPickerMonth(new Date(currentYear, currentMonth - 1, 1))} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">◀</button>
          <span className="font-bold text-gray-800">{new Date(currentYear, currentMonth).toLocaleDateString("th-TH", { month: "long", year: "numeric" })}</span>
          <button onClick={() => setCurrentDayPickerMonth(new Date(currentYear, currentMonth + 1, 1))} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">▶</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2 font-bold">{["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map(d => <div key={d}>{d}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  const renderWeekCalendar = () => {
    if (!showWeekPicker) return null;
    
    // ใช้เดือน/ปี จาก selectedWeekRange ถ้ามี หรือใช้ yesterday เพื่อเริ่มแสดงผล
    const currentYear = selectedWeekRange.start ? selectedWeekRange.start.getFullYear() : yesterday.getFullYear();
    const currentMonth = selectedWeekRange.start ? selectedWeekRange.start.getMonth() : yesterday.getMonth();
    
    // ถ้าต้องการเลื่อนเดือนใน WeekPicker อาจต้องเพิ่ม State viewDate แยก
    // ในที่นี้ใช้ logic ง่ายๆ คือแสดงเดือนของ week ที่เลือก หรือเดือนปัจจุบัน
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startingDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    for (let i = 0; i < startingDay; i++) days.push(<div key={`empty-${i}`} />);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      const isValid = dateObj <= yesterday;
      
      // Check Range
      let isInRange = false;
      let isStart = false;
      let isEnd = false;

      if (selectedWeekRange.start && selectedWeekRange.end) {
        const dTime = dateObj.getTime();
        const sTime = new Date(selectedWeekRange.start).setHours(0,0,0,0);
        const eTime = new Date(selectedWeekRange.end).setHours(0,0,0,0);
        
        if (dTime >= sTime && dTime <= eTime) isInRange = true;
        if (dTime === sTime) isStart = true;
        if (dTime === eTime) isEnd = true;
      }

      let btnClass = "p-2 text-sm font-medium transition-all w-full relative z-10 ";
      if (!isValid) {
         btnClass += "text-gray-300 cursor-not-allowed";
      } else {
         if (isInRange) {
            btnClass += "bg-blue-100 text-blue-700 ";
            if (isStart) btnClass += "rounded-l-lg bg-blue-600 text-white shadow-md ";
            if (isEnd) btnClass += "rounded-r-lg bg-blue-600 text-white shadow-md ";
         } else {
            btnClass += "hover:bg-gray-100 text-gray-700 rounded-lg ";
         }
      }

      days.push(
        <button key={day} onClick={() => isValid && handleSelectWeekDate(dateObj)} disabled={!isValid} className={btnClass}>
          {day}
        </button>
      );
    }

    return (
      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-[320px] animate-fade-in z-[100]">
        <div className="flex justify-between items-center mb-4">
           {/* หมายเหตุ: ปุ่มเลื่อนเดือนนี้ในโค้ดตัวอย่างนี้ยัง fix ไว้ที่เดือนปัจจุบัน/เดือนที่เลือก หากต้องการให้เลื่อนได้อิสระต้องเพิ่ม state viewDate */}
           <button onClick={() => {}} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 cursor-not-allowed opacity-50">◀</button>
           <span className="font-bold text-gray-800">{new Date(currentYear, currentMonth).toLocaleDateString("th-TH", { month: "long", year: "numeric" })}</span>
           <button onClick={() => {}} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 cursor-not-allowed opacity-50">▶</button>
        </div>
        <div className="grid grid-cols-7 gap-0 text-center text-xs text-gray-400 mb-2 font-bold">{["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map(d => <div key={d}>{d}</div>)}</div>
        <div className="grid grid-cols-7 gap-y-1 gap-x-0">{days}</div>
        <div className="mt-3 text-xs text-center text-gray-400 border-t pt-2">*เลือกวันใดก็ได้ ระบบจะระบุสัปดาห์ให้อัตโนมัติ</div>
      </div>
    );
  };

  const renderMonthPicker = () => {
    if (!showMonthPicker) return null;
    const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    return (
      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-[320px] animate-fade-in z-[100]">
        <div className="flex justify-between items-center mb-4">
           <button onClick={() => setCurrentMonthPickerYear(prev => prev - 1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">◀</button>
           <span className="font-bold text-gray-800">{currentMonthPickerYear + 543}</span>
           <button onClick={() => setCurrentMonthPickerYear(prev => prev + 1)} disabled={currentMonthPickerYear >= today.getFullYear()} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 disabled:opacity-30">▶</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {monthNames.map((name, idx) => {
             const isValid = currentMonthPickerYear < today.getFullYear() || (currentMonthPickerYear === today.getFullYear() && idx <= today.getMonth());
             return (
               <button key={idx} onClick={() => isValid && handleSelectMonth(idx)} disabled={!isValid}
                 className={`p-2 rounded-lg text-sm transition-all ${month === `${currentMonthPickerYear}-${String(idx + 1).padStart(2, "0")}` ? "bg-purple-600 text-white shadow-md" : isValid ? "hover:bg-purple-50 hover:text-purple-700 text-gray-600" : "text-gray-300 cursor-not-allowed"}`}>
                 {name}
               </button>
             )
          })}
        </div>
      </div>
    );
  };

  const renderYearPicker = () => {
    if (!showYearPicker) return null;
    return (
      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-[320px] max-h-64 overflow-y-auto animate-fade-in z-[100]">
        <div className="grid grid-cols-3 gap-2">
          {years.map(y => (
             <button key={y} onClick={() => handleSelectYear(y)} disabled={y > currentThaiYear}
               className={`p-2 rounded-lg text-sm transition-all ${selectYear === y.toString() ? "bg-orange-500 text-white shadow-md" : y <= currentThaiYear ? "hover:bg-orange-50 hover:text-orange-700 text-gray-600" : "text-gray-300"}`}>
               {y}
             </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center py-10 px-4">
      
      {/* Header Section */}
      <div className="w-full max-w-2xl mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-2xl shadow-lg flex items-center justify-center mb-4 text-white">
          <FaFileAlt className="text-3xl" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">ออกรายงานจราจร</h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">เลือกระบุช่วงเวลาที่ต้องการเพื่อ Export ข้อมูล</p>
      </div>

      {/* Main Card (ลบ overflow-hidden เพื่อให้ Popup ไม่โดนตัด) */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 relative">
        
        {/* Card Header Stripe */}
        <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-500 w-full rounded-t-3xl"></div>

        <div className="p-6 md:p-8 space-y-6">
            
            {/* 1. Data Type Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <FaChartBar className="text-green-600" />
                ประเภทข้อมูล
              </label>
              <div className="relative group">
                <select
                  value={selectData}
                  onChange={(e) => setSelectData(Number(e.target.value))}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium cursor-pointer"
                >
                  {items_selectData.map((item) => (
                    <option key={item.key} value={item.key}>{item.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-green-600 transition-colors">
                  <FaChevronDown />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 2. Date Selection Grid */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
                <FaCalendarAlt className="text-blue-500" />
                เลือกช่วงเวลา (ระบุอย่างใดอย่างหนึ่ง)
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Day Input */}
                <div className={`relative ${showDayPicker ? 'z-50' : 'z-auto'}`} ref={dayPickerRef}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1 ml-1">รายวัน</label>
                  <div 
                    onClick={() => setShowDayPicker(!showDayPicker)}
                    className={`flex items-center justify-between w-full bg-white border ${date ? 'border-green-500 ring-1 ring-green-200' : 'border-gray-200 hover:border-green-300'} rounded-xl py-3 px-4 cursor-pointer transition-all`}
                  >
                    <span className={`text-sm ${date ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                      {date ? formatDateThai(date) : "เลือกวันที่..."}
                    </span>
                    <FaCalendarDay className={`${date ? 'text-green-500' : 'text-gray-300'}`} />
                  </div>
                  {renderDayCalendar()}
                </div>

                {/* Week Input (ใช้ Z-index และการแสดงผลช่วงวัน) */}
                <div className={`relative ${showWeekPicker ? 'z-50' : 'z-auto'}`} ref={weekPickerRef}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1 ml-1">รายสัปดาห์</label>
                  <div 
                    onClick={() => setShowWeekPicker(!showWeekPicker)}
                    className={`flex items-center justify-between w-full bg-white border ${week ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200 hover:border-blue-300'} rounded-xl py-3 px-4 cursor-pointer transition-all`}
                  >
                    <div className="flex flex-col">
                        <span className={`text-sm ${week ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                          {selectedWeekRange.start ? 
                             `${formatDateThai(selectedWeekRange.start.toISOString().split('T')[0])} - ${formatDateThai(selectedWeekRange.end.toISOString().split('T')[0])}` 
                             : "เลือกสัปดาห์..."}
                        </span>
                        {week && <span className="text-[10px] text-blue-500 font-medium">({week})</span>}
                    </div>
                    <FaCalendarWeek className={`${week ? 'text-blue-500' : 'text-gray-300'}`} />
                  </div>
                  {renderWeekCalendar()}
                </div>

                {/* Month Input */}
                <div className={`relative ${showMonthPicker ? 'z-50' : 'z-auto'}`} ref={monthPickerRef}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1 ml-1">รายเดือน</label>
                  <div 
                    onClick={() => setShowMonthPicker(!showMonthPicker)}
                    className={`flex items-center justify-between w-full bg-white border ${month ? 'border-purple-500 ring-1 ring-purple-200' : 'border-gray-200 hover:border-purple-300'} rounded-xl py-3 px-4 cursor-pointer transition-all`}
                  >
                    <span className={`text-sm ${month ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                      {month ? formatMonthThai(month) : "เลือกเดือน..."}
                    </span>
                    <FaChevronDown className={`text-xs ${month ? 'text-purple-500' : 'text-gray-300'}`} />
                  </div>
                  {renderMonthPicker()}
                </div>

                {/* Year Input */}
                <div className={`relative ${showYearPicker ? 'z-50' : 'z-auto'}`} ref={yearPickerRef}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1 ml-1">รายปี</label>
                  <div 
                    onClick={() => setShowYearPicker(!showYearPicker)}
                    className={`flex items-center justify-between w-full bg-white border ${selectYear ? 'border-orange-500 ring-1 ring-orange-200' : 'border-gray-200 hover:border-orange-300'} rounded-xl py-3 px-4 cursor-pointer transition-all`}
                  >
                    <span className={`text-sm ${selectYear ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                      {selectYear ? `พ.ศ. ${selectYear}` : "เลือกปี..."}
                    </span>
                    <FaChevronDown className={`text-xs ${selectYear ? 'text-orange-500' : 'text-gray-300'}`} />
                  </div>
                  {renderYearPicker()}
                </div>

              </div>
            </div>
            
            {/* 3. Action Button */}
            <div className="pt-4 relative z-0">
              <button
                onClick={handleConfirm}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-green-200 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <FaFileAlt />
                <span>สร้างรายงาน</span>
              </button>
            </div>
        </div>
      </div>

      {/* Footer Info */}
      <p className="mt-8 text-center text-gray-400 text-xs">
        ระบบบริหารจัดการข้อมูลจราจรอัจฉริยะ © 2025
      </p>

    </div>
  );
}

export default EnforcementReportFunction;