import React, { useMemo } from "react";
import { FaCar, FaBell, FaClipboardList, FaCog } from "react-icons/fa";
// เรียกใช้ StatsCard ที่อยู่ในระดับโฟลเดอร์เดียวกัน
import StatsCard from "./StatsCard";

function IncidentStats({ incidents = [] }) {
  const statsData = useMemo(() => {
    // 1. นับเหตุการณ์ทั้งหมด
    const total = incidents.length;

    // 2. นับรับแจ้งเหตุวันนี้
    const today = new Date().toISOString().split("T")[0];
    const todayIncidents = incidents.filter(
      (item) => item.datetime && item.datetime.startsWith(today)
    ).length;

    // 3. นับรอการตรวจสอบ (ดักจับสถานะ "New", "Pending", "Unverified")
    const pending = incidents.filter(
      (item) => item.status === "New" || item.status === "Pending" || item.status === "Unverified"
    ).length;

    // 4. นับกำลังดำเนินการ (ดักจับสถานะ "In Progress", "Verified")
    const inProgress = incidents.filter(
      (item) => item.status === "In Progress" || item.status === "Verified"
    ).length;

    return [
      {
        label: "เหตุการณ์ทั้งหมด",
        value: total.toLocaleString(),
        change: "สะสม",
        icon: FaCar,
        color: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        label: "รับแจ้งเหตุวันนี้",
        value: todayIncidents.toString(),
        change: "รายวัน",
        icon: FaBell,
        color: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        label: "รอการตรวจสอบ",
        value: pending.toString(),
        change: "รอยืนยัน",
        icon: FaClipboardList,
        color: "bg-red-50",
        iconColor: "text-red-600",
      },
      {
        label: "กำลังดำเนินการ",
        value: inProgress.toString(),
        change: "กำลังแก้ไข",
        icon: FaCog,
        color: "bg-purple-50",
        iconColor: "text-purple-600",
      },
    ];
  }, [incidents]);

  return <StatsCard stats={statsData} />;
}

export default IncidentStats;