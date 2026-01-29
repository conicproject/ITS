// frontend/src/pages/IncidentAccident/function/special-hazard.jsx
import React, { useMemo } from "react";
import { FaFireAlt, FaBiohazard, FaBomb, FaSmog } from "react-icons/fa";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import StatsCard from "../../../components/ui/StatsCard";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";

import { incidentData } from "../DataTest/incidentMockData";
import { hotspotsData } from "../DataTest/hotspotsData";

function SpecialHazard() {
  const mapCenter = [13.7563, 100.5018];

  const incidents = useMemo(() => {
    return incidentData
      .filter((item) => item.id.startsWith("HZ"))
      .map((item) => ({
        ...item,
        category: "อันตราย",
        vehicle: "-",
        displayStatus: item.status
      }));
  }, []);

  const stats = [
    { label: "เหตุอันตรายทั้งหมด", value: incidents.length, icon: FaFireAlt, color: "text-red-600" },
    { label: "ไฟไหม้", value: incidents.filter(i => i.type.includes("ไฟไหม้")).length, icon: FaFireAlt, color: "text-orange-500" },
    { label: "สารเคมี/ควันพิษ", value: incidents.filter(i => i.type.includes("สารเคมี") || i.type.includes("ควัน")).length, icon: FaSmog, color: "text-gray-600" },
    { label: "ระเบิด", value: incidents.filter(i => i.type.includes("ระเบิด")).length, icon: FaBomb, color: "text-red-800" },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6 pb-20">
      <IncidentHeader 
        title="เหตุการณ์อันตรายพิเศษ"
        subtitle="Hazardous Incidents"
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
        <IncidentTable incidents={incidents} showVehicleColumn={false} title="รายการเหตุอันตรายทั้งหมด" />
      </div>
    </div>
  );
}

export default SpecialHazard;