// frontend/src/pages/DataCollection/function/license-plate-search.jsx
import React, { useEffect, useState } from "react";
import { Filter } from "../../../components/ui/Filter";
import { ViolationList } from "../../../components/ui/ViolationList";
import { MapSidebar } from "../../../components/ui/MapSidebar";
import apiClient from "../../../service/client";

function LicensePlateSearch() {
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🔹 โหลดครั้งแรก
    useEffect(() => {
        fetchViolations({ date: "today" });
    }, []);

    // 🔹 map backend → UI
    const mapToViolation = (row) => ({
        lpr: row.plate_no || "ไม่ทราบทะเบียน",
        camera: `CAM-${row.crossing_id}`,
        type: row.vehicle_type || "-",
        date: row.pass_time
            ? new Date(row.pass_time).toLocaleString("th-TH")
            : "-",
        status: row.vehicle_speed > 60 ? "สูง" : "ปกติ",
        location: row.direction_index || "-",
        speed: row.vehicle_speed
            ? `${row.vehicle_speed} km/h`
            : "-",
    });

    const fetchViolations = async (payload) => {
        try {
            setLoading(true);
            console.log("📤 REQUEST:", payload);

            const res = await apiClient.post(
                "/api/data_search_vehicle",
                payload
            );

            console.log("📥 RESPONSE:", res.data);

            const rawData = Array.isArray(res.data?.data)
                ? res.data.data
                : [];

            const mapped = rawData.map(mapToViolation);

            setViolations(mapped);
        } catch (err) {
            console.error("❌ API ERROR:", err);
            setViolations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (params) => {
        console.log("🔍 SEARCH PARAMS:", params);

        fetchViolations({
            date: params?.date || "today",
            ...(params?.lpr && { plate_no: params.lpr }),
        });
    };

    const sidebarStats = {
        totalDays: 1,
        hasViolation: violations.length > 0,
        violations: violations.slice(0, 5).map((v) => ({
            camera: v.camera,
            datetime: v.date,
            type: "ฝ่าฝืนจราจร",
        })),
    };

    return (
        <div className="fix-function-page-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">

                {/* Header */}
                <div className="flex items-center gap-2 text-red-600 mb-4">
                    <div className="w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center">
                        <span className="text-xs">!</span>
                    </div>
                    <span className="text-sm">
                        ระบบตรวจจับการฝ่าสัญญาณไฟ
                    </span>
                </div>

                {/* Filter */}
                <Filter type="license" onSearch={handleSearch} />

                <div className="grid grid-cols">

                    {/* Main */}
                    <div className="col-span-2">
                        <ViolationList
                            title={loading ? "กำลังโหลด..." : "รายการ"}
                            violations={violations}
                            type="lprsearch"
                        />
                    </div>

                    {/* Sidebar */}
                    {/* <div>
                        <MapSidebar
                            cameraId={violations[0]?.camera || "CAM-002"}
                            position={[13.7563, 100.5018]}
                            stats={sidebarStats}
                        />
                    </div> */}

                </div>
            </div>
        </div>
    );
}

export default LicensePlateSearch;
