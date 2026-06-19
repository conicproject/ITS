// frontend/src/pages/Enforcement/function.jsx
import GenericFunction from "../../components/ui/GenericFunction";

function EnforcementFunction() {
  const items = [
    { name: "ระบบตรวจจับรถที่ \nใช้ความเร็วเกินกำหนด", icon: "/assets/function_icon/enforcement_function/enforecment_1.png", path: "/enforcement/function/detect-speeding" }, 
    { name: "ระบบตรวจจับรถบรรทุก \nในช่วงเวลาห้ามเดินรถ", icon: "/assets/function_icon/enforcement_function/enforecment_2.png", path: "/enforcement/function/detect-truck-barrier" }, 
    { name: "ระบบตรวจจับการฝ่าสัญญาณไฟ", icon: "/assets/function_icon/enforcement_function/enforecment_3.png", path: "/enforcement/function/detect-red-light" },
    { name: "ระบบตรวจจับการ \nจอดรถในที่ห้ามจอด", icon: "/assets/function_icon/enforcement_function/enforecment_4.png", path: "/enforcement/function/detect-parking" }, 
    { name: "ระบบตรวจจับการเปลี่ยน \nช่องจราจรในเขตเส้นทึบ", icon: "/assets/function_icon/enforcement_function/enforecment_5.png", path: "/enforcement/function/detect-lane" }, 
    { name: "ระบบตรวจจับ \nรถวิ่งบนทางเท้า", icon: "/assets/function_icon/enforcement_function/enforecment_6.png", path: "/enforcement/function/detect-sidewalk" }, 
    { name: "Blacklist", icon: "/assets/function_icon/enforcement_function/enforecment_7.png", path: "/enforcement/function/blacklist" },
    { name: "รายงาน", icon: "/assets/icons/icon-report.png", path: "/enforcement/function/report-vehicle" }, 
    { name: "Violation search", icon: "/assets/number/1.png", path: "/enforcement/function/violation-search" }, 
    // { name: "การเปลี่ยนเลน (เส้นทึบ)", icon: "/assets/number/1.png", path: "/enforcement/function/detect-change-lane" }, 
    { name: "การไม่สวมหมวกนิรภัย", icon: "/assets/number/2.png", path: "/enforcement/function/detect-helmet" }, 
    // { name: "ขับรถทับเส้นจราจร", icon: "/assets/number/3.png", path: "/enforcement/function/detect-over-line" }, 
    // { name: "การใช้โทรศัพท์ขณะขับรถ", icon: "/assets/number/4.png", path: "/enforcement/function/detect-phone" }, 
    { name: "ขับรถย้อนศร", icon: "/assets/number/5.png", path: "/enforcement/function/detect-reverse" }, 
    // { name: "การไม่คาดเข็มขัดนิรภัย", icon: "/assets/number/6.png", path: "/enforcement/function/detect-seatbelt" }, 
    // { name: "ไม่ปฏิบัติตามป้ายจราจร", icon: "/assets/number/7.png", path: "/enforcement/function/detect-sign-traffic" }, 
    // { name: "ไม่หยุดให้คนข้ามทางม้าลาย", icon: "/assets/number/8.png", path: "/enforcement/function/detect-stop-crosswalk" }, 
    // { name: "หยุดรถในเขตห้ามหยุด", icon: "/assets/number/9.png", path: "/enforcement/function/detect-stop-zone" },
    // { name: "การกลับรถ (ในที่ห้าม)", icon: "/assets/number/10.png", path: "/enforcement/function/detect-uturn" }, 
  ];

  return <GenericFunction title="Enforcement Function" items={items} />;
}

export default EnforcementFunction;
