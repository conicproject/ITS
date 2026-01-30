// frontend/src/pages/IncidentAccident/function/irregularitie.jsx
import React, { useState, useMemo } from "react";
import { FaExclamationTriangle, FaCar, FaWrench } from "react-icons/fa";
import IncidentHeader from "../../../components/ui/IncidentHeader";
import StatsCard from "../../../components/ui/StatsCard";
import IncidentMap from "../../../components/ui/IncidentMap";
import HotspotsPanel from "../../../components/ui/HotspotsPanel";
import IncidentTable from "../../../components/ui/IncidentTable";

import { incidentData } from "../DataTest/incidentMockData";
import { hotspotsData } from "../DataTest/hotspotsData";

function Irregularities() {
  const mapCenter = [13.7563, 100.5018];

  const incidents = [
    {
      id: "1",
      type: "ไฟไฟม้",
      location: "ถนนพหลโยธิน แขวงจันทรเกษม",
      datetime: "7/10/2568 16:28:59",
      severity: "Severe",
      status: "Verified",
      cctv: true,
      lat: 13.7563,
      lng: 100.5018,
    },
    {
      id: "2",
      type: "สารเคมีรั่วไหล",
      location: "ถนนสาธรใต้ แขวงยานนาวา",
      datetime: "26/9/2568 16:28:59",
      severity: "Minor",
      status: "Verified",
      cctv: true,
      lat: 13.7463,
      lng: 100.5118,
    },
    {
      id: "3",
      type: "ควันพิษ",
      location: "ถนนสุขุมวิท แขวงคลองตัน",
      datetime: "22/9/2568 16:28:59",
      severity: "Severe",
      status: "New",
      cctv: true,
      lat: 13.7663,
      lng: 100.4918,
    },
    {
      id: "4",
      type: "ไฟไฟม้",
      location: "ถนนเพชรบุรี แขวงมักกะสัน",
      datetime: "19/9/2568 16:28:59",
      severity: "Severe",
      status: "New",
      cctv: true,
      lat: 13.7363,
      lng: 100.5218,
    },
  ];

  const incidentMarkers = useMemo(() => {
    const colorMap = {
      "ไฟไฟม้": "#ef4444",
      "ควันพิษ": "#f59e0b",
      "สารเคมีรั่วไหล": "#3b82f6",
    };

    return incidents.map((item, index) => ({
      id: index,
      position: [item.lat, item.lng],
      type: item.type,
      severity: item.severity,
      color: colorMap[item.type] || "#6b7280",
    }));
  }, [incidents]);

  const stats = [
    { label: "งานถนนทั้งหมด", value: 50, icon: FaExclamationTriangle, color: "text-yellow-500" },
    { label: "กำลังดำเนินอยู่", value: 20, icon: FaCar, color: "text-red-500" },
    { label: "ไฟจราจรขัดข้อง", value: 19, icon: FaWrench, color: "text-blue-500" },
    { label: "ผลกระทบรุนแรง", value: 11, icon: FaExclamationTriangle, color: "text-purple-500" },
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

  return (
    <div className="fix-function-page-y-auto bg-gray-50 p-6">
      <IncidentHeader
        title="เหตุการณ์อันตรายพิเศษ"
        subtitle="Hazardous Incidents"
        onExport={() => console.log("Export")}
        onAddIncident={() => console.log("Add Incident")}
      />
      <StatsCard stats={stats} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <IncidentMap
            incidentMarkers={incidentMarkers}
            mapCenter={mapCenter}
          />
        </div>
        <div className="lg:col-span-4 h-[500px]">
          <HotspotsPanel hotspots={hotspotsData} />
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
          showVehicleColumn={false}
        />
      </div>
    </div>
  );
}

export default Irregularities;