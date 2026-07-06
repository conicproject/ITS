// src/pages/IncidentAccident/function/irregularitie.jsx
import React, { useState } from "react";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";

// Import IncidentStats เพื่อใช้แสดง Card สถิติให้คำนวณอัตโนมัติ
import IncidentStats from "../../../components/ui/IncidentStats";
// Import Icon สำหรับจุดบนแผนที่และ Hotspots
import RelateAccidentIcon from "../../../components/ui/Icon_Incident/relate-accident"; 

function Irregularities() {
  const [currentPage, setCurrentPage] = useState(1);
  const mapCenter = [13.7563, 100.5018];

  // ดึงข้อมูล "ความผิดปกติ" (หมวด RG) จาก Dashboard มาทั้งหมด 6 เคส
  const incidentData = [
    {
      id: "RG-2025001",
      type: "ความผิดปกติ",
      category: "ความผิดปกติ", // เพิ่ม category เพื่อให้ตารางดึงสี/ไอคอนได้ถูก (หมวดสีส้ม)
      subtype: "road_work",
      location: "ถนนวิภาวดีรังสิต ขาออก กม. 18",
      datetime: "2025-02-03 22:00:00",
      severity: "Medium",
      status: "Verified",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.832,
      lng: 100.556,
      vehicle: "-",
    },
    {
      id: "RG-2025002",
      type: "ความผิดปกติ",
      category: "ความผิดปกติ",
      subtype: "traffic_light",
      location: "แยกอโศก-มนตรี",
      datetime: "2025-02-03 16:30:00",
      severity: "Medium",
      status: "In Progress",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.737,
      lng: 100.56,
      vehicle: "-",
    },
    {
      id: "RG-2025003",
      type: "ความผิดปกติ",
      category: "ความผิดปกติ",
      subtype: "breakdown",
      location: "บนสะพานพระราม 8 ขาเข้า",
      datetime: "2025-02-03 17:15:00",
      severity: "Low",
      status: "New",
      displayStatus: "New",
      cctv: true,
      lat: 13.769,
      lng: 100.493,
      vehicle: "Mazda แดง (3กย 789)",
    },
    {
      id: "RG-2025004",
      type: "ความผิดปกติ",
      category: "ความผิดปกติ",
      subtype: "road_work",
      location: "ถ.รามคำแหง",
      datetime: "2025-02-03 19:00:00",
      severity: "Low",
      status: "Verified",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.759,
      lng: 100.615,
      vehicle: "-",
    },
    {
      id: "RG-2025005",
      type: "ความผิดปกติ",
      category: "ความผิดปกติ",
      subtype: "traffic_light",
      location: "แยกดินแดง",
      datetime: "2025-02-03 20:45:00",
      severity: "Medium",
      status: "New",
      displayStatus: "New",
      cctv: true,
      lat: 13.762,
      lng: 100.54,
      vehicle: "-",
    },
    {
      id: "RG-2025006",
      type: "ความผิดปกติ",
      category: "ความผิดปกติ",
      subtype: "road_work",
      location: "ถ.สาทรใต้",
      datetime: "2025-02-03 23:00:00",
      severity: "Low",
      status: "In Progress",
      displayStatus: "In-Process",
      cctv: true,
      lat: 13.722,
      lng: 100.528,
      vehicle: "-",
    },
  ];

  const [incidents] = useState(incidentData);

  // ปรับ Hotspots ให้สอดคล้องกับปัญหาผิวจราจรและสัญญาณไฟ
  const hotspots = [
    {
      rank: 1,
      name: "แยกอโศก-มนตรี",
      location: "ระบบสัญญาณไฟจราจร",
      time: "แจ้งเตือนบ่อย: สัญญาณไฟขัดข้อง",
      incidents: "สถิติ: 6 เคส/เดือน",
      updated: "10 นาทีที่แล้ว",
      icon: <RelateAccidentIcon variant="traffic_light" size={24} />,
    },
    {
      rank: 2,
      name: "ถนนวิภาวดีรังสิต",
      location: "แนวซ่อมแซมผิวจราจร",
      time: "แจ้งเตือนบ่อย: ป้ายเขตซ่อมแซมล้ม",
      incidents: "สถิติ: 4 เคส/เดือน",
      updated: "1 ชม. ที่แล้ว",
      icon: <RelateAccidentIcon variant="road_work" size={24} />,
    },
  ];

  return (
    <div className="fix-function-page-y-auto p-6 min-h-screen flex flex-col">
      <IncidentHeader
        title="ความผิดปกติของถนนและระบบกำกับจราจร"
        subtitle="Road Irregularities & Traffic Control"
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
            zoom={11}
          />
        </div>
        <div className="col-span-12 lg:col-span-4 h-full">
          <HotspotsPanel 
            title="จุดแจ้งเตือนความผิดปกติบ่อย" 
            hotspots={hotspots} 
          />
        </div>
      </div>

      <div className="mt-auto">
        {/* เปิด showVehicleColumn เผื่อไว้กรณีมีรถจอดเสียขวางทาง (เช่นเคส RG-2025003) */}
        <IncidentTable
          incidents={incidents}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          showVehicleColumn={true}
        />
      </div>
    </div>
  );
}

export default Irregularities;