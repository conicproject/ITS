// frontend/src/config/FilterConfig.jsx

export const vehicleColorOptions = [
  { value: "yellow", label: "เหลือง", dot: "#fbbf24" },
  { value: "gray",   label: "เทา",    dot: "#9ca3af" },
  { value: "white",  label: "ขาว",    dot: "#f9fafb" },
  { value: "black",  label: "ดำ",     dot: "#111827" },
  { value: "red",    label: "แดง",    dot: "#ef4444" },
  { value: "blue",   label: "น้ำเงิน", dot: "#3b82f6" },
  { value: "green",  label: "เขียว",  dot: "#22c55e" },
  { value: "orange", label: "ส้ม",    dot: "#f97316" },
  { value: "brown",  label: "น้ำตาล", dot: "#92400e" },
  { value: "silver", label: "เงิน",   dot: "#cbd5e1" },
];

export const FilterConfig = {
  installation: { showPlate: true, showLocation: true,  showVehicleType: false, showDateRange: true, showViolationType: false, placeholder: "ค้นหาจุดติดตั้ง"            },
  speed:        { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาความเร็ว"              },
  redlight:     { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาการฝ่าไฟแดง"          },
  parking:      { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาการจอดผิดกฎหมาย"      },
  sidewalk:     { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาการขับขี่บนทางเท้า"   },
  barrier:      { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาการฝ่าแนวกั้น"        },
  lane:         { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาการขับรถทับเส้น"      },

  license: {
    showPlate: true,
    showLocation: true,
    showVehicleType: true,
    showColor: true,
    showDateRange: true,
    showViolationType: false,
    placeholder: "ค้นหาเลขทะเบียน",
    colorOptions: vehicleColorOptions,
  },

  violation:    { showPlate: true, showLocation: false, showVehicleType: false, showDateRange: true, showViolationType: true,  placeholder: "ค้นหาประเภทความผิด"        },

  // ── เพิ่ม showVehicleType + showColor ตามรูป ──
  helmet: {
    showPlate: true,
    showLocation: true,
    showVehicleType: true,
    showColor: true,
    showDateRange: true,
    showViolationType: false,
    placeholder: "เช่น 5กง-4747",
    placeholderLocation: "ทุกจุด",
    colorOptions: vehicleColorOptions,
  },

  reverse: { showPlate: true, showLocation: true,  showVehicleType: false, showDateRange: true, showViolationType: false, placeholder: "ค้นหาการขับรถย้อนศร" },

  trafficVolume: {
    showPlate: false, showLocation: true, showVehicleType: true, showDateRange: true, showViolationType: false,
    placeholderLocation: "ระบุชื่อจุดติดตั้ง...",
    vehicleTypeOptions: [
      { value: "suv",    label: "SUV" },
      { value: "truck",  label: "รถบรรทุก" },
      { value: "moto",   label: "จักรยานยนต์" },
      { value: "car",    label: "รถยนต์ส่วนบุคคล" },
      { value: "van",    label: "รถตู้" },
      { value: "tuktuk", label: "รถสามล้อเครื่อง" },
      { value: "pickup", label: "รถกระบะบรรทุกเล็ก" },
      { value: "bus",    label: "รถโดยสาร" },
      { value: "other",  label: "อื่นๆ" },
    ],
  },
};