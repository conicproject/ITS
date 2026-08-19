import React, { useState } from 'react';
import { FaMapMarkerAlt, FaImage, FaExclamationTriangle, FaCar, FaCamera, FaCheckCircle, FaPalette, FaClock } from 'react-icons/fa';

const DEFAULT_DATA = {
    plateNumber: "-",
    province: "-",
    brand: "-",
    model: "-",
    color: "-",
    vehicleType: "-",
    violationCount: 0,
    status: "-",
    reason: "-",
    latestCamera: "-",
    latestTime: "-",
    latestLocation: "-",
    snapshotImage: null,
    roadImage: null,
    plateImage: null,
};

// Dark theme palette
const THEME = {
    panelBg: '#0d1424',       // outer container background
    headerBg: '#0d1424',      // sticky header background
    cardBg: 'rgba(255,255,255,0.03)',     // inner cards (info grid, meta list)
    cardBorder: 'rgba(148,163,184,0.15)', // slate-400 @ 15%
    imageBoxBg: '#0a0f1c',
    plateBoxBg: 'rgba(15,23,42,0.6)',
};

// รูปภาพที่มีปัญหา (path ผิด, โหลดไม่ขึ้น, CORS ฯลฯ) จะ fallback มาเป็น placeholder
// แทนการปล่อยให้เห็นไอคอน "รูปแตก" ของเบราว์เซอร์
const ImageWithFallback = ({ src, alt, className, fallbackIcon, fallbackText }) => {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div className="text-center">
                {fallbackIcon}
                {fallbackText && (
                    <div className="text-[10px] text-white/25 font-mono mt-2">{fallbackText}</div>
                )}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setFailed(true)}
        />
    );
};

export const MapSidebar = ({ data = DEFAULT_DATA, title = "ข้อมูลยานพาหนะ" }) => {
    const {
        plateNumber, province, color, vehicleType,
        violationCount, status, reason, latestCamera, latestTime, latestLocation,
        snapshotImage, roadImage,
    } = { ...DEFAULT_DATA, ...data };

    // ไม่มีความผิดจริง (reason ว่าง / "-" / null) -> ใช้กรอบสีปกติ ไม่ใช่สีแดง
    const hasReason = !!reason && reason !== '-' && reason !== 'null';

    const isGreenList = status.includes('Green List') && !status.includes('No');

    const alertTheme = !hasReason ? {
        bg: 'bg-white/[.03] border-white/10',
        textHead: 'text-gray-300',
        textBody: 'text-gray-400',
        iconBg: 'bg-white/5',
        icon: <FaCheckCircle className="text-gray-400 w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />,
    } : isGreenList ? {
        bg: 'bg-green-950/40 border-green-900/50',
        textHead: 'text-green-400',
        textBody: 'text-green-400/70',
        iconBg: 'bg-green-500/10',
        icon: <FaCheckCircle className="text-green-400 w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />,
    } : {
        bg: 'bg-red-950/40 border-red-900/50',
        textHead: 'text-red-400',
        textBody: 'text-red-400/70',
        iconBg: 'bg-red-500/10',
        icon: <FaExclamationTriangle className="text-red-400 w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />,
    };

    return (
        <div
            className="flex flex-col h-auto md:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border-x md:border overflow-hidden font-sans w-full"
            style={{ backgroundColor: THEME.panelBg, borderColor: THEME.cardBorder }}
        >
            <div
                className="px-3 py-2 md:px-6 md:py-4 border-b flex justify-between items-center sticky top-0 z-20 shrink-0"
                style={{ backgroundColor: THEME.headerBg, borderColor: THEME.cardBorder }}
            >
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                        <FaCar className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <h2 className="text-sm md:text-base font-bold text-gray-100 leading-tight truncate">{title}</h2>
                </div>
            </div>

            <div
                className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-5 space-y-3 md:space-y-5"
                style={{ backgroundColor: THEME.panelBg }}
            >
                {/* Snapshot placeholder */}
                <div className="rounded-xl overflow-hidden shadow-sm border" style={{ borderColor: THEME.cardBorder }}>
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 flex items-center gap-1.5" style={{ backgroundColor: THEME.cardBg }}>
                        <FaCamera className="text-gray-500" size={11} /> ภาพ Snapshot · กล้องตรวจจับ
                    </div>
                    <div className="h-[180px] md:h-[220px] flex items-center justify-center" style={{ backgroundColor: THEME.imageBoxBg }}>
                        <ImageWithFallback
                            src={snapshotImage}
                            alt="snapshot"
                            className="w-full h-full object-cover"
                            fallbackIcon={<FaImage className="text-white/15 w-10 h-10 mx-auto mb-2" />}
                            fallbackText="ไม่พบภาพถ่ายที่ตรวจจับ"
                        />
                    </div>
                </div>

                {/* Road image + plate crop */}
                <div className="grid grid-cols-2 gap-3">
                    <div
                        className="rounded-xl overflow-hidden border h-[100px] flex items-center justify-center"
                        style={{ backgroundColor: THEME.imageBoxBg, borderColor: THEME.cardBorder }}
                    >
                        <ImageWithFallback
                            src={roadImage}
                            alt="road"
                            className="w-full h-full object-cover"
                            fallbackIcon={<FaMapMarkerAlt className="text-white/15 w-6 h-6" />}
                        />
                    </div>
                    <div
                        className="rounded-xl border flex flex-col items-center justify-center p-2"
                        style={{ backgroundColor: THEME.plateBoxBg, borderColor: THEME.cardBorder }}
                    >
                        <span className="text-[9px] text-gray-400 font-bold uppercase mb-1">ภาพป้ายทะเบียน (Crop)</span>
                        <div className="border-2 border-amber-500/50 rounded-lg px-4 py-1.5 text-center" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                            <span className="text-lg font-black block leading-none text-amber-400">{plateNumber}</span>
                            <span className="text-[10px] font-bold text-amber-200/70">{province}</span>
                        </div>
                    </div>
                </div>

                {/* Info grid */}
                <div
                    className="rounded-xl border shadow-sm p-4 grid grid-cols-2 gap-3"
                    style={{ backgroundColor: THEME.cardBg, borderColor: THEME.cardBorder }}
                >
                    <div><p className="text-[9px] text-gray-400 font-bold uppercase">ทะเบียน</p><p className="text-sm font-bold text-gray-100">{plateNumber}</p></div>
                    <div><p className="text-[9px] text-gray-400 font-bold uppercase">จังหวัด</p><p className="text-sm font-bold text-gray-100">{province}</p></div>
                    <div><p className="text-[9px] text-gray-400 font-bold uppercase">ประเภทรถ</p><p className="text-sm font-bold text-gray-100">{vehicleType}</p></div>
                    <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">สี</p>
                        <p className="text-sm font-bold text-gray-100 flex items-center gap-1.5">
                            <FaPalette className="text-orange-400" size={11} /> {color}
                        </p>
                    </div>
                </div>

                {/* Alert */}
                <div className={`${alertTheme.bg} rounded-xl p-4 border flex items-center gap-3 shadow-sm`}>
                    <div className={`p-2 rounded-full shrink-0 ${alertTheme.iconBg}`}>{alertTheme.icon}</div>
                    <div className="min-w-0 flex-1">
                        {hasReason ? (
                            <>
                                <div className={`text-sm font-bold ${alertTheme.textHead} mb-0.5`}>ประเภทการกระทำผิด: {reason}</div>
                                {!isGreenList && violationCount > 0 && (
                                    <p className={`text-xs ${alertTheme.textBody}`}>ประวัติ {violationCount} ครั้ง</p>
                                )}
                            </>
                        ) : (
                            <div className={`text-sm font-bold ${alertTheme.textHead} mb-0.5`}>ไม่พบประวัติการกระทำผิด</div>
                        )}
                    </div>
                </div>

                {/* Meta list */}
                <div
                    className="rounded-xl border shadow-sm p-4 space-y-3"
                    style={{ backgroundColor: THEME.cardBg, borderColor: THEME.cardBorder }}
                >
                    <div className="flex items-center gap-2.5">
                        <FaCamera className="text-gray-500 w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs text-gray-400">กล้องที่ตรวจจับ:</span>
                        <span className="text-xs font-bold text-gray-100">{latestCamera}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <FaClock className="text-gray-500 w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs text-gray-400">เวลาที่ตรวจจับ:</span>
                        <span className="text-xs font-bold text-gray-100">{latestTime}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <FaMapMarkerAlt className="text-gray-500 w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs text-gray-400">จุดตรวจจับ:</span>
                        <span className="text-xs font-bold text-gray-100">{latestLocation}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};