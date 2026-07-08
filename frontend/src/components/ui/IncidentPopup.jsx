import React from "react";
import { Popup } from "react-leaflet";
import { FaVideo, FaCamera } from "react-icons/fa";

const IncidentPopup = ({ incident }) => {
  // 1. ฟังก์ชันเลือกสี Badge ตามความรุนแรง
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "Critical": return "bg-red-700 text-white";
      case "High": return "bg-red-500 text-white";
      case "Medium": return "bg-orange-400 text-white";
      case "Low": return "bg-blue-400 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  // 2. ฟังก์ชันเลือกสีข้อความสถานะ
  const getStatusColor = (status) => {
    if (status === "New") return "text-red-600 font-bold animate-pulse";
    if (status === "Verified") return "text-green-600 font-bold";
    if (status === "Closed") return "text-gray-500";
    return "text-blue-600";
  };

  // 3. (จำลอง) สร้าง URL ภาพโดยอิงจาก ID เพื่อให้ภาพไม่ซ้ำกัน
  // ในระบบจริง: ใช้ incident.imageUrl ที่มาจาก Database
  const mockImageUrl = `https://picsum.photos/seed/${incident.id}/300/160`;

  return (
    <Popup className="custom-popup-style">
      <div className="font-sans min-w-[240px] p-0 overflow-hidden">
        
        {/* --- ส่วนที่เพิ่ม: ภาพ CCTV / Live View --- */}
        {incident.cctv ? (
          <div className="relative w-full h-[140px] bg-black group">
            <img 
              src={mockImageUrl} 
              alt="CCTV" 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
            />
            {/* Overlay: LIVE Badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white backdrop-blur-sm border border-white/20">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-bold tracking-wider">LIVE</span>
            </div>
            {/* Overlay: Camera ID */}
            <div className="absolute bottom-1 right-2 text-[8px] text-white/80 font-mono">
              CAM-{incident.id.split('-')[1]} • {new Date().toLocaleTimeString()}
            </div>
          </div>
        ) : (
          // กรณีไม่มี CCTV แสดงเป็นแถบสีแทน
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
        )}

        <div className="p-3">
          {/* ส่วนหัว: ID และ Severity */}
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <span className="font-bold text-lg text-slate-800 flex items-center gap-2">
              {incident.id}
              {incident.cctv && <FaVideo className="text-gray-400 text-xs" title="CCTV Available" />}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full shadow-sm ${getSeverityBadge(incident.severity)}`}>
              {incident.severity || "Normal"}
            </span>
          </div>

          {/* รายละเอียด */}
          <div className="space-y-2 text-sm text-gray-700">
            
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">ประเภทเหตุการณ์</span>
              <span className="font-medium text-gray-800">
                {incident.type} 
                {incident.subtype && <span className="text-xs text-gray-500 ml-1">({incident.subtype})</span>}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">สถานที่</span>
              <span className="truncate" title={incident.location}>{incident.location}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">เวลาแจ้งเหตุ</span>
              <span className="font-mono text-xs">{incident.datetime}</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
               <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">สถานะ:</span>
               <span className={`text-xs ${getStatusColor(incident.status)}`}>
                 {incident.status}
               </span>
            </div>

            {/* ข้อมูลยานพาหนะ */}
            {(incident.brand && incident.brand !== "-" || incident.plate && incident.plate !== "-") && (
              <div className="mt-2 pt-2 border-t border-dashed border-gray-300 bg-gray-50 p-2 rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">ยานพาหนะคู่กรณี</span>
                </div>
                <div className="text-xs text-gray-800 flex flex-col">
                  <span className="font-medium">{incident.brand !== "-" ? incident.brand : ""} {incident.color !== "-" ? incident.color : ""}</span>
                  {incident.plate !== "-" && (
                    <span className="font-mono border border-gray-200 px-1.5 py-0.5 rounded w-fit mt-1 text-gray-600 shadow-sm text-[10px]">
                      {incident.plate}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default IncidentPopup;