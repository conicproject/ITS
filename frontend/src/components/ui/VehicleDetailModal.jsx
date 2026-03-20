import React from 'react';
import {
    FaTimes,
    FaCar,
    FaMapMarkerAlt,
    FaClock,
    FaTachometerAlt
} from 'react-icons/fa';

export const VehicleDetailModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const vehicleImage = data.image_path || data.target_sub_url;
    const plateImage = data.plate_pic_url;
    const clean = (v) => !v || v.toLowerCase?.() === "unknown" ? null : v;

    const detailSections = [
        {
            title: "ข้อมูลทะเบียนรถ",
            icon: <FaCar className="w-5 h-5" />,
            fields: [
                { label: "หมายเลขทะเบียน", value: clean(data.lpr) || clean(data.plate_no) || "-" },
                { label: "จังหวัด", value: data.province || data.plate_province },
                { label: "ประเภททะเบียน", value: data.plate_type },
                { label: "สีป้ายทะเบียน", value: data.plate_color },
            ]
        },
        {
            title: "ข้อมูลยานพาหนะ",
            icon: <FaCar className="w-5 h-5" />,
            fields: [
                { label: "ประเภทยานพาหนะ", value: data.type_nameth || data.type || data.vehicle_type },
                { label: "สียานพาหนะ", value: data.color || data.vehicle_color },
                { label: "ความยาวยานพาหนะ", value: data.vehicle_len ? `${data.vehicle_len} ม.` : null },
                { label: "โลโก้ยี่ห้อ", value: data.vehicle_logo },
                { label: "รุ่นยานพาหนะ", value: data.vehicle_model },
            ]
        },
        {
            title: "ข้อมูลการผ่าน",
            icon: <FaClock className="w-5 h-5" />,
            fields: [
                { label: "วันที่-เวลา", value: data.date || data.pass_time },
                { label: "ความเร็ว", value: data.speed || (data.vehicle_speed ? `${data.vehicle_speed} km/h` : null) },
                { label: "สถานะ", value: data.status },
            ]
        },
        {
            title: "ข้อมูลจุดติดตั้ง",
            icon: <FaMapMarkerAlt className="w-5 h-5" />,
            fields: [
                { label: "กล้อง", value: data.camera || `CAM-${data.crossing_id}` },
                { label: "รหัสจุดติดตั้ง", value: data.crossing_index_code },
                { label: "ทิศทาง", value: data.location || data.direction_index },
                { label: "เลนที่", value: data.lane || data.lane_no },
                { label: "รหัสพื้นที่", value: data.area_code },
            ]
        },
        {
            title: "ข้อมูลระบบ",
            icon: <FaTachometerAlt className="w-5 h-5" />,
            fields: [
                { label: "PASS ID", value: data.id || data.pass_id },
                { label: "แหล่งข้อมูล", value: data.data_sources },
                { label: "สถานะยานพาหนะ", value: data.vehicle_state },
                { label: "เวลาบันทึก", value: data.storage_time },
            ]
        }
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[50]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">
                                รายละเอียดยานพาหนะ
                            </h2>
                            <p className="text-green-100 text-sm mt-1">
                                ทะเบียน: {data.lpr || data.plate_no || "ไม่ทราบ"}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="hover:bg-white/30 rounded-full p-2 transition-colors"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">

                        {/* ================== รูปภาพ ================== */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* รูปรถ */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                    ภาพรถ
                                </h3>
                                {vehicleImage ? (
                                    <a
                                        href={vehicleImage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={vehicleImage}
                                            alt="vehicle"
                                            className="w-full h-[300px] object-cover rounded border cursor-pointer hover:opacity-80 transition"
                                        />
                                    </a>
                                ) : (
                                    <div className="h-[320px] flex items-center justify-center bg-gray-100 text-gray-500 rounded">
                                        ไม่พบรูปภาพรถ
                                    </div>
                                )}
                            </div>

                            {/* รูปป้ายทะเบียน */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                    ภาพป้ายทะเบียน
                                </h3>
                                {plateImage ? (
                                    <a
                                        href={plateImage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={plateImage}
                                            alt="plate"
                                            className="w-full h-[300px] object-cover rounded border cursor-pointer hover:opacity-80 transition"
                                        />
                                    </a>
                                ) : (
                                    <div className="h-[320px] flex items-center justify-center bg-gray-100 text-gray-500 rounded">
                                        ไม่พบภาพป้ายทะเบียน
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* ================== ข้อมูล ================== */}
                        <div className="space-y-6">
                            {detailSections.map((section, idx) => (
                                <div
                                    key={idx}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex items-center gap-2 text-green-700 font-semibold mb-4 pb-2 border-b border-gray-200">
                                        {section.icon}
                                        <span>{section.title}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {section.fields.map((field, fieldIdx) => (
                                            field.value && (
                                                <div key={fieldIdx} className="flex flex-col">
                                                    <span className="text-xs text-gray-500 mb-1">
                                                        {field.label}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {field.value}
                                                    </span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};
