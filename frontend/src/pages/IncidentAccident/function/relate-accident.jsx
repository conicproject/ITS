// frontend/src/pages/IncidentAccident/function/relate-accident.jsx
import React, { useState, useMemo } from "react";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";
import RelateAccidentIcon from "../../../components/ui/Icon_Incident/relate-accident";

// 1. เรียกใช้ Component สถิติที่แยกไว้
import IncidentStats from "../../../components/ui/IncidentStats";

function RelateAccident() {
  const [currentPage, setCurrentPage] = useState(1);
  const mapCenter = [13.7563, 100.5018];

  // 2. ข้อมูลจำลอง (Mock Data) - คง type เป็น "อุบัติเหตุ" ไว้เหมือนเดิม
  const incidentData = [
    {
      id: "AC-2025001",
      type: "อุบัติเหตุ",
      subtype: "crash",
      location: "ถนนพหลโยธิน หน้าเซ็นทรัลลาดพร้าว",
      datetime: "2025-02-03 08:15:00",
      severity: "High",
      status: "Verified",
      lat: 13.8161,
      lng: 100.5613,
      vehicle: "รถยนต์นั่งส่วนบุคคล",
    },
    {
      id: "AC-2025002",
      type: "อุบัติเหตุ",
      subtype: "breakdown",
      location: "ทางพิเศษศรีรัช ช่วงทางแยกต่างระดับพญาไท",
      datetime: "2025-02-03 09:30:00",
      severity: "Medium",
      status: "In Progress",
      lat: 13.7621,
      lng: 100.5284,
      vehicle: "รถบรรทุก 6 ล้อ",
    },
    {
      id: "AC-2025003",
      type: "อุบัติเหตุ",
      subtype: "rollover",
      location: "ถนนสุขุมวิท ปากซอยสุขุมวิท 24",
      datetime: "2025-02-03 10:05:00",
      severity: "Low",
      status: "Verified",
      lat: 13.7303,
      lng: 100.5694,
      vehicle: "รถจักรยานยนต์",
    },
  ];

  const [incidents] = useState(incidentData);

  const incidentMarkers = useMemo(() => {
    return incidents.map((item) => ({
      id: item.id,
      position: [item.lat, item.lng],
      type: item.subtype,
      title: item.location,
      icon: <RelateAccidentIcon variant={item.subtype} size={32} />,
    }));
  }, [incidents]);

  const hotspots = [
    {
      rank: 1,
      name: "แยกลาดพร้าว",
      location: "จุดตัดถนนพหลโยธิน-วิภาวดี",
      time: "อุบัติเหตุบ่อย: รถชนท้าย",
      incidents: "สถิติ: 15 เคส/เดือน",
      updated: "10 นาทีที่แล้ว",
      icon: <RelateAccidentIcon variant="crash" size={24} />,
    },
    {
      rank: 2,
      name: "ทางต่างระดับพญาไท",
      location: "ทางพิเศษศรีรัช",
      time: "อุบัติเหตุบ่อย: รถเสีย/จอดรีบ",
      incidents: "สถิติ: 11 เคส/เดือน",
      updated: "1 ชม. ที่แล้ว",
      icon: <RelateAccidentIcon variant="breakdown" size={24} />,
    },
  ];

  return (
    <div className="fix-function-page-y-auto bg-gray-50 p-6">
      <IncidentHeader
        title="อุบัติเหตุที่เกี่ยวข้องบนท้องถนน"
        subtitle="Road-Related Accident Management"
        onExport={() => console.log("Export")}
        onAddIncident={() => console.log("Add")}
      />

      {/* 3. ส่งข้อมูล incidents ไปให้ IncidentStats คำนวณตัวเลขสถิติแบบ Real-time */}
      <IncidentStats incidents={incidents} />

      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 lg:col-span-8">
          <IncidentMap
            mapCenter={mapCenter}
            zoom={12}
            incidents={incidents}
          />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <HotspotsPanel title="จุดเสี่ยงเกิดเหตุบ่อย" hotspots={hotspots} />
        </div>
      </div>

      <div className="mt-6">
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

export default RelateAccident;