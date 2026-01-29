// frontend/src/pages/IncidentAccident/function/irregularitie.jsx
import React, { useMemo } from "react";
import { FaExclamationTriangle, FaTrafficLight, FaRoad, FaHardHat } from "react-icons/fa";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import StatsCard from "../../../components/ui/StatsCard";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";

import { incidentData } from "../DataTest/incidentMockData";
import { hotspotsData } from "../DataTest/hotspotsData";

function Irregularities() {
  const mapCenter = [13.7563, 100.5018];

  const incidents = useMemo(() => {
    return incidentData
      .filter((item) => item.id.startsWith("RD"))
      .map((item) => ({
        ...item,
        category: "ก่อสร้าง",
        vehicle: "-", 
        displayStatus: item.status
      }));
  }, []);

  const stats = [
    { label: "เหตุการณ์ทั้งหมด", value: incidents.length, icon: FaExclamationTriangle, color: "text-yellow-500" },
    { label: "ไฟจราจรขัดข้อง", value: incidents.filter(i => i.type.includes("ไฟ")).length, icon: FaTrafficLight, color: "text-red-500" },
    { label: "งานซ่อมถนน", value: incidents.filter(i => i.type.includes("งานถนน") || i.type.includes("ซ่อม")).length, icon: FaHardHat, color: "text-orange-500" },
    { label: "ผิวจราจรชำรุด", value: incidents.filter(i => i.type.includes("ยุบ") || i.type.includes("น้ำ")).length, icon: FaRoad, color: "text-blue-500" },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6 pb-20">
      <IncidentHeader 
        title="ความผิดปกติของถนนและระบบกำกับจราจร"
        subtitle="Road Operation Failures"
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
        <IncidentTable incidents={incidents} showVehicleColumn={false} title="รายการความผิดปกติของถนน" />
      </div>
    </div>
  );
}

export default Irregularities;