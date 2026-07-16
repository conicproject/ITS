// frontend/src/config/ViolationConfig.jsx
const baseFields = [
  { label: "วันที่-เวลา", key: "date" },
  { label: "กล้อง", key: "camera" },
  { label: "ทิศทาง", key: "location" },
];

const speedField = { label: "ความเร็ว", key: "speed", optional: true };
const typeField = { label: "ประเภทยานพาหนะ", key: "type_nameth", optional: true };
const laneField = { label: "เลน", key: "lane", optional: true };

export const statusColors = {
  'สูง': 'bg-red-500',
  'ปานกลาง': 'bg-orange-500',
  'ปกติ': 'bg-green-500',
  'Green List': 'bg-green-500',
  'No Green List': 'bg-yellow-500',
};

// ── สีจุดของสียานพาหนะ (ใช้ในตาราง helmet) ──
export const vehicleColorDots = {
  "เหลือง": "#fbbf24",
  "เทา": "#9ca3af",
  "ขาว": "#f9fafb",
  "ดำ": "#4b5563",
  "แดง": "#ef4444",
  "น้ำเงิน": "#3b82f6",
  "เขียว": "#22c55e",
  "ส้ม": "#f97316",
  "น้ำตาล": "#92400e",
  "เงิน": "#cbd5e1",
};

export const violationConfigs = {
  speed: { fields: [...baseFields, speedField, typeField], showDetail: true },
  redlight: { fields: [...baseFields, speedField, typeField], showDetail: true },
  barrier: { fields: baseFields, showDetail: true },
  parking: { fields: [...baseFields, typeField], showDetail: true },
  sidewalk: { fields: [...baseFields, typeField], showDetail: true },
  lane: { fields: [...baseFields, laneField, typeField], showDetail: true },
  lprsearch: { fields: [...baseFields, speedField, typeField, laneField], showDetail: true },

  // ── ใช้กับ ViolationCard แบบเดิม (fallback กรณีไม่ใช้ table mode) ──
  helmet: { fields: [...baseFields, typeField], showDetail: true },
};

// ── column config สำหรับ ViolationTable (viewMode="table") ──
export const violationTableConfigs = {
  helmet: {
    columns: [
      { key: "plateImage", label: "ภาพป้ายทะเบียน", type: "image" },
      { key: "lpr",         label: "ป้ายทะเบียน",     type: "plate" },
      { key: "type",        label: "ประเภทรถ",        type: "text" },
      { key: "color",       label: "สี",              type: "color" },
      { key: "installPoint",label: "จุดติดตั้ง",       type: "text" },
      { key: "direction",   label: "ทิศทาง",          type: "direction" },
      { key: "date",        label: "วันที่",           type: "text" },
      { key: "time",        label: "เวลา",            type: "text" },
    ],
  },
};