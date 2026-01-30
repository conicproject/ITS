// frontend/src/pages/DataCollection/function/license-plate-search.jsx
import React, { useEffect, useState } from "react";
import { Filter } from "../../../components/ui/Filter";
import { ViolationList } from "../../../components/ui/ViolationList";
import { VehicleDetailModal } from "../../../components/ui/VehicleDetailModal";
import apiClient from "../../../service/client";

function LicensePlateSearch() {
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchInfo, setSearchInfo] = useState(null);
    
    // 🔹 Modal state
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 🔹 โหลดครั้งแรก
    useEffect(() => {
        fetchViolations({ date: "today" });
    }, []);

    // 🔹 map backend → UI (เก็บข้อมูลทั้งหมด)
    const mapToViolation = (row) => ({
        ...row, // เก็บข้อมูลดิบทั้งหมด
        id: row.pass_id,
        lpr: row.plate_no || "ไม่ทราบทะเบียน",
        camera: `CAM-${row.crossing_id}`,
        crossing_id: row.crossing_id,
        type: row.vehicle_type || "-",
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
        status: row.vehicle_speed && row.vehicle_speed > 60 ? "สูง" : "ปกติ",
        location: row.direction_index || "-",
        speed: row.vehicle_speed ? `${row.vehicle_speed} km/h` : "-",
        province: row.plate_province || "-",
        color: row.vehicle_color || "-",
        lane: row.lane_no || "-",
    });

    const fetchViolations = async (payload) => {
        try {
            setLoading(true);
            setError(null);
            console.log("📤 REQUEST:", payload);

            const res = await apiClient.post(
                "/api/data_search_vehicle",
                payload
            );

            console.log("📥 RESPONSE:", res.data);

            if (res.data.status !== "success") {
                throw new Error("API returned non-success status");
            }

            const rawData = Array.isArray(res.data?.data)
                ? res.data.data
                : [];

            const mapped = rawData.map(mapToViolation);

            setViolations(mapped);
            setSearchInfo({
                count: res.data.count || 0,
                filters: res.data.filters || {},
            });

            if (mapped.length === 0) {
                setError("ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา");
            }
        } catch (err) {
            console.error("❌ API ERROR:", err);
            setError(
                err.response?.data?.detail ||
                    "เกิดข้อผิดพลาดในการค้นหาข้อมูล"
            );
            setViolations([]);
            setSearchInfo(null);
        } finally {
            setLoading(false);
        }
    };
  };

    const handleSearch = (params) => {
        console.log("🔍 SEARCH PARAMS:", params);

        const payload = {
            date: params?.date || "today",
        };

        if (params?.plate) {
            payload.plate_no = params.plate;
        }
        if (params?.location) {
            payload.camera = params.location;
        }
        if (params?.vehicleType) {
            payload.vehicle_type = params.vehicleType;
        }

        fetchViolations(payload);
    };

    // 🔹 ฟังก์ชันเปิด Modal
    const handleRowClick = (vehicle) => {
        console.log("🔍 Selected vehicle:", vehicle);
        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    };

    // 🔹 ฟังก์ชันปิด Modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVehicle(null);
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
                        ระบบค้นหาข้อมูลยานพาหนะ
                    </span>
                </div>

                {/* Filter */}
                <Filter type="license" onSearch={handleSearch} />

                {/* Search Info */}
                {searchInfo && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">
                            พบข้อมูล {searchInfo.count} รายการ
                            {searchInfo.filters.plate_no &&
                                ` | ทะเบียน: ${searchInfo.filters.plate_no}`}
                            {searchInfo.filters.camera &&
                                ` | กล้อง: ${searchInfo.filters.camera}`}
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1">
                    <div className="col-span-1">
                        <ViolationList
                            title={
                                loading
                                    ? "กำลังโหลด..."
                                    : `รายการทั้งหมด`
                            }
                            violations={violations}
                            type="lprsearch"
                            loading={loading}
                            onRowClick={handleRowClick}
                        />
                    </div>
                </div>
            </div>

            {/* 🔹 Modal แสดงรายละเอียด */}
            <VehicleDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                data={selectedVehicle}
            />
        </div>
      );

export default LicensePlateSearch;
