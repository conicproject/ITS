import React, { useState, useEffect } from "react";
import { Filter } from "../../../components/ui/Filter";
import { ViolationList } from "../../../components/ui/ViolationList";
import { MapSidebar } from "../../../components/ui/MapSidebar";
import { FaTimes, FaFilter, FaChevronUp, FaChevronDown } from "react-icons/fa";
import axios from "axios";

const getTodayRange = () => {
  const today = new Date().toISOString().split("T")[0];
  return {
    startDate: `${today}T00:00:00`,
    endDate: `${today}T23:59:59`,
  };
};

const DetectParking = () => {
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);

  const mapToViolation = (item) => ({
    lpr: item.plate_no ?? "-",
    camera: item.crossing_id ? String(item.crossing_id) : "-",
    type: item.vehicle_type_th ?? item.vehicle_type ?? "-",
    time: item.pass_time ?? "-",
    status: item.alarm_type ?? "-",
    location: item.direction_index ?? "-",
    detail: "หยุดรถในที่ห้ามจอด",
    province: item.province_name_th ?? item.plate_province ?? "-",
    color: item.vehicle_color ?? "-",
    speed: item.vehicle_speed ?? null,
    position:
      item.mobile_device_latitude && item.mobile_device_longitude
        ? [item.mobile_device_latitude, item.mobile_device_longitude]
        : [13.7563, 100.5018],
  });

  const fetchParkingViolations = async (filters = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { startDate, endDate } = filters.startDate
        ? filters
        : getTodayRange();

      const { data } = await axios.post(
        "/api/get_vehicle_alarm",
        {
          plate_no: filters.plate || null,
          alarm_type: "1628",
          crossing_id: filters.location ? Number(filters.location) : null,
          start_date: startDate,
          end_date: endDate,
          limit: 50,
          offset: 0,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setViolations((data.data ?? []).map(mapToViolation));
    } catch (err) {
      console.error("fetchParkingViolations error:", err);
      setViolations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParkingViolations(); }, []);

  useEffect(() => {
    document.body.style.overflow =
      selectedViolation && window.innerWidth < 1024 ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedViolation]);

  const handleSearch = (filters) => fetchParkingViolations(filters);

  const getMapData = (violation) => {
    if (!violation) return {};
    return {
      plateNumber: violation.lpr,
      province: violation.province,
      vehicleType: violation.type,
      color: violation.color,
      status: violation.status,
      reason: violation.detail,
      latestCamera: violation.camera,
      latestTime: violation.time,
      latestLocation: violation.location,
      position: violation.position,
    };
  };

  return (
    <div className="w-full h-screen bg-gray-50 relative font-sans overflow-y-auto overflow-x-hidden pb-10">
      {selectedViolation && (
        <div className="fixed inset-0 z-[100] lg:hidden flex flex-col items-end justify-end sm:items-center sm:justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedViolation(null)}
          />
          <div className="relative w-full h-[90vh] sm:h-[85vh] sm:w-[90%] sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b shrink-0 bg-white">
              <h3 className="font-bold text-gray-800 text-lg">รายละเอียด</h3>
              <button
                onClick={() => setSelectedViolation(null)}
                className="p-2 bg-gray-50 rounded-full border border-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative bg-gray-50">
              <MapSidebar data={getMapData(selectedViolation)} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full mx-auto p-4 md:p-6 max-w-[1600px]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-600">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-[3px] border-red-600 flex items-center justify-center shrink-0 shadow-sm bg-white">
              <span className="text-sm font-black">!</span>
            </div>
            <h1 className="text-lg md:text-2xl font-black text-gray-800 tracking-tight">
              ตรวจจับการหยุดรถในที่ห้ามจอด
            </h1>
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-600"
          >
            <FaFilter className={showFilter ? "text-blue-600" : "text-gray-400"} />
            <span>{showFilter ? "ซ่อน" : "ตัวกรอง"}</span>
            {showFilter ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
          </button>
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${
          showFilter
            ? "max-h-[500px] opacity-100 mb-2"
            : "max-h-0 opacity-0 mb-0 lg:max-h-none lg:opacity-100 lg:mb-4 lg:overflow-visible"
        }`}>
          <Filter type="parking" onSearch={handleSearch} />
        </div>

        <div className="flex gap-5 md:gap-8 items-start">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center items-center h-40 text-gray-400">
                กำลังโหลด...
              </div>
            ) : (
              <ViolationList
                title="รายการล่าสุด"
                violations={violations}
                timeRange="วันนี้ (Real-time)"
                onRowClick={setSelectedViolation}
              />
            )}
          </div>
          <div className="hidden lg:block flex-none w-[400px] xl:w-[500px] 2xl:w-[600px] sticky top-6 h-[calc(100vh-3rem)]">
            <MapSidebar data={getMapData(selectedViolation || violations[0] || null)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectParking;