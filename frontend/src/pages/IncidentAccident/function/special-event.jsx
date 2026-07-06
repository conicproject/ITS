// frontend/src/pages/IncidentAccident/function/special-event.jsx
import React, { useState } from "react";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";

// Import IncidentStats เพื่อใช้แสดง Card สถิติให้คำนวณอัตโนมัติ
import IncidentStats from "../../../components/ui/IncidentStats";
// Import Icon สำหรับจุดบนแผนที่และ Hotspots
import RelateAccidentIcon from "../../../components/ui/Icon_Incident/relate-accident"; 

function SpecialEvent() {
  const [currentPage, setCurrentPage] = useState(1);
  const mapCenter = [13.7563, 100.5018];

  // ข้อมูลจำลองสำหรับ "กิจกรรมพิเศษ" (หมวด SE)
  const incidentData = [
    {
      id: "SE-2025001",
      type: "กิจกรรมพิเศษ",
      category: "กิจกรรมพิเศษ", // ระบุ category สำหรับให้ตารางดึงสี/Icon
      subtype: "festival",
      location: "สนามหลวง (งานเทศกาลประเพณี)",
      datetime: "2025-02-03 18:00:00",
      severity: "Medium",
      status: "Verified",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.7552,
      lng: 100.4931,
      vehicle: "-",
    },
    {
      id: "SE-2025002",
      type: "กิจกรรมพิเศษ",
      category: "กิจกรรมพิเศษ",
      subtype: "marathon",
      location: "รอบสวนลุมพินี (งานวิ่งมาราธอน)",
      datetime: "2025-02-04 04:30:00",
      severity: "High",
      status: "In Progress",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.7310,
      lng: 100.5415,
      vehicle: "-",
    },
    {
      id: "SE-2025003",
      type: "กิจกรรมพิเศษ",
      category: "กิจกรรมพิเศษ",
      subtype: "concert",
      location: "สนามกีฬาหัวหมาก (คอนเสิร์ตใหญ่)",
      datetime: "2025-02-05 16:00:00",
      severity: "Medium",
      status: "New",
      displayStatus: "New",
      cctv: true,
      lat: 13.7553,
      lng: 100.6225,
      vehicle: "-",
    },
    {
      id: "SE-2025004",
      type: "กิจกรรมพิเศษ",
      category: "กิจกรรมพิเศษ",
      subtype: "protest",
      location: "ถนนราชดำเนิน (การชุมนุม)",
      datetime: "2025-02-03 14:00:00",
      severity: "High",
      status: "Verified",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.7568,
      lng: 100.5019,
      vehicle: "-",
    },
    {
      id: "SE-2025005",
      type: "กิจกรรมพิเศษ",
      category: "กิจกรรมพิเศษ",
      subtype: "event",
      location: "ถนนสีลม (ปิดถนนจัดกิจกรรมคนเดิน)",
      datetime: "2025-02-08 17:00:00",
      severity: "Low",
      status: "New",
      displayStatus: "New",
      cctv: true,
      lat: 13.7270,
      lng: 100.5330,
      vehicle: "-",
    },
    {
      id: "SE-2025006",
      type: "กิจกรรมพิเศษ",
      category: "กิจกรรมพิเศษ",
      subtype: "event",
      location: "ศูนย์ประชุมสิริกิติ์ (งานจัดแสดงสินค้า)",
      datetime: "2025-02-06 09:00:00",
      severity: "Low",
      status: "Verified",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.7235,
      lng: 100.5583,
      vehicle: "-",
    },
  ];

  const [incidents] = useState(incidentData);

  // ปรับ Hotspots ให้เข้ากับพื้นที่ที่มีการจัดกิจกรรมบ่อย
  const hotspots = [
    {
      rank: 1,
      name: "รอบสวนลุมพินี",
      location: "เขตพื้นที่จัดกิจกรรม",
      time: "กิจกรรมบ่อย: งานวิ่ง/งานเดิน",
      incidents: "สถิติ: 4 กิจกรรม/เดือน",
      updated: "10 นาทีที่แล้ว",
      icon: <RelateAccidentIcon variant="event" size={24} />,
    },
    {
      rank: 2,
      name: "ถนนราชดำเนิน",
      location: "ลานกิจกรรม / พื้นที่สาธารณะ",
      time: "กิจกรรมบ่อย: กระทบการจราจร",
      incidents: "สถิติ: 2 กิจกรรม/เดือน",
      updated: "1 ชม. ที่แล้ว",
      icon: <RelateAccidentIcon variant="event" size={24} />,
    },
  ];

  return (
    <div className="fix-function-page-y-auto p-6 min-h-screen flex flex-col">
      <IncidentHeader
        title="เหตุการณ์พิเศษจากกิจกรรมมนุษย์"
        subtitle="Special Events & Human Activities"
        onExport={() => console.log("Export")}
        onAddIncident={() => console.log("Add Incident")}
      />

      <div className="mt-2 mb-6">
        {/* เรียกใช้ Component สถิติที่รับ Props ไปคำนวณ Auto */}
        <IncidentStats incidents={incidents} />
      </div>

      <div className="grid grid-cols-12 gap-6 mb-6 flex-grow">
        <div className="col-span-12 lg:col-span-8 h-full min-h-[400px]">
          <IncidentMap
            incidents={incidents}
            mapCenter={mapCenter}
            zoom={12}
          />
        </div>
        <div className="col-span-12 lg:col-span-4 h-full">
          <HotspotsPanel 
            title="พื้นที่จัดกิจกรรมบ่อย" 
            hotspots={hotspots} 
          />
        </div>
      </div>

      <div className="mt-auto">
        <IncidentTable
          incidents={incidents}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          showVehicleColumn={false}
        />
      </div>
    </div>
  );
}

export default SpecialEvent;