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

const splitDateTime = (isoLike) => {
  if (!isoLike) return { date: "-", time: "-" };
  const d = new Date(isoLike);
  if (isNaN(d.getTime())) return { date: "-", time: isoLike };
  const date = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}`;
  const time = d.toTimeString().split(" ")[0];
  return { date, time };
};

const DetectParking = () => {
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);

  // เก็บ controller ของ request ล่าสุด เพื่อยกเลิก request เก่าที่ยังไม่ตอบกลับ
  // ป้องกัน race condition: filter เปลี่ยนเร็วๆ แล้ว response เก่ามาทีหลังทับผลลัพธ์ใหม่
  const abortControllerRef = React.useRef(null);
  const requestIdRef = React.useRef(0);

  const mapToViolation = (item) => {
    const { date, time } = splitDateTime(item.pass_time);
    return {
      lpr: item.plate_no ?? "-",
      camera: item.crossing_id ? String(item.crossing_id) : "-",
      installPoint: item.crossing_name_th ?? item.crossing_name ?? (item.crossing_id ? String(item.crossing_id) : "-"),
      direction: item.direction_th ?? (item.direction_index === 1 ? "ขาเข้า" : "ขาออก"),
      type: item.vehicle_type_th ?? item.vehicle_type ?? "-",
      date,
      time,
      status: item.alarm_type ?? "-",
      location: item.direction_index ?? "-",
      detail: "ไม่สวมหมวกนิรภัย",
      province: item.province_name_th ?? item.plate_province ?? "-",
      color: item.vehicle_color ?? "-",
      speed: item.vehicle_speed ?? null,
      plateImage: item.plate_image_url ?? null,
      snapshotImage: item.snapshot_image_url ?? null,
      roadImage: item.road_image_url ?? null,
      position:
        item.mobile_device_latitude && item.mobile_device_longitude
          ? [item.mobile_device_latitude, item.mobile_device_longitude]
          : [13.7563, 100.5018],
    };
  };

  // ─────────────────────────────────────────────────────────────
  // ดึงรายการฝ่าฝืน (ไม่สวมหมวกนิรภัย) จาก API จริง (/get_vehicle_alarm)
  // ─────────────────────────────────────────────────────────────
  const fetchHelmetViolations = async (filters = {}) => {
    // ยกเลิก request ก่อนหน้าที่ยังค้างอยู่ (ถ้ามี) ก่อนยิงอันใหม่
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // ตั้ง id ให้ request นี้ เพื่อเช็คตอน response กลับมาว่ายังเป็น request ล่าสุดอยู่ไหม
    const requestId = ++requestIdRef.current;

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
          alarm_type: "1625",
          crossing_id: filters.location?.length
            ? filters.location.map(Number)
            : null,
          vehicle_type: filters.vehicleType?.length ? filters.vehicleType : null,
          vehicle_color: filters.color?.length ? filters.color : null,
          start_date: startDate,
          end_date: endDate,
          limit: 50,
          offset: 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }
      );

      // ถ้าระหว่างที่รอ response มี request ใหม่กว่ายิงไปแล้ว ให้ทิ้งผลลัพธ์นี้ไป
      if (requestId !== requestIdRef.current) return;

      setViolations((data.data ?? []).map(mapToViolation));
    } catch (err) {
      // ถ้าเป็นการยกเลิกเอง (ถูก request ใหม่แทนที่) ไม่ต้องแสดง error หรือเคลียร์ผลลัพธ์
      if (axios.isCancel(err) || err.name === "CanceledError" || err.name === "AbortError") {
        return;
      }
      console.error("fetchHelmetViolations error:", err);
      if (requestId === requestIdRef.current) {
        setViolations([]);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchHelmetViolations();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      selectedViolation && window.innerWidth < 1024 ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedViolation]);

  const handleSearch = (filters) => fetchHelmetViolations(filters);

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
      latestTime: `${violation.date} ${violation.time} น.`,
      latestLocation: violation.installPoint,
      plateImage: violation.plateImage,
      snapshotImage: violation.snapshotImage,
      roadImage: violation.roadImage,
      position: violation.position,
    };
  };

  return (
    <div className="w-full h-screen relative font-sans overflow-y-auto overflow-x-hidden pb-10 bg-[#070b16]">
      {selectedViolation && (
        <div className="fixed inset-0 z-[100] lg:hidden flex flex-col items-end justify-end sm:items-center sm:justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedViolation(null)}
          />
          <div className="relative w-full h-[90vh] sm:h-[85vh] sm:w-[90%] sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b shrink-0">
              <h3 className="font-bold text-gray-800 text-lg">รายละเอียด</h3>
              <button
                onClick={() => setSelectedViolation(null)}
                className="p-2 rounded-full border border-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative bg-gray-50">
              <MapSidebar
                data={getMapData(selectedViolation)}
                showMap={false}
                title="รายละเอียดยานพาหนะ"
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full mx-auto p-4 md:p-6 max-w-[1600px]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-500">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-[3px] border-red-500 flex items-center justify-center shrink-0 shadow-sm bg-white/5">
              <span className="text-sm font-black">!</span>
            </div>
            <h1 className="text-lg md:text-2xl font-black text-white tracking-tight">
              การไม่สวมหมวกนิรภัย
            </h1>
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl shadow-sm text-sm font-bold text-white bg-white/5"
          >
            <FaFilter className={showFilter ? "text-sky-400" : "text-white/40"} />
            <span>{showFilter ? "ซ่อน" : "ตัวกรอง"}</span>
            {showFilter ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
          </button>
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${
          showFilter
            ? "max-h-[500px] opacity-100 mb-2"
            : "max-h-0 opacity-0 mb-0 lg:max-h-none lg:opacity-100 lg:mb-4 lg:overflow-visible"
        }`}>
          <Filter type="helmet" onSearch={handleSearch} dark />
        </div>

        <div className="flex gap-5 md:gap-8 items-start">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center items-center h-40 text-white/40">
                กำลังโหลด...
              </div>
            ) : (
              <ViolationList
                title="รายการตรวจพบล่าสุด"
                violations={violations}
                type="helmet"
                viewMode="table"
                dark
                selectedId={selectedViolation?.lpr}
                onRowClick={setSelectedViolation}
              />
            )}
          </div>
          <div className="hidden lg:block flex-none w-[400px] xl:w-[500px] 2xl:w-[600px] sticky top-6 h-[calc(100vh-3rem)]">
            <MapSidebar
              data={getMapData(selectedViolation || violations[0] || null)}
              showMap={false}
              title="รายละเอียดยานพาหนะ"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectParking;