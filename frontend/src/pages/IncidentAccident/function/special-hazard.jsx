// frontend/src/pages/IncidentAccident/function/special-hazard.jsx
import React, { useState } from "react";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";

// Import IncidentStats เพื่อใช้แสดง Card สถิติให้คำนวณอัตโนมัติ
import IncidentStats from "../../../components/ui/IncidentStats";
// Import Icon สำหรับจุดบนแผนที่และ Hotspots
import RelateAccidentIcon from "../../../components/ui/Icon_Incident/relate-accident"; 

function SpecialHazard() {
  const [currentPage, setCurrentPage] = useState(1);
  const mapCenter = [13.7563, 100.5018];

  // ดึงข้อมูล "อันตรายพิเศษ" (หมวด HZ) จาก Dashboard มาทั้งหมด 6 เคส
  const incidentData = [
    {
      id: "HZ-2025001",
      type: "อันตรายพิเศษ",
      category: "อันตราย", // เพิ่ม category เพื่อให้ตารางรู้หมวดหมู่และแสดงสี/Icon ให้ถูกต้อง
      subtype: "fire",
      location: "ชุมชนใกล้ถนนพระราม 3",
      datetime: "2025-02-03 13:10:00",
      severity: "High",
      status: "New",
      displayStatus: "New", // ระบุสถานะสำหรับแสดงผลในตาราง
      cctv: true,
      lat: 13.697,
      lng: 100.531,
      vehicle: "-",
    },
    {
      id: "HZ-2025002",
      type: "อันตรายพิเศษ",
      category: "อันตราย",
      subtype: "chemical",
      location: "ถ.กาญจนาภิเษก ช่วงคลังสินค้า",
      datetime: "2025-02-03 14:00:00",
      severity: "High",
      status: "In Progress",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.702,
      lng: 100.412,
      vehicle: "Truck เหลือง (80-xxxx)",
    },
    {
      id: "HZ-2025003",
      type: "อันตรายพิเศษ",
      category: "อันตราย",
      subtype: "smoke",
      location: "อุโมงค์ดินแดง (กลุ่มควันหนาแน่น)",
      datetime: "2025-02-03 15:45:00",
      severity: "Medium",
      status: "Verified",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.762,
      lng: 100.551,
      vehicle: "-",
    },
    {
      id: "HZ-2025004",
      type: "อันตรายพิเศษ",
      category: "อันตราย",
      subtype: "fire",
      location: "โกดังสินค้า ราษฎร์บูรณะ",
      datetime: "2025-02-03 19:45:00",
      severity: "High",
      status: "New",
      displayStatus: "New",
      cctv: true,
      lat: 13.682,
      lng: 100.505,
      vehicle: "-",
    },
    {
      id: "HZ-2025005",
      type: "อันตรายพิเศษ",
      category: "อันตราย",
      subtype: "smoke",
      location: "ถ.กิ่งแก้ว",
      datetime: "2025-02-03 22:15:00",
      severity: "Medium",
      status: "Verified",
      displayStatus: "In-Process",
      cctv: false,
      lat: 13.655,
      lng: 100.685,
      vehicle: "-",
    },
    {
      id: "HZ-2025006",
      type: "อันตรายพิเศษ",
      category: "อันตราย",
      subtype: "chemical",
      location: "ท่าเรือคลองเตย",
      datetime: "2025-02-04 01:00:00",
      severity: "High",
      status: "Verified",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.708,
      lng: 100.575,
      vehicle: "-",
    },
  ];

  const [incidents] = useState(incidentData);

  // ปรับ Hotspots ให้สอดคล้องกับสถานที่ในข้อมูลอันตรายพิเศษ
  const hotspots = [
    {
      rank: 1,
      name: "ชุมชนพระราม 3",
      location: "พื้นที่หนาแน่น / โรงงาน",
      time: "เหตุเกิดบ่อย: อัคคีภัย",
      incidents: "สถิติ: 3 เคส/เดือน",
      updated: "10 นาทีที่แล้ว",
      icon: <RelateAccidentIcon variant="fire" size={24} />,
    },
    {
      rank: 2,
      name: "ท่าเรือคลองเตย",
      location: "เขตคลังสินค้า",
      time: "เหตุเกิดบ่อย: สารเคมีรั่วไหล",
      incidents: "สถิติ: 2 เคส/เดือน",
      updated: "1 ชม. ที่แล้ว",
      icon: <RelateAccidentIcon variant="chemical" size={24} />,
    },
  ];

  return (
    <div className="fix-function-page-y-auto bg-gray-50 p-6">
      <IncidentHeader
        title="เหตุการณ์อันตรายพิเศษ"
        subtitle="Hazardous Incidents"
        onExport={() => console.log("Export")}
        onAddIncident={() => console.log("Add Incident")}
      />

      {/* เรียกใช้ Component สถิติเหมือนหน้าอื่นๆ */}
      <IncidentStats incidents={incidents} />

      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 lg:col-span-8">
          <IncidentMap
            incidents={incidents}
            mapCenter={mapCenter}
            zoom={11}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <HotspotsPanel 
            title="จุดเสี่ยงอันตรายพิเศษ" 
            hotspots={hotspots} 
          />
        </div>
      </div>

      <div className="mt-6">
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

export default SpecialHazard;