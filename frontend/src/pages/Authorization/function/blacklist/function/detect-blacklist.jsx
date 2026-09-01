import React, { useEffect, useState } from "react";
import { Filter } from "../../../../../components/ui/Filter";
import { MapSidebar } from "../../../../../components/ui/MapSidebar";
import { FaTimes, FaFilter, FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import apiClient from "../../../../../service/client";

const PAGE_SIZE = 10;

// ผ่าน backend proxy แทนยิงตรงไปหา IP วงในของกล้อง
const proxied = (url) => (url ? `/api/image-proxy?url=${encodeURIComponent(url)}` : null);

function DetectBlacklist() {
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchInfo, setSearchInfo] = useState(null);

    const [selectedViolation, setSelectedViolation] = useState(null);
    const [showFilter, setShowFilter] = useState(false);

    // pagination state — server-side pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // เก็บ filter ล่าสุดไว้ เผื่อเปลี่ยนหน้าแล้วต้องยิง query ใหม่ด้วย filter เดิม
    const [lastPayload, setLastPayload] = useState({ date: "today" });

    // ─────────────────────────────────────────────────────────────
    // map backend (blacklists_passing) → UI
    // คอลัมน์จริงในตาราง: id, blacklist_id, pass_id, plate_url, image_url,
    // plate_no, province, checkpoint, latitude, longtitude, direction,
    // pass_time, type, color, rtsp_url, status
    // ─────────────────────────────────────────────────────────────
    const mapToViolation = (row) => {
        const lat = parseFloat(row.latitude);
        const lng = parseFloat(row.longtitude);

        return {
            ...row,
            id: row.id,
            lpr: row.plate_no || "ไม่ทราบทะเบียน",
            camera: row.checkpoint || "-",
            installPoint: row.checkpoint || "-",
            type: row.type || "-",
            date: row.pass_time
                ? new Date(row.pass_time).toLocaleString("th-TH", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                  })
                : "-",
            status: row.status || "-",
            location: row.direction || "-",
            province: row.province || "-",
            color: row.color || "-",
            plateImage: proxied(row.plate_url),
            snapshotImage: proxied(row.image_url),
            roadImage: null, // ไม่มีคอลัมน์เทียบเท่า target_sub_url ใน blacklists_passing
            position: !Number.isNaN(lat) && !Number.isNaN(lng) ? [lat, lng] : [13.7563, 100.5018],
        };
    };

    // ✅ ดึงข้อมูลเฉพาะหน้าที่ต้องแสดง — POST /api/data_search_blacklist
    const fetchViolations = async (payload, page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const finalPayload = {
                ...payload,
                page,
                page_size: PAGE_SIZE,
            };

            const res = await apiClient.post("/api/data_search_blacklist", finalPayload);

            if (res.data.status !== "success") {
                throw new Error("API returned non-success status");
            }

            const rawData = Array.isArray(res.data?.data) ? res.data.data : [];
            const mapped = rawData.map(mapToViolation);

            setViolations(mapped);
            setTotalCount(res.data.count || 0);
            setCurrentPage(page);
            setSearchInfo({
                count: res.data.count || 0,
                filters: res.data.filters || {},
            });

            if (mapped.length === 0) {
                setError("ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา");
            }
        } catch (err) {
            console.error("❌ API ERROR:", err);
            setError(err.response?.data?.detail || "เกิดข้อผิดพลาดในการค้นหาข้อมูล");
            setViolations([]);
            setTotalCount(0);
            setSearchInfo(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchViolations({ date: "today" }, 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        document.body.style.overflow =
            selectedViolation && window.innerWidth < 1024 ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [selectedViolation]);

    // Filter component ส่ง params มาเยอะกว่าที่ endpoint นี้รองรับ
    // (location/vehicleType/color ไม่มีในตาราง blacklists_passing) — ใช้แค่ plate + ช่วงวันที่
    const handleSearch = (params) => {
        const payload = {};

        // controller parse "today" หรือ "YYYY-MM-DD" — ต้องส่ง "today" เป็นค่า default เสมอ
        payload.date = params?.startDate ? params.startDate.slice(0, 10) : "today";
        if (params?.endDate) payload.end_date = params.endDate.slice(0, 10);

        if (params?.plate) payload.plate_no = params.plate;

        setLastPayload(payload);
        fetchViolations(payload, 1);
    };

    const getMapData = (violation) => {
        if (!violation) return {};
        return {
            plateNumber: violation.lpr,
            province: violation.province,
            vehicleType: violation.type,
            color: violation.color,
            status: violation.status,
            latestCamera: violation.camera,
            latestTime: violation.date,
            latestLocation: violation.installPoint,
            plateImage: violation.plateImage,
            snapshotImage: violation.snapshotImage,
            roadImage: violation.roadImage,
            position: violation.position,
        };
    };

    // ── pagination derived values ──
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const startIdx = (safePage - 1) * PAGE_SIZE;

    const pagedViolations = violations;

    const goToPage = (page) => {
        const clamped = Math.min(Math.max(1, page), totalPages);
        if (clamped === currentPage) return;
        fetchViolations(lastPayload, clamped);
    };

    return (
        <div className="w-full h-screen relative font-sans overflow-y-auto overflow-x-hidden pb-10 bg-[#070b16]">
            {/* Mobile detail overlay */}
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
                    <div className="flex items-center gap-3 text-green-500">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-[3px] border-green-500 flex items-center justify-center shrink-0 shadow-sm bg-white/5">
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 24 24"
                                className="w-4 h-4 md:w-5 md:h-5"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm5 2h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm1-6h4v4h-4V5zM3 20a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6zm2-5h4v4H5v-4zm8 5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6zm2-5h4v4h-4v-4z"></path>
                            </svg>
                        </div>
                        <h1 className="text-lg md:text-2xl font-black text-white tracking-tight">
                            ระบบค้นหาข้อมูลยานพาหนะ Blacklist
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

                <div
                    className={`transition-all duration-300 overflow-hidden ${
                        showFilter
                            ? "max-h-[500px] opacity-100 mb-2"
                            : "max-h-0 opacity-0 mb-0 lg:max-h-none lg:opacity-100 lg:mb-4 lg:overflow-visible"
                    }`}
                >
                    <Filter type="license" onSearch={handleSearch} dark />
                </div>

                {searchInfo && (
                    <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3 mb-4">
                        <p className="text-sm text-sky-300">
                            พบข้อมูล {searchInfo.count} รายการ
                            {searchInfo.filters.plate_no && ` | ทะเบียน: ${searchInfo.filters.plate_no}`}
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <div className="flex gap-5 md:gap-8 items-start">
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className="flex justify-center items-center h-40 text-white/40">
                                กำลังโหลด...
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-white/10 bg-white/[.03] overflow-hidden">
                                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-white">
                                        รายการทั้งหมด ({totalCount} รายการ)
                                    </h2>
                                    {totalCount > 0 && (
                                        <span className="text-xs text-white/40">
                                            หน้า {safePage} / {totalPages}
                                        </span>
                                    )}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="text-[rgba(220,234,255,.5)] text-xs uppercase border-b border-white/10">
                                                <th className="px-4 py-3 font-medium">ทะเบียน</th>
                                                <th className="px-4 py-3 font-medium">ประเภท</th>
                                                <th className="px-4 py-3 font-medium">สี</th>
                                                <th className="px-4 py-3 font-medium">จุดตรวจ</th>
                                                <th className="px-4 py-3 font-medium">ทิศทาง</th>
                                                <th className="px-4 py-3 font-medium">สถานะ</th>
                                                <th className="px-4 py-3 font-medium">วันที่/เวลา</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pagedViolations.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-4 py-8 text-center text-white/30">
                                                        ไม่พบข้อมูล
                                                    </td>
                                                </tr>
                                            ) : (
                                                pagedViolations.map((v) => (
                                                    <tr
                                                        key={v.id}
                                                        onClick={() => setSelectedViolation(v)}
                                                        className={`border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${
                                                            selectedViolation?.id === v.id ? "bg-sky-500/10" : ""
                                                        }`}
                                                    >
                                                        <td className="px-4 py-3 text-white font-medium">{v.lpr}</td>
                                                        <td className="px-4 py-3 text-white/70">{v.type}</td>
                                                        <td className="px-4 py-3 text-white/70">{v.color}</td>
                                                        <td className="px-4 py-3 text-white/70">{v.camera}</td>
                                                        <td className="px-4 py-3 text-white/70">{v.location}</td>
                                                        <td className="px-4 py-3 text-white/70">{v.status}</td>
                                                        <td className="px-4 py-3 text-white/70 whitespace-nowrap">{v.date}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination controls */}
                                {totalCount > PAGE_SIZE && (
                                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                                        <span className="text-xs text-white/40">
                                            แสดง {startIdx + 1}-{Math.min(startIdx + PAGE_SIZE, totalCount)} จาก {totalCount} รายการ
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => goToPage(safePage - 1)}
                                                disabled={safePage === 1}
                                                className="p-2 rounded-lg border border-white/10 text-white/60 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                                            >
                                                <FaChevronLeft size={12} />
                                            </button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .filter((p) => {
                                                    return (
                                                        p === 1 ||
                                                        p === totalPages ||
                                                        Math.abs(p - safePage) <= 1
                                                    );
                                                })
                                                .reduce((acc, p, idx, arr) => {
                                                    if (idx > 0 && p - arr[idx - 1] > 1) {
                                                        acc.push("ellipsis-" + p);
                                                    }
                                                    acc.push(p);
                                                    return acc;
                                                }, [])
                                                .map((p) =>
                                                    typeof p === "string" ? (
                                                        <span key={p} className="px-2 text-white/30 text-xs">
                                                            …
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={p}
                                                            onClick={() => goToPage(p)}
                                                            className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-colors ${
                                                                p === safePage
                                                                    ? "bg-sky-500 text-white"
                                                                    : "text-white/60 border border-white/10 hover:bg-white/5"
                                                            }`}
                                                        >
                                                            {p}
                                                        </button>
                                                    )
                                                )}

                                            <button
                                                onClick={() => goToPage(safePage + 1)}
                                                disabled={safePage === totalPages}
                                                className="p-2 rounded-lg border border-white/10 text-white/60 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                                            >
                                                <FaChevronRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="hidden lg:block flex-none w-[400px] xl:w-[500px] 2xl:w-[600px] sticky top-6 h-[calc(100vh-3rem)]">
                        <MapSidebar
                            data={getMapData(selectedViolation || pagedViolations[0] || null)}
                            showMap={false}
                            title="รายละเอียดยานพาหนะ"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetectBlacklist;