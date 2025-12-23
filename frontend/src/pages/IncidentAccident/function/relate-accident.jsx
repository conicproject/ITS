// frontend/src/pages/IncidentAccident/function/relate-accident.jsx
import React, { useState } from "react";
import { FaExclamationTriangle, FaCar, FaWrench } from "react-icons/fa";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import StatsCard from "../../../components/ui/StatsCard";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";

function RelateAccident() {
  const [selectedSort, setSelectedSort] = useState("ล่าสุด");
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);

  const mapCenter = [13.7563, 100.5018];

  const stats = [
    { label: "ตำรวจตู้ที่แจ้งเข้าหมาย", value: 50, icon: FaExclamationTriangle, color: "text-yellow-500" },
    { label: "ชนรถ (Collision)", value: 20, icon: FaCar, color: "text-red-500" },
    { label: "วางเสีย (Breakdown)", value: 19, icon: FaWrench, color: "text-blue-500" },
    { label: "ชุดกำ (Overturn)", value: 11, icon: FaExclamationTriangle, color: "text-purple-500" },
  ];

  const incidentMarkers = [
    { id: 1, position: [13.7563, 100.5018], type: "ชนรถ", color: "#ef4444", severity: "Severe" },
    { id: 2, position: [13.7463, 100.5118], type: "วางเสีย", color: "#f59e0b", severity: "Moderate" },
    { id: 3, position: [13.7663, 100.4918], type: "ชนรถ", color: "#ef4444", severity: "Severe" },
    { id: 4, position: [13.7363, 100.5218], type: "วางกำ", color: "#3b82f6", severity: "Minor" },
    { id: 5, position: [13.7763, 100.5318], type: "วางเสีย", color: "#f59e0b", severity: "Moderate" },
    { id: 6, position: [13.7263, 100.4818], type: "ชนรถ", color: "#ef4444", severity: "Severe" },
    { id: 7, position: [13.7863, 100.5118], type: "วางเสีย", color: "#f59e0b", severity: "Minor" },
    { id: 8, position: [13.7463, 100.4718], type: "ชนรถ", color: "#ef4444", severity: "Moderate" },
  ];

  const incidents = [
    {
      id: "#1001",
      type: "ชนรถ",
      vehicle: "Bus",
      location: "ถนนพหลโยธิน แขวงจันทรเกษม",
      datetime: "7/10/2568 16:28:59",
      severity: "Severe",
      status: "Verified",
      cctv: true,
    },
    {
      id: "#1024",
      type: "วางเสีย",
      vehicle: "Bicycle",
      location: "ถนนสาธรใต้ แขวงยานนาวา",
      datetime: "26/9/2568 16:28:59",
      severity: "Minor",
      status: "Verified",
      cctv: true,
    },
    {
      id: "#1022",
      type: "วางเสีย",
      vehicle: "Truck",
      location: "ถนนสุขุมวิท แขวงคลองตัน",
      datetime: "22/9/2568 16:28:59",
      severity: "Severe",
      status: "New",
      cctv: true,
    },
    {
      id: "#1021",
      type: "ชนรถ",
      vehicle: "Motorcycle",
      location: "ถนนสาธรใต้ แขวงยานนาวา",
      datetime: "20/9/2568 16:28:59",
      severity: "Minor",
      status: "Verified",
      cctv: true,
    },
    {
      id: "#1027",
      type: "ชนรถ",
      vehicle: "Bicycle",
      location: "ถนนพหลโยธิน แขวงลาดยาว",
      datetime: "19/9/2568 16:28:59",
      severity: "Severe",
      status: "Verified",
      cctv: true,
    },
    {
      id: "#1029",
      type: "วางกำ",
      vehicle: "Car",
      location: "ถนนเพชรบุรี แขวงมักกะสัน",
      datetime: "19/9/2568 16:28:59",
      severity: "Severe",
      status: "New",
      cctv: true,
    },
    {
      id: "#1020",
      type: "ชนรถ",
      vehicle: "Bicycle",
      location: "ถนนพหลโยธิน แขวงลาดยาว",
      datetime: "18/9/2568 16:28:59",
      severity: "Severe",
      status: "New",
      cctv: true,
    },
    {
      id: "#1043",
      type: "วางเสีย",
      vehicle: "Bicycle",
      location: "ถนนสาธรใต้ แขวงยานนาวา",
      datetime: "12/9/2568 16:28:59",
      severity: "Severe",
      status: "Closed",
      cctv: true,
    },
    {
      id: "#1012",
      type: "วางเสีย",
      vehicle: "Motorcycle",
      location: "ถนนพระราม 4 แขวงคลองเตย",
      datetime: "11/9/2568 16:28:59",
      severity: "Moderate",
      status: "Verified",
      cctv: true,
    },
    {
      id: "#1015",
      type: "ชนรถ",
      vehicle: "Motorcycle",
      location: "ถนนพหลโยธิน แขวงลาดยาว",
      datetime: "11/9/2568 16:28:59",
      severity: "Moderate",
      status: "Closed",
      cctv: true,
    },
  ];

  const hotspots = [
    {
      rank: 1,
      name: "แยกร็อกทอง-ร่มเกล้า",
      location: "สี่แยกร็อกทอง-ร่มเกล้า",
      time: "แหล่งอุบัติเหตุต่อเนื่อง",
      incidents: "ประมวลคำเข้อมูล: 12 เคส",
      updated: "ปรับปรุงล่าสุด: 2025-01-16 16:29:25",
      icon: "🚗",
    },
    {
      rank: 2,
      name: "สะพานพระราม 6",
      location: "สะพานพระราม 6-ท่าพระ",
      time: "แหล่งอุบัติเหตุต่อเนื่อง",
      incidents: "ประมวลคำเข้อมูล: 11 เคส",
      updated: "ปรับปรุงล่าสุด: 2025-01-15 14:58:02",
      icon: "🚗",
    },
    {
      rank: 3,
      name: "แยกอโศก-สุขุมวิท",
      location: "สี่แยกอโศก-สุขุมวิท",
      time: "แหล่งอุบัติเหตุต่อเนื่อง",
      incidents: "ประมวลคำเข้อมูล: 9 เคส",
      updated: "ปรับปรุงล่าสุด: 2025-01-14 13:48:20",
      icon: "🚗",
    },
  ];

  const handleExport = () => {
    console.log("Export data");
  };

  const handleAddIncident = () => {
    console.log("Add new incident");
  };

  return (
    <div className="fix-function-page-y-auto bg-gray-50 p-6">
      <IncidentHeader 
        title="อุบัติเหตุการเกี่ยวข้องกับยานพาหนะ"
        subtitle="Vehicle Incident Data Workflow"
        onExport={handleExport}
        onAddIncident={handleAddIncident}
      />

      <StatsCard stats={stats} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <IncidentMap 
            incidentMarkers={incidentMarkers}
            mapCenter={mapCenter}
          />
        </div>

        <div className="col-span-4">
          <HotspotsPanel hotspots={hotspots} />
        </div>
      </div>

      <div className="mt-6">
        <IncidentTable 
          incidents={incidents}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          showVehicleColumn={true}
        />
      </div>
    </div>
  );
}

export default RelateAccident;