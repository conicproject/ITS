import GenericFunction from "../../components/ui/GenericFunction";

function EnforcementFunction() {
  const items = [
    {
      name: "ฝ่าฝืนสัญญาณไฟแดง",
      icon: (
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="2.5" width="8" height="19" rx="3" />
          <circle cx="12" cy="7" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="17" r="1.5" />
        </svg>
      ),
      path: "/enforcement/function/detect-red-light",
    },
    {
      name: "เปลี่ยนช่องทางเส้นทึบ",
      icon: (
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3v3M7 9.5v3M7 16v5M17 3v18" />
          <path d="M14 9l-3 3 3 3" />
        </svg>
      ),
      path: "/enforcement/function/detect-lane",
    },
    {
      name: "ยานพาหนะบนทางเท้า",
      icon: (
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="4" r="2" />
          <path d="M10 6v6M10 8.2l-2.4-1M10 8.2l2.4-1M10 12l-2 4.5M10 12l2 4.5" />
          <path d="M3 20.5h18" />
        </svg>
      ),
      path: "/enforcement/function/detect-sidewalk",
    },
    {
      name: "ตรวจจับความเร็ว",
      icon: (
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 16.5a8 8 0 0 1 16 0" />
          <path d="M12 16.5l4.2-4.2" />
          <circle cx="12" cy="16.5" r="1.3" />
        </svg>
      ),
      path: "/enforcement/function/detect-speeding",
    },
    {
      name: "รถบรรทุกนอกเวลา",
      icon: (
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="12" height="9" rx="1" />
          <path d="M14 10h4l3 3v3h-7z" />
          <circle cx="6" cy="17.5" r="1.7" />
          <circle cx="17.5" cy="17.5" r="1.7" />
        </svg>
      ),
      path: "/enforcement/function/detect-truck-barrier",
    },
    {
      name: "ไม่สวมหมวกนิรภัย",
      icon: (
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 13a9 9 0 0 1 18 0" />
          <path d="M3 13h18v2.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
          <path d="M5 5l14 13.5" />
        </svg>
      ),
      path: "/enforcement/function/detect-helmet",
    },
    {
      name: "ขับขี่ย้อนศร",
      icon: (
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M7.5 12h9M11 8.5L7.5 12l3.5 3.5" />
        </svg>
      ),
      path: "/enforcement/function/detect-reverse",
    },
    {
      name: "เขตห้ามหยุด/จอด",
      icon: (
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 16.5V7.5h3a2.5 2.5 0 0 1 0 5h-3" />
          <path d="M5.7 5.7l12.6 12.6" />
        </svg>
      ),
      path: "/enforcement/function/detect-parking",
    },
    {
      name: "รายงาน",
      icon: (
        <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v4h4M9 12h6M9 16h6" />
        </svg>
      ),
      path: "/enforcement/function/report-vehicle",
    },
  ];

  return <GenericFunction title="Enforcement Function" items={items} />;
}

export default EnforcementFunction;