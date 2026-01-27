// frontend/src/pages/IncidentAccident/function/relate-accident.jsx
import React, { useState, useMemo } from "react";
import { FaExclamationTriangle, FaCar, FaWrench } from "react-icons/fa";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import StatsCard from "../../../components/ui/StatsCard";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";

// [NEW] Import ข้อมูลกลางเข้ามาใช้
import { incidentData } from "../DataTest/incidentMockData";
import { hotspotsData } from "../DataTest/hotspotsData";

function RelateAccident() {
  const [selectedSort, setSelectedSort] = useState("ล่าสุด");
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);

  const mapCenter = [13.7563, 100.5018];

  // 1. แปลงและกรองข้อมูลให้เหลือแค่ "อุบัติเหตุ" และ "รถเสีย" (VH Only)
  const incidents = useMemo(() => {
    return incidentData
      .filter(item => item.id.startsWith("VH")) // กรองเอาเฉพาะ Vehicle Incidents
      .map(item => {
         // สร้าง field vehicle (เหมือนใน Dashboard)
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

  // ใช้ Hotspot จากไฟล์กลาง (หรือจะใช้ Mock เดิมก็ได้ถ้าต้องการแยกส่วน)
  const hotspots = hotspotsData; 

  // Stats (คำนวณจากข้อมูลจริง)
  const stats = [
    { label: "จำนวนอุบัติเหตุทั้งหมด", value: incidents.length, icon: FaExclamationTriangle, color: "text-yellow-500" },
    { label: "รถชน (Collision)", value: incidents.filter(i => i.type.includes("ชน")).length, icon: FaCar, color: "text-red-500" },
    { label: "รถเสีย (Breakdown)", value: incidents.filter(i => i.type.includes("เสีย")).length, icon: FaWrench, color: "text-blue-500" },
    { label: "รถคว่ำ (Overturn)", value: incidents.filter(i => i.type.includes("คว่ำ")).length, icon: FaExclamationTriangle, color: "text-purple-500" },
  ];

  const handleExport = () => { console.log("Export Excel"); };
  const handleAddIncident = () => { console.log("Add new incident"); };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6">
      <IncidentHeader 
        title="ระบบเก็บและแสดงข้อมูลอุบัติเหตุ"
        subtitle="Vehicle Incident Data Workflow"
        onExport={handleExport}
        onAddIncident={handleAddIncident}
      />

      <StatsCard stats={stats} />

      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-8">
          <IncidentMap incidents={incidents} mapCenter={mapCenter} />
        </div>
        <div className="col-span-4">
          <HotspotsPanel hotspots={hotspots} />
        </div>
      </div>

      <div className="mt-6">
        <IncidentTable 
          incidents={incidents}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          showVehicleColumn={true}
        />
      </div>
    </div>
  );
}

export default RelateAccident;