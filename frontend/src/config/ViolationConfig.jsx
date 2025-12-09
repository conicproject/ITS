// frontend/src/config/ViolationConfig.jsx
const baseFields = [
  { label: "ครั้งล่าสุด", key: "date" },
  { label: "กล้องที่ตรวจจับ", key: "camera" },
  { label: "สถานที่", key: "location" },
];

const speedField = { label: "ความเร็ว", key: "speed", optional: true };

export const statusColors = {
  'สูง': 'bg-red-500',
  'ปานกลาง': 'bg-orange-500',
  'Green List': 'bg-green-500',
  'No Green List': 'bg-yellow-500',
};

export const violationConfigs = {
  speed: { fields: [...baseFields, speedField], showDetail: true },
  redlight: { fields: baseFields, showDetail: true },
  barrier: { fields: baseFields, showDetail: true },
  parking: { fields: baseFields, showDetail: true },
  sidewalk: { fields: baseFields, showDetail: true },
  lane: { fields: baseFields, showDetail: true },
  lprsearch: { fields: [...baseFields, speedField], showDetail: false },
};
