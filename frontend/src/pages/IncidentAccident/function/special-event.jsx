// frontend/src/pages/IncidentAccident/function/special-event.jsx
import React, { useMemo } from "react";
import { FaFlag, FaRunning, FaMusic, FaUsers } from "react-icons/fa";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import StatsCard from "../../../components/ui/StatsCard";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";

import { incidentData } from "../DataTest/incidentMockData";
import { hotspotsData } from "../DataTest/hotspotsData";

function SpecialEvent() {
  const mapCenter = [13.7563, 100.5018];

  const incidents = useMemo(() => {
    return incidentData
      .filter((item) => item.id.startsWith("EV"))
      .map((item) => ({
        ...item,
        category: "กิจกรรมพิเศษ",
        vehicle: "-",
        displayStatus: item.status
      }));
  }, []);

  const stats = [
    { label: "กิจกรรมทั้งหมด", value: incidents.length, icon: FaFlag, color: "text-purple-500" },
    { label: "การชุมนุม/ด่าน", value: incidents.filter(i => i.type.includes("ชุมนุม") || i.type.includes("จุดตรวจ")).length, icon: FaUsers, color: "text-red-500" },
    { label: "คอนเสิร์ต/งานวัด", value: incidents.filter(i => i.type.includes("คอนเสิร์ต") || i.type.includes("งาน")).length, icon: FaMusic, color: "text-blue-500" },
    { label: "กีฬา/วิ่ง", value: incidents.filter(i => i.type.includes("วิ่ง") || i.type.includes("กีฬา")).length, icon: FaRunning, color: "text-green-500" },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6 pb-20">
      <IncidentHeader 
        title="เหตุการณ์พิเศษจากกิจกรรมมนุษย์"
        subtitle="Event-related Incidents"
        onExport={() => {}}
        onAddIncident={() => {}}
      />
      <StatsCard stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-8 h-[500px]">
          <IncidentMap incidents={incidents} mapCenter={mapCenter} />
        </div>
        <div className="lg:col-span-4 h-[500px]">
          <HotspotsPanel hotspots={hotspotsData} />
        </div>
      </div>
      <div className="mt-6">
        <IncidentTable incidents={incidents} showVehicleColumn={false} title="รายการกิจกรรมทั้งหมด" />
      </div>
    </div>
  );
}

export default SpecialEvent;