// frontend/src/components/ui/Filter.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  FaSearch, FaCalendar, FaChevronLeft, FaChevronRight, FaChevronDown,
  FaMapMarkerAlt, FaCarSide,
} from 'react-icons/fa';
import { FilterConfig } from '../../config/FilterConfig';
import axios from 'axios';

// สีสวอตช์สำหรับ dropdown "สียานพาหนะ" — map ชื่อสีภาษาไทย → hex
const COLOR_SWATCH = {
  "ขาว":   "#f8fafc",
  "ดำ":    "#111827",
  "แดง":   "#ef4444",
  "น้ำเงิน": "#3b82f6",
  "เขียว":  "#22c55e",
  "เหลือง": "#eab308",
  "เทา":   "#9ca3af",
  "ส้ม":   "#f97316",
  "น้ำตาล": "#92400e",
  "เงิน":  "#cbd5e1",
};

/**
 * ScrollbarStyle
 * สไตล์ scrollbar บางๆ โค้งมน ใช้กับ list ที่ scroll ได้ในไฟล์นี้ (คลาส .custom-scrollbar)
 */
const ScrollbarStyle = () => (
  <style>{`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(148, 163, 184, 0.35);
      border-radius: 9999px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: rgba(148, 163, 184, 0.55);
    }
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(148, 163, 184, 0.35) transparent;
    }
  `}</style>
);

/**
 * MultiSelectDropdown
 * Dropdown checklist ที่เลือกได้หลายรายการ พร้อมหัวข้อ "เลือกทั้งหมด" + ปุ่มล้างตัวเลือก
 * ใช้ร่วมกันสำหรับ จุดติดตั้ง / ประเภทยานพาหนะ / สียานพาหนะ
 */
const MultiSelectDropdown = ({ icon, allLabel, options, selected, onChange, dark, showSwatch = false }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const isAll = selected.length === 0;

  const toggleValue = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const clearAll = () => onChange([]);

  const buttonText =
    selected.length === 0
      ? allLabel
      : selected.length === 1
      ? options.find((o) => o.value === selected[0])?.label ?? allLabel
      : `เลือก ${selected.length} รายการ`;

  const control = dark
    ? "h-[46px] px-3.5 rounded-[11px] bg-white/5 border border-white/10 text-sm font-medium text-white " +
      "focus:outline-none focus:border-sky-400/50 transition-colors w-full flex items-center gap-2 cursor-pointer select-none"
    : "border border-gray-300 rounded px-3 py-2 text-sm flex items-center gap-2 w-full bg-white cursor-pointer select-none";

  return (
    <div className="relative" ref={wrapRef}>
      <button type="button" onClick={() => setOpen((o) => !o)} className={control}>
        {icon && <span className={dark ? "text-sky-400 shrink-0" : "text-gray-500 shrink-0"}>{icon}</span>}
        <span className={`flex-1 text-left truncate ${dark ? "text-white" : "text-gray-800"}`}>
          {buttonText}
        </span>
        <FaChevronDown className={dark ? "text-white/30 shrink-0" : "text-gray-400 shrink-0"} size={11} />
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 w-full min-w-[220px] rounded-2xl border shadow-2xl overflow-hidden ${
            dark ? "border-white/10 bg-[#0b1120]" : "border-gray-200 bg-white"
          }`}
        >
          <div className={`flex items-center justify-between px-4 py-3 border-b ${dark ? "border-white/10" : "border-gray-100"}`}>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isAll}
                onChange={clearAll}
                className="w-4 h-4 accent-sky-500 cursor-pointer"
              />
              <span className={`text-[13px] font-semibold ${dark ? "text-white" : "text-gray-800"}`}>
                {allLabel}
              </span>
            </label>
            <button
              type="button"
              onClick={clearAll}
              className="text-[12px] text-sky-400 hover:text-sky-300 transition-colors shrink-0"
            >
              ล้างตัวเลือก
            </button>
          </div>

          <div className="max-h-[260px] overflow-y-auto py-1 custom-scrollbar">
            {options.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors ${
                  dark ? "hover:bg-white/5" : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggleValue(opt.value)}
                  className="w-4 h-4 accent-sky-500 cursor-pointer"
                />
                {showSwatch && (
                  <span
                    className="w-3 h-3 rounded-full border shrink-0"
                    style={{
                      backgroundColor: COLOR_SWATCH[opt.label] ?? "#94a3b8",
                      borderColor: dark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.15)",
                    }}
                  />
                )}
                <span className={`text-[13px] ${dark ? "text-white" : "text-gray-800"}`}>
                  {opt.label}
                </span>
              </label>
            ))}
            {options.length === 0 && (
              <div className={`px-4 py-3 text-[13px] ${dark ? "text-white/30" : "text-gray-400"}`}>
                ไม่มีตัวเลือก
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Date range picker — utils
// ─────────────────────────────────────────────────────────────
const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
const THAI_MONTHS_ABBR = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a, b) =>
  !!a && !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const pad2 = (n) => String(n).padStart(2, "0");
const toDateInputStr = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const formatShortThai = (d) => `${d.getDate()} ${THAI_MONTHS_ABBR[d.getMonth()]}`;
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const firstWeekdayOfMonth = (year, month) => new Date(year, month, 1).getDay();

/**
 * DateRangePicker
 * Dropdown calendar for choosing a start–end date range (Thai calendar labels, Buddhist year).
 * Selecting behaves like: 1st click starts a new range, 2nd click completes it,
 * next click after that starts a brand-new range again.
 */
const DateRangePicker = ({ start, end, onChange, dark }) => {
  const today = startOfDay(new Date());
  const [open, setOpen] = useState(false);
  const [picking, setPicking] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(start.getFullYear(), start.getMonth(), 1));
  const wrapRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const goMonth = (delta) => {
    setViewDate((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));
  };

  const handleDayClick = (day) => {
    if (day > today) return; // ไม่ให้เลือกอนาคต
    if (!picking) {
      onChange(day, day);
      setPicking(true);
    } else {
      if (day < start) {
        onChange(day, start);
      } else {
        onChange(start, day);
      }
      setPicking(false);
      setOpen(false); // เลือกครบช่วงแล้ว ปิด dropdown อัตโนมัติ
    }
  };

  const handleResetToday = () => {
    onChange(today, today);
    setPicking(false);
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const diffDays = Math.round((end - start) / 86400000) + 1;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const leadBlanks = firstWeekdayOfMonth(year, month);
  const cells = [
    ...Array.from({ length: leadBlanks }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const control =
    "h-[46px] px-3.5 rounded-[11px] bg-white/5 border border-white/10 text-sm font-medium text-white " +
    "focus:outline-none focus:border-sky-400/50 transition-colors w-full flex items-center gap-2 cursor-pointer select-none";

  return (
    <div className="relative" ref={wrapRef}>
      <button type="button" onClick={() => setOpen((o) => !o)} className={dark ? control : "border border-gray-300 rounded px-3 py-2 text-sm flex items-center gap-2 w-full min-w-[220px] bg-white"}>
        <FaCalendar className={dark ? "text-sky-400 shrink-0" : "text-gray-500 shrink-0"} size={14} />
        <span className={dark ? "text-white" : "text-gray-800"}>
          {formatShortThai(start)} – {formatShortThai(end)}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[340px] rounded-2xl border border-white/10 bg-[#0b1120] shadow-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-[15px]">
              {THAI_MONTHS[month]} {year + 543}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => goMonth(-1)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <FaChevronLeft size={11} />
              </button>
              <button
                type="button"
                onClick={() => goMonth(1)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <FaChevronRight size={11} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((w, i) => (
              <div key={i} className="text-center text-[12px] text-[rgba(220,234,255,.4)] py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, idx) => {
              if (day === null) return <div key={`b${idx}`} />;
              const dayDate = new Date(year, month, day);
              const isStart = isSameDay(dayDate, start);
              const isEnd = isSameDay(dayDate, end);
              const inRange = dayDate > start && dayDate < end;
              const isFuture = dayDate > today;

              let cellClass = "text-white hover:bg-white/10";
              if (isFuture) cellClass = "text-[rgba(220,234,255,.2)] cursor-not-allowed";
              else if (isStart || isEnd) cellClass = "bg-emerald-400 text-slate-900 font-bold";
              else if (inRange) cellClass = "bg-emerald-500/20 text-white";

              return (
                <div key={day} className="flex items-center justify-center">
                  <button
                    type="button"
                    disabled={isFuture}
                    onClick={() => handleDayClick(dayDate)}
                    className={`w-9 h-9 rounded-full text-[13px] flex items-center justify-center transition-colors ${cellClass}`}
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
            <span className="text-[12px] text-[rgba(220,234,255,.5)]">
              ช่วงที่เลือก {diffDays} วัน · เลือกใหม่ได้โดยคลิกวันเริ่มต้น
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetToday}
            className="mt-2 w-full text-center text-[13px] text-sky-400 hover:text-sky-300 transition-colors py-1"
          >
            รีเซ็ตเป็นวันนี้
          </button>
        </div>
      )}
    </div>
  );
};

export const Filter = ({ type = "license", onSearch, dark = false }) => {
  const config = FilterConfig[type] || {};
  const showPlate         = config.showPlate         ?? false;
  const showLocation      = config.showLocation      ?? false;
  const showVehicleType   = config.showVehicleType   ?? false;
  const showColor         = config.showColor         ?? false;
  const showViolationType = config.showViolationType ?? false;
  const showDateRange     = config.showDateRange     ?? false;

  const colorOptions = config.colorOptions ?? [];

  const today = startOfDay(new Date());
  const todayStr = toDateInputStr(today);

  const [plate,              setPlate]              = useState("");
  const [locationSelected,   setLocationSelected]    = useState([]);
  const [vehicleTypeSelected,setVehicleTypeSelected]  = useState([]);
  const [colorSelected,      setColorSelected]        = useState([]);
  const [violationType,      setViolationType]        = useState("");
  const [rangeStart,         setRangeStart]           = useState(today);
  const [rangeEnd,           setRangeEnd]             = useState(today);

  const handleRangeChange = (start, end) => {
    setRangeStart(start);
    setRangeEnd(end);
  };

  // ─────────────────────────────────────────────────────────────
  // ตัวเลือกที่ดึงจาก API จริง (จุดติดตั้ง / ประเภทยานพาหนะ)
  // ─────────────────────────────────────────────────────────────
  const [locationOptions, setLocationOptions] = useState([]);
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState(
    config.vehicleTypeOptions ?? []
  );

  useEffect(() => {
    if (!showLocation) return;
    const fetchCheckpoints = async () => {
      try {
        const { data } = await axios.get("/api/checkpoint");
        const list = Array.isArray(data) ? data : [];
        setLocationOptions(
          list.map((c) => ({
            value: c.name,
            label: c.nickname || c.name,
          }))
        );
      } catch (err) {
        console.error("fetchCheckpoints error:", err);
        setLocationOptions([]);
      }
    };
    fetchCheckpoints();
  }, [showLocation]);

  useEffect(() => {
    if (!showVehicleType) return;
    const fetchVehicleTypes = async () => {
      try {
        const { data } = await axios.get("/api/vehicle_type");
        const list = Array.isArray(data) ? data : [];
        setVehicleTypeOptions(
          list.map((v) => ({
            value: v.typeName,
            label: v.typeNameTh || v.typeName,
          }))
        );
      } catch (err) {
        console.error("fetchVehicleTypes error:", err);
        setVehicleTypeOptions(
          config.vehicleTypeOptions ?? [
            { value: "twoWheelVehicle", label: "รถจักรยานยนต์" },
            { value: "vehicle",         label: "รถยนต์" },
            { value: "SUVMPV",          label: "SUV / MPV" },
          ]
        );
      }
    };
    fetchVehicleTypes();
  }, [showVehicleType]);

  const buildSearchPayload = () => {
    const startDate = `${toDateInputStr(rangeStart)}T00:00:00`;
    const endDate   = `${toDateInputStr(rangeEnd)}T23:59:59`;
    return {
      plate,
      location: locationSelected,
      vehicleType: vehicleTypeSelected,
      color: colorSelected,
      violationType,
      startDate,
      endDate,
    };
  };

  // ─────────────────────────────────────────────────────────────
  // ยิง API อัตโนมัติทุกครั้งที่ filter เปลี่ยน (debounce กันยิงรัวตอนพิมพ์)
  // ─────────────────────────────────────────────────────────────
  const isFirstRun = useRef(true);
  const debounceRef = useRef(null);

  useEffect(() => {
    // ครั้งแรกที่ mount ให้ยิงทันทีไม่ต้องรอ debounce (โหลดข้อมูลเริ่มต้น)
    if (isFirstRun.current) {
      isFirstRun.current = false;
      onSearch?.(buildSearchPayload());
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch?.(buildSearchPayload());
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    plate,
    locationSelected,
    vehicleTypeSelected,
    colorSelected,
    violationType,
    rangeStart,
    rangeEnd,
  ]);

  /* ============================== DARK / BOXED VARIANT ============================== */
  if (dark) {
    const fieldWrap = "flex flex-col gap-[7px]";
    const label = "text-[13px] tracking-wide text-[rgba(220,234,255,.5)]";
    const control =
      "h-[46px] px-3.5 rounded-[11px] bg-white/5 border border-white/10 text-sm font-medium text-white " +
      "placeholder:text-[rgba(220,234,255,.35)] focus:outline-none focus:border-sky-400/50 transition-colors w-full";

    return (
      <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
        <ScrollbarStyle />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[18px]">
          {showPlate && (
            <div className={fieldWrap}>
              <span className={label}>{config.plateLabel ?? "ค้นหาป้ายทะเบียน"}</span>
              <div className="relative">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[rgba(220,234,255,.35)] pointer-events-none" size={12} />
                <input
                  type="text"
                  placeholder={config.placeholder ?? "ค้นหา"}
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  className={control + " pl-9"}
                />
              </div>
            </div>
          )}

          {showLocation && (
            <div className={fieldWrap}>
              <span className={label}>จุดติดตั้ง</span>
              <MultiSelectDropdown
                icon={<FaMapMarkerAlt size={13} />}
                allLabel={config.placeholderLocation ?? "ทุกจุด"}
                options={locationOptions}
                selected={locationSelected}
                onChange={setLocationSelected}
                dark
              />
            </div>
          )}

          {showVehicleType && (
            <div className={fieldWrap}>
              <span className={label}>ประเภทยานพาหนะ</span>
              <MultiSelectDropdown
                icon={<FaCarSide size={13} />}
                allLabel="ทุกประเภท"
                options={vehicleTypeOptions}
                selected={vehicleTypeSelected}
                onChange={setVehicleTypeSelected}
                dark
              />
            </div>
          )}

          {showColor && (
            <div className={fieldWrap}>
              <span className={label}>สียานพาหนะ</span>
              <MultiSelectDropdown
                icon={<span className="w-2.5 h-2.5 rounded-full bg-current inline-block" />}
                allLabel="ทุกสี"
                options={colorOptions}
                selected={colorSelected}
                onChange={setColorSelected}
                dark
                showSwatch
              />
            </div>
          )}

          {showDateRange && (
            <div className={fieldWrap}>
              <span className={label}>วันที่</span>
              <DateRangePicker start={rangeStart} end={rangeEnd} onChange={handleRangeChange} dark />
            </div>
          )}

          {showViolationType && (
            <div className={fieldWrap}>
              <span className={label}>ประเภทความผิด</span>
              <select
                value={violationType}
                onChange={(e) => setViolationType(e.target.value)}
                className={control}
              >
                <option value="" className="text-gray-900">เลือกประเภทความผิด</option>
                <option value="1625" className="text-gray-900">ตรวจจับไม่สวมหมวกนิรภัย (รถจักรยานยนต์)</option>
                <option value="1626" className="text-gray-900">ตรวจจับขับรถย้อนศร</option>
                <option value="1627" className="text-gray-900">ตรวจจับขับรถทับเส้นจราจร</option>
                <option value="1628" className="text-gray-900">ตรวจจับการหยุดรถในเขตห้ามหยุด</option>
              </select>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ============================== ORIGINAL LIGHT VARIANT ============================== */
  return (
    <div className="rounded-lg shadow-sm p-4 mb-4">
      <ScrollbarStyle />
      <div className="flex flex-wrap items-center gap-3 w-full">
        <FaSearch className="w-5 h-5 text-gray-500 flex-shrink-0" />

        {showDateRange && (
          <div className="flex-1 min-w-[220px]">
            <DateRangePicker start={rangeStart} end={rangeEnd} onChange={handleRangeChange} dark={false} />
          </div>
        )}

        {showPlate && (
          <input
            type="text"
            placeholder={config.placeholder ?? "ค้นหา"}
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[200px] focus:ring-2 focus:ring-green-500"
          />
        )}

        {showLocation && (
          <div className="flex-1 min-w-[200px]">
            <MultiSelectDropdown
              icon={<FaMapMarkerAlt size={13} />}
              allLabel={config.placeholderLocation ?? "ทุกจุด"}
              options={locationOptions}
              selected={locationSelected}
              onChange={setLocationSelected}
              dark={false}
            />
          </div>
        )}

        {showVehicleType && (
          <div className="flex-1 min-w-[200px]">
            <MultiSelectDropdown
              icon={<FaCarSide size={13} />}
              allLabel="เลือกประเภทยานพาหนะ"
              options={vehicleTypeOptions}
              selected={vehicleTypeSelected}
              onChange={setVehicleTypeSelected}
              dark={false}
            />
          </div>
        )}

        {showColor && (
          <div className="flex-1 min-w-[160px]">
            <MultiSelectDropdown
              icon={<span className="w-2.5 h-2.5 rounded-full bg-current inline-block" />}
              allLabel="เลือกสี"
              options={colorOptions}
              selected={colorSelected}
              onChange={setColorSelected}
              dark={false}
              showSwatch
            />
          </div>
        )}

        {showViolationType && (
          <select
            value={violationType}
            onChange={(e) => setViolationType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[220px] focus:ring-2 focus:ring-green-500"
          >
            <option value="">เลือกประเภทความผิด</option>
            <option value="1625">ตรวจจับไม่สวมหมวกนิรภัย (รถจักรยานยนต์)</option>
            <option value="1626">ตรวจจับขับรถย้อนศร</option>
            <option value="1627">ตรวจจับขับรถทับเส้นจราจร</option>
            <option value="1628">ตรวจจับการหยุดรถในเขตห้ามหยุด</option>
          </select>
        )}
      </div>
    </div>
  );
};