import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip as LeafletTooltip } from 'react-leaflet';
import { FaMapMarkerAlt, FaVideo, FaHistory, FaExclamationTriangle, FaCar, FaCamera, FaRoute, FaCheckCircle } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Fix Leaflet Icon ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEFAULT_DATA = {
    plateNumber: "1กก-2345",
    province: "กรุงเทพมหานคร", 
    violationCount: 0,
    status: "ปกติ",
    reason: "-",
    latestCamera: "-",
    latestTime: "-",
    latestLocation: "-",
    position: [13.7763, 100.5718] 
};

// เพิ่ม prop: enableSequence (Default = false)
export const MapSidebar = ({ data = DEFAULT_DATA, enableSequence = false }) => {
  const { 
    plateNumber, 
    province,
    violationCount, 
    status, 
    reason, 
    latestCamera, 
    latestTime, 
    latestLocation, 
    position 
  } = { ...DEFAULT_DATA, ...data };

  const [showSequence, setShowSequence] = useState(false);

  const isGreenList = status.includes('Green List') && !status.includes('No');
  
  const alertTheme = isGreenList ? {
      bg: 'bg-green-50 border-green-100',
      textHead: 'text-green-700',
      textBody: 'text-green-600',
      icon: <FaCheckCircle className="text-green-500 w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />,
  } : {
      bg: 'bg-red-50 border-red-100',
      textHead: 'text-red-600',
      textBody: 'text-red-400',
      icon: <FaExclamationTriangle className="text-red-500 w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />,
  };

  // --- Mock Sequence Data (เหมือนเดิม) ---
  const sequencePath = [
    [13.8282, 100.5699],
    [13.8150, 100.5720],
    [13.8033, 100.5746],
    [13.7900, 100.5735],
    [13.7763, 100.5718]
  ];

  const mapCenter = (enableSequence && showSequence) 
    ? [13.8020, 100.5720]
    : position;

  const mapZoom = (enableSequence && showSequence) ? 13 : 15;

  return (
    <div className="flex flex-col h-full bg-white md:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-x md:border border-gray-100 overflow-hidden font-sans w-full">
      
      {/* Header */}
      <div className="px-3 py-2 md:px-6 md:py-4 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                <FaCar className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
                <h2 className="text-sm md:text-base font-bold text-gray-800 leading-tight truncate">ข้อมูลยานพาหนะ</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] text-gray-500 font-medium tracking-wide">Live Tracking</span>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-5 space-y-3 md:space-y-6 bg-gray-50/30">
        
        {/* Map Section */}
        <div className="relative group rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white shrink-0">
            <div className="h-[160px] md:h-[220px] w-full relative z-0">
                <MapContainer 
                    key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
                    center={mapCenter} 
                    zoom={mapZoom} 
                    style={{ height: '100%', width: '100%' }} 
                    scrollWheelZoom={false} 
                    zoomControl={false} 
                    dragging={true}
                >
                    <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={position}><Popup>{latestLocation}</Popup></Marker>

                    {/* แสดง Sequence เฉพาะเมื่อ enableSequence=true และ showSequence=true */}
                    {enableSequence && showSequence && (
                        <>
                            <Polyline 
                                positions={sequencePath} 
                                pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.8, lineCap: 'round', lineJoin: 'round' }} 
                            />
                            {sequencePath.slice(0, sequencePath.length - 1).map((pos, index) => (
                                <CircleMarker 
                                    key={index}
                                    center={pos} 
                                    radius={6}
                                    pathOptions={{ color: '#2563eb', fillColor: 'white', fillOpacity: 1, weight: 2 }}
                                >
                                    <LeafletTooltip direction="top" permanent className="sequence-tooltip font-bold text-blue-600 text-[10px] !bg-white/90 !border-blue-100 !shadow-sm !px-1.5 !py-0.5 !rounded-md">
                                        {index === 0 ? 'Start' : index + 1}
                                    </LeafletTooltip>
                                </CircleMarker>
                            ))}
                        </>
                    )}

                </MapContainer>
            </div>
            
            <div className="absolute top-2 left-2 md:top-3 md:left-3 z-[400] bg-white/95 backdrop-blur-md pl-2 pr-2 py-1 md:pr-3 md:py-1.5 rounded-lg shadow-lg border border-gray-100 flex items-center gap-2 max-w-[85%]">
                <div className="bg-red-50 p-1 rounded-lg text-red-500 shrink-0"><FaMapMarkerAlt className="w-3 h-3" /></div>
                <div className="min-w-0"><div className="text-[10px] md:text-xs font-bold text-gray-800 leading-none truncate">{latestLocation}</div></div>
            </div>

            {/* ปุ่ม Sequence: แสดงเฉพาะเมื่อ enableSequence เป็น true เท่านั้น */}
            {enableSequence && (
                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 z-[400] flex flex-col gap-2">
                    <button 
                        onClick={() => setShowSequence(!showSequence)}
                        className={`p-2 rounded-lg shadow-md transition-all flex items-center justify-center border ${
                            showSequence 
                            ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-200' 
                            : 'bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-white'
                        }`}
                        title={showSequence ? "ซ่อนเส้นทาง" : "แสดงเส้นทางย้อนหลัง"}
                    >
                        <FaRoute className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>

        {/* Info Grid & Timeline ... (ส่วนล่างเหมือนเดิม) ... */}
        {/* ... (ย่อโค้ดส่วนแสดงผลข้อมูลอื่นๆ เพื่อความกระชับ) ... */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 shrink-0">
            <div className="space-y-2 md:space-y-3">
                <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isGreenList ? 'from-green-500 to-emerald-500' : 'from-red-500 to-orange-500'}`}></div>
                    <label className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase mb-1 md:mb-2 block">ทะเบียนที่ตรวจจับได้</label>
                    <div className="inline-block border-2 border-black rounded-lg px-4 py-1.5 md:px-6 md:py-2 bg-white shadow-inner max-w-full">
                        <span className="text-xl md:text-3xl font-black text-gray-900 block leading-none truncate">{plateNumber}</span>
                        <span className="text-[10px] md:text-xs font-bold text-gray-600 block mt-1 truncate">{province}</span>
                    </div>
                </div>

                <div className={`${alertTheme.bg} rounded-xl p-2.5 md:p-3 border flex items-start gap-2.5 md:gap-3`}>
                    {alertTheme.icon}
                    <div className="min-w-0">
                        <div className={`text-xs font-bold ${alertTheme.textHead} mb-0.5`}>สถานะ: {status}</div>
                        <p className={`text-[10px] md:text-[11px] ${alertTheme.textBody} leading-relaxed break-words`}>
                            {reason} 
                            {!isGreenList && <span className="font-bold underline ml-1">{violationCount > 0 ? `(ประวัติ ${violationCount} ครั้ง)` : ''}</span>}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-md relative h-[140px] md:h-auto lg:h-full flex flex-col border border-gray-700">
                 <div className="absolute top-0 w-full p-2 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
                        <span className="text-[9px] font-mono text-white/90 tracking-widest">LIVE</span>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center bg-black/80">
                    <div className="text-center">
                         <FaVideo className="text-white/20 w-6 h-6 mx-auto mb-1" />
                         <div className="text-[9px] text-white/30 font-mono">NO SIGNAL</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 shrink-0 pb-6"> 
            <div className="flex items-center gap-2 mb-3">
                <FaHistory className="text-gray-400 w-3.5 h-3.5" />
                <h3 className="text-xs font-bold text-gray-700 uppercase">ไทม์ไลน์</h3>
            </div>
            <div className="relative border-l-2 border-dashed border-gray-200 ml-1.5 space-y-6 pl-5 py-1">
                {/* Timeline Logic: แสดงเพิ่มเมื่อเปิด Sequence */}
                {enableSequence && showSequence && (
                    <>
                        <div className="relative opacity-40">
                            <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 bg-gray-300 rounded-full border-2 border-white text-[8px] flex items-center justify-center font-bold text-white shadow-sm">1</div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">แยกรัชโยธิน</span>
                                <div className="text-xs font-bold text-gray-800">14:05 น.</div>
                            </div>
                        </div>
                        <div className="relative opacity-60">
                            <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 bg-gray-400 rounded-full border-2 border-white text-[8px] flex items-center justify-center font-bold text-white shadow-sm">2</div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">แยกรัชดา-ลาดพร้าว</span>
                                <div className="text-xs font-bold text-gray-800">14:15 น.</div>
                            </div>
                        </div>
                        <div className="relative opacity-80">
                            <div className="absolute -left-[27px] top-1 w-2.5 h-2.5 bg-blue-400 rounded-full border-2 border-white text-[8px] flex items-center justify-center font-bold text-white shadow-sm">3</div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">แยกสุทธิสาร</span>
                                <div className="text-xs font-bold text-gray-800">14:20 น.</div>
                            </div>
                        </div>
                    </>
                )}

                <div className="relative">
                    <div className={`absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ring-1 ${isGreenList ? 'bg-green-500 ring-green-100' : 'bg-red-500 ring-red-100'}`}></div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">ตรวจพบล่าสุด</span>
                        <div className="text-sm font-bold text-gray-800">{latestTime}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                            <FaCamera className="w-3 h-3 text-gray-400" />
                            <span className="truncate">{latestCamera}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};