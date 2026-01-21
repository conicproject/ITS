// frontend/src/components/ui/Filter.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaCar, FaIdCard, FaCalendarAlt, FaUndoAlt, FaBuilding, FaRoad } from 'react-icons/fa'; 
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import 'react-day-picker/dist/style.css'; 
import { FilterConfig } from '../../config/FilterConfig';

const customStyles = `
  .rdp { 
    --rdp-cell-size: 40px; 
    --rdp-accent-color: #059669; 
    --rdp-background-color: #ecfdf5; 
    margin: 0;
  }
  .rdp-day_selected:not([disabled]) { 
    background-color: var(--rdp-accent-color); 
    color: white; 
    font-weight: bold; 
  }
  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { 
    background-color: var(--rdp-background-color); 
    color: var(--rdp-accent-color); 
  }
  .rdp-caption_label { font-size: 1rem; font-weight: 700; color: #1f2937; }
  .rdp-head_cell { font-size: 0.875rem; font-weight: 600; color: #6b7280; text-transform: uppercase; }
`;

export const Filter = ({ type = "license", onSearch, ...customProps }) => {
  const baseConfig = FilterConfig[type] || {};
  const config = { ...baseConfig, ...customProps };

  const { 
    // --- Existing Props ---
    showPlate = false, 
    showLocation = false, 
    showDistrict = false,
    showVehicleType = false, 
    showDateRange = false,
    
    // --- NEW: Route Analysis Props ---
    showRouteName = false,    // ช่องค้นหาชื่อเส้นทาง
    showOriginDest = false,   // คู่ Select ต้นทาง -> ปลายทาง

    placeholder = "ระบุเลขทะเบียน...",
    placeholderLocation = "ระบุจุดติดตั้ง...",
    placeholderRoute = "ค้นหาเส้นทาง...",
    
    plateColSpan = "md:col-span-6 lg:col-span-3",
    locationColSpan = "md:col-span-6 lg:col-span-3",
    districtColSpan = "md:col-span-6 lg:col-span-3",
    vehicleTypeColSpan = "md:col-span-4 lg:col-span-2",
    dateColSpan = "md:col-span-8 lg:col-span-3",
    
    // Default ColSpan สำหรับ Route Analysis
    routeNameColSpan = "md:col-span-4 lg:col-span-3",
    originDestColSpan = "md:col-span-8 lg:col-span-5"
  } = config;

  const [filterState, setFilterState] = useState({
    plate: "",
    location: "",
    district: "",
    vehicleType: "",
    // --- New State ---
    routeName: "",
    origin: "",
    destination: ""
  });

  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearch?.({
      ...filterState,
      startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : "",
      endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ""
    });
  };

  const handleReset = () => {
    setFilterState({ 
      plate: "", location: "", district: "", vehicleType: "",
      routeName: "", origin: "", destination: "" 
    });
    setDateRange({ from: new Date(), to: new Date() });
  };

  const getDateLabel = () => {
    if (dateRange?.from && dateRange?.to) {
        return `${format(dateRange.from, 'dd MMM yyyy', { locale: th })} - ${format(dateRange.to, 'dd MMM yyyy', { locale: th })}`;
    }
    if (dateRange?.from) {
        return format(dateRange.from, 'dd MMM yyyy', { locale: th });
    }
    return "เลือกช่วงเวลา";
  };

  const labelClass = "text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5 ml-1 flex items-center gap-1";
  const inputWrapperClass = "relative w-full group"; 
  const inputBaseClass = "w-full border border-gray-200 bg-gray-50/50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all duration-200 h-[44px] text-gray-700 font-medium shadow-sm cursor-pointer hover:border-green-300";
  const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 group-focus-within:text-green-600 transition-colors pointer-events-none";

  return (
    <>
    <style>{customStyles}</style>
    
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 mb-8 border border-gray-100 relative z-[50]">
      
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
            <div className="bg-green-100/50 p-2.5 rounded-xl border border-green-100">
                <FaSearch className="w-4 h-4 text-green-700" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-800">ค้นหาข้อมูล</h2>
                <p className="text-xs text-gray-500 mt-0.5">ระบบกรองข้อมูลจราจรอัจฉริยะ</p>
            </div>
        </div>
        
        <button 
            onClick={handleReset}
            className="text-gray-400 hover:text-red-500 text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5 font-medium"
        >
            <FaUndoAlt className="w-3 h-3" /> ล้างค่า
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
        
        {/* --- 1. Route Name Search (NEW) --- */}
        {showRouteName && (
           <div className={routeNameColSpan}>
               <label className={labelClass}><FaRoad className="w-3 h-3"/> ค้นหาเส้นทาง</label>
               <div className={inputWrapperClass}>
                   <FaSearch className={iconClass}/>
                   <input 
                     type="text"
                     className={`${inputBaseClass} cursor-text`} 
                     placeholder={placeholderRoute}
                     value={filterState.routeName}
                     onChange={(e) => setFilterState({...filterState, routeName: e.target.value})}
                   />
               </div>
           </div>
        )}

        {/* --- 2. Origin & Destination Pair (NEW) --- */}
        {showOriginDest && (
          <div className={originDestColSpan}>
             <label className={labelClass}><FaMapMarkerAlt className="w-3 h-3"/> ต้นทาง - ปลายทาง</label>
             <div className="flex items-center gap-2">
                 {/* Origin */}
                 <div className={inputWrapperClass}>
                     <FaMapMarkerAlt className={`${iconClass} text-blue-400`} />
                     <select 
                        value={filterState.origin}
                        onChange={(e) => setFilterState({...filterState, origin: e.target.value})}
                        className={`${inputBaseClass} appearance-none`}
                     >
                      <option value="">เลือกต้นทาง...</option>
                      <option value="รังสิต">รังสิต</option>
                      <option value="บางนา">บางนา</option>
                      <option value="สีลม">สีลม</option>
                     </select>
                </div>
                
                <span className="text-xs text-gray-400 font-medium px-1">ถึง</span>

                {/* Destination */}
                <div className={inputWrapperClass}>
                     <FaMapMarkerAlt className={`${iconClass} text-red-400`} />
                     <select 
                        value={filterState.destination}
                        onChange={(e) => setFilterState({...filterState, destination: e.target.value})}
                        className={`${inputBaseClass} appearance-none`}
                     >
                      <option value="">เลือกปลายทาง...</option>
                      <option value="อโศก">อโศก</option>
                      <option value="ตราด">ตราด</option>
                      <option value="พระราม6">พระราม 6</option>
                     </select>
                </div>
             </div>
          </div>
        )}

        {/* --- Existing: License Plate --- */}
        {showPlate && (
           <div className={plateColSpan}>
               <label className={labelClass}><FaIdCard className="w-3 h-3"/> ทะเบียนรถ</label>
               <div className={inputWrapperClass}>
                   <FaIdCard className={iconClass}/>
                   <input 
                     type="text"
                     className={`${inputBaseClass} cursor-text`} 
                     placeholder={placeholder}
                     value={filterState.plate}
                     onChange={(e) => setFilterState({...filterState, plate: e.target.value})}
                   />
               </div>
           </div>
        )}

        {/* --- Existing: Location --- */}
        {showLocation && (
           <div className={locationColSpan}>
               <label className={labelClass}><FaMapMarkerAlt className="w-3 h-3"/> จุดติดตั้ง</label>
               <div className={inputWrapperClass}>
                   <FaMapMarkerAlt className={iconClass}/>
                   <input 
                     type="text"
                     className={`${inputBaseClass} cursor-text`} 
                     placeholder={placeholderLocation}
                     value={filterState.location}
                     onChange={(e) => setFilterState({...filterState, location: e.target.value})}
                   />
               </div>
           </div>
        )}

        {/* --- Existing: District --- */}
        {showDistrict && (
          <div className={districtColSpan}>
             <label className={labelClass}><FaBuilding className="w-3 h-3" /> เขต/อำเภอ</label>
             <div className={inputWrapperClass}>
                 <FaBuilding className={iconClass} />
                 <select 
                    value={filterState.district}
                    onChange={(e) => setFilterState({...filterState, district: e.target.value})}
                    className={`${inputBaseClass} appearance-none`}
                 >
                  <option value="">ทุกเขตพื้นที่</option>
                  <option value="หลักสี่">เขตหลักสี่</option>
                  <option value="บางเขน">เขตบางเขน</option>
                  <option value="ปากเกร็ด">อ.ปากเกร็ด</option>
                 </select>
            </div>
          </div>
        )}

        {/* --- Existing: Vehicle Type --- */}
        {showVehicleType && (
          <div className={vehicleTypeColSpan}>
             <label className={labelClass}><FaCar className="w-3 h-3" /> ประเภท</label>
             <div className={inputWrapperClass}>
                 <FaCar className={iconClass} />
                 <select 
                    value={filterState.vehicleType}
                    onChange={(e) => setFilterState({...filterState, vehicleType: e.target.value})}
                    className={`${inputBaseClass} appearance-none`}
                 >
                  <option value="">ทั้งหมด</option>
                  <option value="truck">รถบรรทุก</option>
                  <option value="car">รถยนต์</option>
                  <option value="motorcycle">จยย.</option>
                 </select>
            </div>
          </div>
        )}

        {/* --- Date Range --- */}
        {showDateRange && (
          <div className={dateColSpan} ref={calendarRef}> 
             <label className={labelClass}><FaCalendarAlt className="w-3 h-3" /> ช่วงเวลา</label>
             
             <div className={inputWrapperClass}>
                 <FaCalendarAlt className={iconClass} />
                 <div 
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className={`${inputBaseClass} flex items-center justify-between select-none`}
                 >
                    <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                        <span className={`text-sm ${dateRange?.from ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                            {getDateLabel()}
                        </span>
                    </div>
                 </div>

                 {isCalendarOpen && (
                    <div className="absolute top-[110%] right-0 lg:right-0 z-[9999] bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 w-auto min-w-[320px] animate-in fade-in zoom-in-95 duration-200">
                        <DayPicker
                            mode="range"
                            defaultMonth={dateRange?.from || new Date()}
                            selected={dateRange}
                            onSelect={setDateRange}
                            locale={th}
                            numberOfMonths={1}
                            pagedNavigation
                            showOutsideDays
                            disabled={{ after: new Date() }}
                            footer={
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between gap-2 items-center">
                                    <span className="text-xs text-gray-400">
                                        {dateRange?.from && !dateRange?.to ? "เลือกวันสิ้นสุด..." : ""}
                                    </span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setIsCalendarOpen(false)}
                                            className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                        >
                                            ปิด
                                        </button>
                                        <button 
                                            onClick={() => { handleSearch(); setIsCalendarOpen(false); }}
                                            className="px-4 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition-colors font-bold"
                                        >
                                            ตกลง
                                        </button>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                 )}
             </div>
          </div>
        )}

        {/* --- Search Button --- */}
        <div className="md:col-span-12 lg:col-span-1 mt-2 lg:mt-0">
            <button
              onClick={handleSearch}
              className="w-full h-[44px] bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <FaSearch />
            </button>
        </div>

      </div>
    </div>
    </>
  );
};