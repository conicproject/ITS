import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ViolationList } from '../../../components/ui/ViolationList';
import { MapSidebar } from '../../../components/ui/MapSidebar';
import { FaTimes, FaFilter, FaChevronUp, FaChevronDown, FaSync, FaCircle } from 'react-icons/fa';
import axios from 'axios';

const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 นาที ตาม scheduler

/**
 * แปลง alert จาก API → format ที่ ViolationList / MapSidebar รับได้
 */
const mapAlertToViolation = (alert) => ({
  lpr: alert.plate_no,
  camera: alert.checkpoint || '-',
  type: alert.type || 'ไม่ระบุ',
  time: alert.pass_time
    ? new Date(alert.pass_time).toLocaleString('th-TH', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      })
    : '-',
  status: 'สูง',
  location: alert.checkpoint || '-',
  detail: alert.note || `สีรถ: ${alert.color || '-'}`,
  position:
    alert.latitude && alert.longtitude
      ? [parseFloat(alert.latitude), parseFloat(alert.longtitude)]
      : [13.7563, 100.5018], // default กรุงเทพฯ
  // เก็บ raw ไว้ใช้ใน MapSidebar
  _raw: alert,
});

const EnforcementBlacklist = () => {
  const [violations, setViolations] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const [countdown, setCountdown] = useState(300); // วินาที

  // --- ดึงข้อมูลจาก API ---
  const fetchBlacklist = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token'); // ปรับให้ตรงกับ auth ของโปรเจค
      const res = await axios.post(
        '/api/check_blacklist_5m',
        { minutes: 5 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const alerts = res.data?.alerts ?? [];
      setViolations(alerts.map(mapAlertToViolation));
      setLastUpdated(new Date());
      setCountdown(300); // reset countdown
    } catch (err) {
      console.error('Fetch blacklist error:', err);
      setError('ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Auto-refresh ทุก 5 นาที ---
  useEffect(() => {
    fetchBlacklist();

    timerRef.current = setInterval(() => fetchBlacklist(false), POLL_INTERVAL_MS);

    // countdown ทุกวินาที
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 300 : prev - 1));
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [fetchBlacklist]);

  // ล็อค scroll บนมือถือเมื่อเปิด modal
  useEffect(() => {
    if (selectedViolation && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedViolation]);

  // --- Filter ---
  const handleSearch = (filters) => {
    // ถ้ามี Filter component ส่ง filters มา → กรองใน client
    // (ข้อมูล source ยังอยู่ใน violations ที่ดึงมาล่าสุด)
  };

  // --- Map data ---
  const getMapData = (violation) => {
    if (!violation) return {};
    const raw = violation._raw || {};
    return {
      plateNumber: violation.lpr,
      province: raw.province || '-',
      violationCount: '-',
      status: 'บัญชีดำ (Blacklist)',
      reason: violation.detail,
      latestCamera: violation.camera,
      latestTime: violation.time,
      latestLocation: violation.location,
      position: violation.position,
      plateUrl: raw.plate_url,
      imageUrl: raw.image_url,
    };
  };

  const formatCountdown = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full h-screen relative font-sans overflow-y-auto overflow-x-hidden pb-10">

      {/* MOBILE MODAL */}
      {selectedViolation && (
        <div className="fixed inset-0 z-[100] lg:hidden flex flex-col items-end justify-end sm:items-center sm:justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedViolation(null)}
          />
          <div className="relative w-full h-[90vh] sm:h-[85vh] sm:w-[90%] sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b shrink-0 bg-white">
              <h3 className="font-bold text-gray-800 text-lg">รายละเอียดบัญชีดำ</h3>
              <button
                onClick={() => setSelectedViolation(null)}
                className="p-2 rounded-full border border-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative bg-gray-50">
              <MapSidebar data={getMapData(selectedViolation)} enableSequence={true} />
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="w-full mx-auto p-4 md:p-6 max-w-[1600px]">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3 text-red-600">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-[3px] border-red-600 flex items-center justify-center shrink-0 shadow-sm bg-white">
              <span className="text-sm font-black">!</span>
            </div>
            <h1 className="text-lg md:text-2xl font-black text-gray-800 tracking-tight">ตรวจสอบบัญชีดำ</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Status pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-xl shadow-sm text-xs text-gray-500">
              <FaCircle className={`text-[8px] ${loading ? 'text-yellow-400 animate-pulse' : 'text-green-400'}`} />
              <span>
                {loading
                  ? 'กำลังโหลด...'
                  : lastUpdated
                  ? `อัปเดต ${lastUpdated.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`
                  : '-'}
              </span>
              {!loading && (
                <span className="text-gray-400 font-mono">{formatCountdown(countdown)}</span>
              )}
            </div>

            {/* Manual refresh */}
            <button
              onClick={() => fetchBlacklist()}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 active:scale-95 transition-all disabled:opacity-50"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">รีเฟรช</span>
            </button>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl shadow-sm text-sm font-bold active:scale-95 transition-all text-gray-600 hover:text-blue-600 hover:border-blue-200"
            >
              <FaFilter className={showFilter ? 'text-blue-600' : 'text-gray-400'} />
              <span>{showFilter ? 'ซ่อน' : 'ตัวกรอง'}</span>
              {showFilter ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => fetchBlacklist()} className="underline font-bold ml-4">ลองใหม่</button>
          </div>
        )}

        {/* Layout */}
        <div className="flex gap-5 md:gap-8 items-start relative z-0">

          {/* Left: List */}
          <div className="flex-1 min-w-0">
            {loading && violations.length === 0 ? (
              // Skeleton
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : violations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🛡️</div>
                <p className="font-bold text-lg">ไม่พบรถบัญชีดำใน 5 นาทีที่ผ่านมา</p>
                <p className="text-sm mt-1">ระบบจะตรวจสอบอัตโนมัติทุก 5 นาที</p>
              </div>
            ) : (
              <ViolationList
                title="รายการเฝ้าระวังล่าสุด"
                violations={violations}
                type="blacklist"
                timeRange={`5 นาทีล่าสุด (${violations.length} รายการ)`}
                onRowClick={setSelectedViolation}
              />
            )}
          </div>

          {/* Right: Sidebar (Desktop) */}
          <div className="hidden lg:block flex-none w-[400px] xl:w-[500px] 2xl:w-[600px] sticky top-6 h-[calc(100vh-3rem)]">
            <MapSidebar
              data={getMapData(selectedViolation || violations[0] || null)}
              enableSequence={true}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnforcementBlacklist;