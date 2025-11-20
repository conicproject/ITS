import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EnforcementReportFunction() {
  const navigate = useNavigate();

  const [selectData, setSelectData] = useState(0);
  const [date, setDate] = useState("");
  const [week, setWeek] = useState("");
  const [month, setMonth] = useState("");
  const [selectYear, setSelectYear] = useState("");

  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const [selectedWeekDate, setSelectedWeekDate] = useState("");
  const [currentDayPickerMonth, setCurrentDayPickerMonth] = useState(new Date());
  const [currentMonthPickerYear, setCurrentMonthPickerYear] = useState(new Date().getFullYear());

  const dayPickerRef = useRef(null);
  const weekPickerRef = useRef(null);
  const monthPickerRef = useRef(null);
  const yearPickerRef = useRef(null);

  const items_selectData = [
    { key: 0, name: "ข้อมูลจราจร" },
    { key: 1, name: "ข้อมูลยานพาหนะที่ฝ่าฝืนสัญญาณไฟจราจรทางข้ามชนิดปุ่มกด" },
  ];

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const currentThaiYear = today.getFullYear() + 543;
  const startYear = 2565;
  const years = Array.from({ length: currentThaiYear - startYear + 1 }, (_, i) => startYear + i);

  const generateMondays = () => {
    const mondays = [];
    const startDate = new Date(2022, 7, 1);
    let current = new Date(startDate);

    while (current.getDay() !== 1) {
      current.setDate(current.getDate() + 1);
    }

    while (current <= yesterday) {
      mondays.push(new Date(current).toISOString().split("T")[0]);
      current.setDate(current.getDate() + 7);
    }

    return mondays;
  };

  const validMondays = generateMondays();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dayPickerRef.current && !dayPickerRef.current.contains(event.target)) {
        setShowDayPicker(false);
      }
      if (weekPickerRef.current && !weekPickerRef.current.contains(event.target)) {
        setShowWeekPicker(false);
      }
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target)) {
        setShowMonthPicker(false);
      }
      if (yearPickerRef.current && !yearPickerRef.current.contains(event.target)) {
        setShowYearPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleConfirm = () => {
    if (!date && !week && !month && !selectYear) {
      alert("กรุณากรอกข้อมูล");
      return;
    }

    const paramType = date
      ? "day"
      : week
        ? "week"
        : month
          ? "month"
          : selectYear
            ? "year"
            : "";

    const year = selectYear ? parseInt(selectYear - 543) : null;
    const paramDate = date || week || month || year;
    const checkpoint = "34";

    navigate("/enforcement/function/detail-report-vehicle", {
      state: { type: paramType, date: paramDate, checkpoint, typeData: selectData },
    });
  };

  const formatDateThai = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const thaiYear = parseInt(year) + 543;
    return `${day}-${month}-${thaiYear}`;
  };

  const formatMonthThai = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const thaiYear = parseInt(year) + 543;
    const monthNames = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    return `${monthNames[parseInt(month) - 1]} ${thaiYear}`;
  };

  // ===== Day =====
  const handleSelectDay = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    setDate(dateStr);
    setShowDayPicker(false);
  };


  const renderDayCalendar = () => {
    if (!showDayPicker) return null;

    const currentYear = currentDayPickerMonth.getFullYear();
    const currentMonth = currentDayPickerMonth.getMonth();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
      const isValid = dateObj <= yesterday;
      const isSelected = dateStr === date;

      days.push(
        <button
          key={day}
          onClick={() => isValid && handleSelectDay(dateObj)}
          disabled={!isValid}
          className={`
            p-2 text-center rounded transition text-sm font-medium
            ${isSelected ? "bg-blue-600 text-white font-bold" : ""}
            ${isValid && !isSelected ? "bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 cursor-pointer" : ""}
            ${!isValid ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400" : ""}
          `}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentDayPickerMonth(new Date(currentYear, currentMonth - 1, 1))}
            className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-gray-700"
          >
            ◀
          </button>
          <span className="font-semibold text-gray-800 text-sm">
            {new Date(currentYear, currentMonth).toLocaleDateString("th-TH", { year: "numeric", month: "long" })}
          </span>
          <button
            onClick={() => setCurrentDayPickerMonth(new Date(currentYear, currentMonth + 1, 1))}
            className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-gray-700"
          >
            ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-700 text-xs p-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  const handleSelectWeekDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const oneJan = new Date(dateObj.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((((dateObj - oneJan) / 86400000 + oneJan.getDay() + 1) / 7));
    const weekStr = `${dateObj.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;

    setSelectedWeekDate(dateStr);
    setWeek(weekStr);
    setShowWeekPicker(false);
  };

  const renderWeekCalendar = () => {
    if (!showWeekPicker) return null;

    const currentYear = selectedWeekDate ? new Date(selectedWeekDate).getFullYear() : yesterday.getFullYear();
    const currentMonth = selectedWeekDate ? new Date(selectedWeekDate).getMonth() : yesterday.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
      const isValid = validMondays.includes(dateStr);
      const isSelected = dateStr === selectedWeekDate;

      days.push(
        <button
          key={day}
          onClick={() => isValid && handleSelectWeekDate(dateObj)}
          disabled={!isValid}
          className={`
          p-2 text-center rounded transition text-sm font-medium
          ${isSelected ? "bg-green-600 text-white font-bold" : ""}
          ${isValid && !isSelected ? "bg-white hover:bg-green-50 text-green-800 border border-green-200 cursor-pointer" : ""}
          ${!isValid ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400" : ""}
        `}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedWeekDate(new Date(currentYear, currentMonth - 1, 1))}
            className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-gray-700"
          >
            ◀
          </button>
          <span className="font-semibold text-gray-800 text-sm">
            {new Date(currentYear, currentMonth).toLocaleDateString("th-TH", { year: "numeric", month: "long" })}
          </span>
          <button
            onClick={() => setSelectedWeekDate(new Date(currentYear, currentMonth + 1, 1))}
            className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-gray-700"
          >
            ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-700 text-xs p-1">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  // ===== Month =====
  const handleSelectMonth = (monthIndex) => {
    const monthStr = `${currentMonthPickerYear}-${String(monthIndex + 1).padStart(2, "0")}`;
    setMonth(monthStr);
    setShowMonthPicker(false);
  };

  const renderMonthPicker = () => {
    if (!showMonthPicker) return null;

    const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return (
      <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonthPickerYear(currentMonthPickerYear - 1)}
            className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-gray-700"
          >
            ◀
          </button>
          <span className="font-semibold text-gray-800 text-sm">{currentMonthPickerYear + 543}</span>
          <button
            onClick={() => setCurrentMonthPickerYear(currentMonthPickerYear + 1)}
            disabled={currentMonthPickerYear >= currentYear}
            className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ▶
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {monthNames.map((name, index) => {
            const isValid = currentMonthPickerYear < currentYear || (currentMonthPickerYear === currentYear && index <= currentMonth);
            const isSelected = month === `${currentMonthPickerYear}-${String(index + 1).padStart(2, "0")}`;

            return (
              <button
                key={index}
                onClick={() => isValid && handleSelectMonth(index)}
                disabled={!isValid}
                className={`
                  p-3 text-center rounded transition text-sm font-semibold
                  ${isSelected ? "bg-purple-600 text-white" : ""}
                  ${isValid && !isSelected ? "bg-white hover:bg-purple-50 text-purple-800 border border-purple-200 cursor-pointer" : ""}
                  ${!isValid ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400" : ""}
                `}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ===== Year =====
  const renderYearPicker = () => {
    if (!showYearPicker) return null;

    return (
      <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full max-w-sm max-h-64 overflow-y-auto">
        <div className="mb-3">
          <span className="font-semibold text-gray-800 text-sm">เลือกปี พ.ศ.</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map((y) => {
            const isValid = y <= currentThaiYear;
            const isSelected = selectYear === y.toString();

            return (
              <button
                key={y}
                onClick={() => {
                  if (y <= currentThaiYear) {
                    setSelectYear(y.toString());
                    setShowYearPicker(false); // <-- ปิด picker หลังเลือกปี
                  }
                }}
                disabled={y > currentThaiYear}
                className={`
                  p-3 text-center rounded transition text-sm font-semibold
                  ${selectYear === y.toString() ? "bg-orange-600 text-white" : ""}
                  ${y <= currentThaiYear && selectYear !== y.toString() ? "bg-white hover:bg-orange-50 text-orange-800 border border-orange-200 cursor-pointer" : ""}
                  ${y > currentThaiYear ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400" : ""}
                `}
              >
                {y}
              </button>

            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">รายงานข้อมูลจราจร</h1>

      {/* ชนิดข้อมูล */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-green-800">ชนิดข้อมูล</label>
        <select
          className="w-full border rounded p-2 text-black"
          value={selectData}
          onChange={(e) => setSelectData(Number(e.target.value))}
        >
          {items_selectData.map((item) => (
            <option key={item.key} value={item.key}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Day */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-green-800">รายวัน</label>
        <div className="relative" ref={dayPickerRef}>
          <input
            type="text"
            readOnly
            value={date ? formatDateThai(date) : ""}
            onClick={() => setShowDayPicker(!showDayPicker)}
            placeholder="เลือกวันที่"
            className="w-full border rounded p-2 text-black cursor-pointer bg-white"
          />
          {renderDayCalendar()}
        </div>
      </div>

      {/* Week */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-green-800">รายสัปดาห์</label>
        <div className="relative" ref={weekPickerRef}>
          <input
            type="text"
            readOnly
            value={selectedWeekDate ? formatDateThai(selectedWeekDate) : ""}
            onClick={() => setShowWeekPicker(!showWeekPicker)}
            placeholder="เลือกวันจันทร์"
            className="w-full border rounded p-2 text-black cursor-pointer bg-white"
          />
          {renderWeekCalendar()}
        </div>
        {week && <p className="text-sm text-gray-600 mt-1">สัปดาห์ที่เลือก: {week}</p>}
      </div>

      {/* Month */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-green-800">รายเดือน</label>
        <div className="relative" ref={monthPickerRef}>
          <input
            type="text"
            readOnly
            value={month ? formatMonthThai(month) : ""}
            onClick={() => setShowMonthPicker(!showMonthPicker)}
            placeholder="เลือกเดือน"
            className="w-full border rounded p-2 text-black cursor-pointer bg-white"
          />
          {renderMonthPicker()}
        </div>
      </div>

      {/* Year */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-green-800">รายปี</label>
        <div className="relative" ref={yearPickerRef}>
          <input
            type="text"
            readOnly
            value={selectYear ? `${selectYear}` : ""}
            onClick={() => setShowYearPicker(!showYearPicker)}
            placeholder="เลือกปี"
            className="w-full border rounded p-2 text-black cursor-pointer bg-white"
          />
          {renderYearPicker()}
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleConfirm}
          className="bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800"
        >
          ตกลง
        </button>
      </div>
    </div>
  );
}

export default EnforcementReportFunction