// frontend/src/pages/IncidentAccident/function/road-obstruction.jsx
import React, { useState, useMemo } from "react";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";

// Import IncidentStats เพื่อใช้แสดง Card สถิติเหมือนหน้า Dashboard
import IncidentStats from "../../../components/ui/IncidentStats";
// Import Icon สำหรับจุดบนแผนที่
import RelateAccidentIcon from "../../../components/ui/Icon_Incident/relate-accident"; 

function RoadObstruction() {
  const [currentPage, setCurrentPage] = useState(1);
  const mapCenter = [13.7563, 100.5018];

  // ดึงข้อมูล "สิ่งกีดขวาง" (หมวด OB) และเพิ่ม category เพื่อให้ตารางแสดงไอคอนสีเหลือง
  const incidentData = [
    {
      id: "OB-2025001",
      type: "สิ่งกีดขวาง",
      category: "สิ่งกีดขวาง", // <-- ตัวกำหนดสี/Icon ในตาราง
      subtype: "debris",
      location: "ถนนพระราม 4 หน้าสวนลุมพินี",
      datetime: "2025-02-03 07:45:00",
      severity: "Low",
      status: "Verified",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.729,
      lng: 100.541,
      vehicle: "-", 
    },
    {
      id: "OB-2025002",
      type: "สิ่งกีดขวาง",
      category: "สิ่งกีดขวาง",
      subtype: "natural",
      location: "ถนนสุขุมวิท ซอย 24 (ต้นไม้ล้มขวางทาง)",
      datetime: "2025-02-03 11:20:00",
      severity: "Medium",
      status: "In Progress",
      displayStatus: "In-Process",
      cctv: false,
      lat: 13.731,
      lng: 100.565,
      vehicle: "-",
    },
    {
      id: "OB-2025003",
      type: "สิ่งกีดขวาง",
      category: "สิ่งกีดขวาง",
      subtype: "collapse",
      location: "เขตก่อสร้างรถไฟฟ้า ถนนลาดพร้าว",
      datetime: "2025-02-03 12:00:00",
      severity: "High",
      status: "New",
      displayStatus: "New",
      cctv: true,
      lat: 13.785,
      lng: 100.585,
      vehicle: "-",
    },
    {
      id: "OB-2025004",
      type: "สิ่งกีดขวาง",
      category: "สิ่งกีดขวาง",
      subtype: "debris",
      location: "ถ.บรมราชชนนี",
      datetime: "2025-02-03 18:30:00",
      severity: "Low",
      status: "Verified",
      displayStatus: "In-Process",
      cctv: false,
      lat: 13.785,
      lng: 100.456,
      vehicle: "-",
    },
    {
      id: "OB-2025005",
      type: "สิ่งกีดขวาง",
      category: "สิ่งกีดขวาง",
      subtype: "natural",
      location: "ถนนนครอินทร์",
      datetime: "2025-02-03 21:00:00",
      severity: "Low",
      status: "Verified",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.827,
      lng: 100.46,
      vehicle: "-",
    },
    {
      id: "OB-2025006",
      type: "สิ่งกีดขวาง",
      category: "สิ่งกีดขวาง",
      subtype: "collapse",
      location: "ถ.ประชาชื่น",
      datetime: "2025-02-03 23:30:00",
      severity: "High",
      status: "New",
      displayStatus: "New",
      cctv: true,
      lat: 13.82,
      lng: 100.538,
      vehicle: "-",
    },
  ];

  const [incidents] = useState(incidentData);

  // เตรียมข้อมูล Marker สำหรับแผนที่
  const incidentMarkers = useMemo(() => {
    return incidents.map((item) => ({
      id: item.id,
      position: [item.lat, item.lng],
      type: item.subtype,
      title: item.location,
      icon: <RelateAccidentIcon variant={item.subtype} size={32} />,
    }));
  }, [incidents]);

  // ปรับ Hotspots ให้สอดคล้องกับสถานที่
  const hotspots = [
    {
      rank: 1,
      name: "ถนนลาดพร้าว",
      location: "เขตก่อสร้างรถไฟฟ้า",
      time: "กีดขวางบ่อย: แบริเออร์ล้ม/วัสดุหล่น",
      incidents: "สถิติ: 12 เคส/เดือน",
      updated: "10 นาทีที่แล้ว",
      icon: <RelateAccidentIcon variant="collapse" size={24} />,
    },
    {
      rank: 2,
      name: "ถนนพระราม 4",
      location: "หน้าสวนลุมพินี",
      time: "กีดขวางบ่อย: เศษวัสดุตกหล่น",
      incidents: "สถิติ: 5 เคส/เดือน",
      updated: "1 ชม. ที่แล้ว",
      icon: <RelateAccidentIcon variant="debris" size={24} />,
    },
  ];

  return (
    <div className="fix-function-page-y-auto p-6">
      <IncidentHeader
        title="สิ่งกีดขวางบนถนน"
        subtitle="Road Obstruction Management"
        onExport={() => console.log("Export")}
        onAddIncident={() => console.log("Add Incident")}
      />

      {/* ส่งข้อมูล incidents ไปคำนวณตัวเลขสถิติอัตโนมัติ */}
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
            title="จุดเสี่ยงสิ่งกีดขวางบ่อย" 
            hotspots={hotspots} 
          />
        </div>
      </div>

      <div className="mt-6">
        {/* ในกรณีของสิ่งกีดขวาง มักไม่มีรถคู่กรณี (vehicle = "-") สามารถซ่อนหรือแสดงคอลัมน์รถยนต์ก็ได้ */}
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

export default RoadObstruction;