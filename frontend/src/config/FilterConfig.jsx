// frontend/src/config/FilterConfig.jsx
export const FilterConfig = {
  installation: { showPlate: true, showLocation: true,  showVehicleType: false, showDateRange: true, showViolationType: false, placeholder: "ค้นหาจุดติดตั้ง"            },
  speed:        { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาความเร็ว"              },
  redlight:     { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาการฝ่าไฟแดง"          },
  parking:      { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาการจอดผิดกฎหมาย"      },
  sidewalk:     { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาการขับขี่บนทางเท้า"   },
  barrier:      { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาการฝ่าแนวกั้น"        },
  lane:         { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาการขับรถทับเส้น"      },
  license:      { showPlate: true, showLocation: true,  showVehicleType: true,  showDateRange: true, showViolationType: false, placeholder: "ค้นหาเลขทะเบียน"           },
  violation:    { showPlate: true, showLocation: false, showVehicleType: false, showDateRange: true, showViolationType: true,  placeholder: "ค้นหาประเภทความผิด"        },
  helmet:       { showPlate: true, showLocation: true,  showVehicleType: false, showDateRange: true, showViolationType: false, placeholder: "ค้นหาการไม่สวมหมวกนิรภัย" },
  reverse:      { showPlate: true, showLocation: true,  showVehicleType: false, showDateRange: true, showViolationType: false, placeholder: "ค้นหาการขับรถย้อนศร"      },
};