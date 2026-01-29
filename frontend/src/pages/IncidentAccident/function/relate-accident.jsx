// frontend/src/pages/IncidentAccident/function/relate-accident.jsx
import React, { useMemo } from "react";
import { FaExclamationTriangle, FaCar, FaWrench } from "react-icons/fa";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import StatsCard from "../../../components/ui/StatsCard";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";

// Import Data
import { incidentData } from "../DataTest/incidentMockData";
import { hotspotsData } from "../DataTest/hotspotsData";

function RelateAccident() {
  const mapCenter = [13.7563, 100.5018];

  // 1. กรองและแปลงข้อมูล
  const incidents = useMemo(() => {
    return incidentData
      .filter((item) => item.id.startsWith("VH"))
      .map((item) => {
        let vehicleInfo = "-";
        if (item.brand && item.brand !== "-") {
          vehicleInfo = `${item.brand} ${item.color} (${item.plate})`;
        } else if (item.subtype) {
           const parts = item.subtype.split("_");
           if (parts.length > 1) vehicleInfo = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        }

        return {
          ...item,
          category: item.type.includes("เสีย") ? "รถเสีย" : "อุบัติเหตุ",
          vehicle: vehicleInfo,
          displayStatus: item.status
        };
      });
  }, []);

  const stats = [
    { label: "จำนวนอุบัติเหตุทั้งหมด", value: incidents.length, icon: FaExclamationTriangle, color: "text-yellow-500" },
    { label: "รถชน (Collision)", value: incidents.filter(i => i.type.includes("ชน")).length, icon: FaCar, color: "text-red-500" },
    { label: "รถเสีย (Breakdown)", value: incidents.filter(i => i.type.includes("เสีย")).length, icon: FaWrench, color: "text-blue-500" },
    { label: "รถคว่ำ (Overturn)", value: incidents.filter(i => i.type.includes("คว่ำ")).length, icon: FaExclamationTriangle, color: "text-purple-500" },
  ];

  const handleExport = () => console.log("Export Excel");
  const handleAddIncident = () => console.log("Add Incident");

  return (
    // [FIX 1] แก้ padding ให้ยืดหยุ่น (p-4 บนมือถือ, p-6 บนจอใหญ่)
    <div className="h-screen overflow-y-auto bg-slate-50 p-4 md:p-6 pb-20">
      <IncidentHeader 
        title="ระบบเก็บและแสดงข้อมูลอุบัติเหตุ"
        subtitle="Vehicle Incident Data Workflow"
        onExport={handleExport}
        onAddIncident={handleAddIncident}
      />
      
      <StatsCard stats={stats} />

      {/* [FIX 2] แก้ Grid Layout ให้เป็น Responsive */}
      {/* - grid-cols-1: มือถือแสดง 1 คอลัมน์ (เรียงลงมา) */}
      {/* - lg:grid-cols-12: จอใหญ่แบ่ง 12 คอลัมน์ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* แผนที่: มือถือเต็มจอ / จอใหญ่กินพื้นที่ 8/12 ส่วน */}
        <div className="lg:col-span-8 h-[400px] lg:h-[500px]">
          <IncidentMap incidents={incidents} mapCenter={mapCenter} />
        </div>
        

        {/* Hotspots: มือถือเต็มจอ / จอใหญ่กินพื้นที่ 4/12 ส่วน */}
        <div className="lg:col-span-4 h-[400px] lg:h-[500px]">
          <HotspotsPanel hotspots={hotspotsData} />
        </div>
      </div>

      <div className="mt-6">
        <IncidentTable incidents={incidents} showVehicleColumn={true} title="รายการอุบัติเหตุทั้งหมด" />
      </div>
    </div>
  );
}

export default RelateAccident;