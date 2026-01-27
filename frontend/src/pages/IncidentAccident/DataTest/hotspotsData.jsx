// hotspotsData.jsx

export const hotspotsData = [
  {
    rank: 1,
    location: "ถนนงามวงศ์วาน แขวงทุ่งสองห้อง",
    incidentCount: 8, // รวมจาก ID: EV-1024, EV-1021, RD-1024, RD-1043, HZ-1024, OB-1024, VH-1024, VH-1021
    severityLevel: "High", // คำนวณจากสัดส่วนเคส Severe
    lat: 13.8564, 
    lng: 100.5441,
    mostCommonType: "Vehicle & Traffic", // ประเภทที่เกิดบ่อยสุด
    trend: "stable", // up, down, stable
    activeIncidents: [
      { id: "EV-1024", type: "จุดตรวจ DUI" },
      { id: "RD-1043", type: "ไฟจราจรขัดข้อง" },
      { id: "HZ-1024", type: "สารเคมีรั่วไหล" },
      { id: "VH-1021", type: "รถชน" }
    ]
  },
  {
    rank: 2,
    location: "ถนนลาดพร้าว แขวงจันทรเกษม",
    incidentCount: 5, // รวมจาก ID: EV-1001, RD-1001, HZ-1001, OB-1001, VH-1001
    severityLevel: "Critical", // มีแต่เคส Severe เยอะ
    lat: 13.8035,
    lng: 100.5742,
    mostCommonType: "Construction & Fire",
    trend: "up",
    activeIncidents: [
      { id: "EV-1001", type: "งานวิ่ง Bangkok Marathon" },
      { id: "HZ-1001", type: "ไฟไหม้" },
      { id: "RD-1001", type: "งานถนน" }
    ]
  },
  {
    rank: 3,
    location: "ถนนสุขุมวิท แขวงคลองเตย",
    incidentCount: 4, // รวมจาก ID: EV-1022, HZ-1022, OB-1022, VH-1022
    severityLevel: "High",
    lat: 13.7371,
    lng: 100.5604,
    mostCommonType: "Obstruction & Event",
    trend: "down",
    activeIncidents: [
      { id: "EV-1022", type: "คอนเสิร์ตใหญ่" },
      { id: "VH-1022", type: "รถบรรทุกเสีย" }
    ]
  },
  {
    rank: 4,
    location: "ถนนพหลโยธิน แขวงเสนานิคม",
    incidentCount: 4, // รวมจาก ID: EV-1027, HZ-1020, OB-1015, VH-1020
    severityLevel: "Medium",
    lat: 13.8322,
    lng: 100.5701,
    mostCommonType: "Event & Accident",
    trend: "stable",
    activeIncidents: [
      { id: "EV-1027", type: "งานวัดประจำปี" },
      { id: "HZ-1020", type: "หม้อแปลงระเบิด" }
    ]
  },
  {
    rank: 5,
    location: "ถนนเพชรบุรี แขวงมักกะสัน",
    incidentCount: 2, // รวมจาก ID: RD-1029, VH-1029
    severityLevel: "High",
    lat: 13.7495,
    lng: 100.5630,
    mostCommonType: "Traffic System & Accident",
    trend: "up",
    activeIncidents: [
      { id: "RD-1029", type: "ไฟจราจรขัดข้อง" },
      { id: "VH-1029", type: "รถคว่ำ" }
    ]
  }
];