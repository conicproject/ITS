// frontend/src/pages/Enforcement/function.jsx
import GenericFunction from "../../components/ui/GenericFunction";

function EnforcementFunction() {
  const items = [
    { name: "ระบบตรวจจับรถที่ \nใช้ความเร็วเกินกำหนด", icon: "/assets/icons/icon-report.png", path: "/enforcement/function/detect-speeding" }, 
    { name: "ระบบตรวจจับรถบรรทุก \nในช่วงเวลาห้ามเดินรถ", icon: "/assets/icons/icon-report.png", path: "/enforcement/function/detect-truck-barrier" }, 
    { name: "ระบบตรวจจับการฝ่าสัญญาณไฟ", icon: "/assets/icons/icon-report.png", path: "/enforcement/function/detect-red-light" },
    { name: "ระบบตรวจจับการ \nจอดรถในที่ห้ามจอด", icon: "/assets/icons/icon-report.png", path: "/enforcement/function/detect-parking" }, 
    { name: "ระบบตรวจจับการเปลี่ยน \nช่องจราจรในเขตเส้นทึบ", icon: "/assets/icons/icon-report.png", path: "/enforcement/function/detect-lane" }, 
    { name: "ระบบตรวจจับ \nรถวิ่งบนทางเท้า", icon: "/assets/icons/icon-report.png", path: "/enforcement/function/detect-sidewalk" }, 
    { name: "Blacklist", icon: "/assets/icons/icon-report.png", path: "/enforcement/function/blacklist" },
    { name: "รายงาน", icon: "/assets/icons/icon-report.png", path: "/enforcement/function/report-vehicle" }, 
  ];

  return <GenericFunction title="Enforcement Function" items={items} />;
}

export default EnforcementFunction;
