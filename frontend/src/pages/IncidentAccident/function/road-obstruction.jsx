// frontend/src/pages/IncidentAccident/function/road-obstruction.jsx
import React, { useMemo } from "react";
import { FaExclamationTriangle, FaTree, FaBoxOpen, FaBuilding } from "react-icons/fa";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import StatsCard from "../../../components/ui/StatsCard";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";

import { incidentData } from "../DataTest/incidentMockData";
import { hotspotsData } from "../DataTest/hotspotsData";

function RoadObstruction() {
  const mapCenter = [13.7563, 100.5018];

  const incidents = useMemo(() => {
    return incidentData
      .filter((item) => item.id.startsWith("OB"))
      .map((item) => ({
        ...item,
        category: "สิ่งกีดขวาง",
        vehicle: "-",
        displayStatus: item.status
      }));
  }, []);

  const stats = [
    { label: "สิ่งกีดขวางทั้งหมด", value: incidents.length, icon: FaExclamationTriangle, color: "text-yellow-500" },
    { label: "วัสดุตกหล่น", value: incidents.filter(i => i.type.includes("ตกหล่น") || i.type.includes("เศษ")).length, icon: FaBoxOpen, color: "text-red-500" },
    { label: "สิ่งกีดขวางธรรมชาติ", value: incidents.filter(i => i.type.includes("ต้นไม้") || i.type.includes("ธรรมชาติ")).length, icon: FaTree, color: "text-green-600" },
    { label: "โครงสร้างถล่ม/ล้ม", value: incidents.filter(i => i.type.includes("ถล่ม") || i.type.includes("ล้ม")).length, icon: FaBuilding, color: "text-gray-600" },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6 pb-20">
      <IncidentHeader 
        title="สิ่งกีดขวางบนถนน"
        subtitle="Obstruction-related Incidents"
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
        <IncidentTable incidents={incidents} showVehicleColumn={false} title="รายการสิ่งกีดขวางทั้งหมด" />
      </div>
    </div>
  );
}

export default RoadObstruction;