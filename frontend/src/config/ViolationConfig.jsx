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

export const violationConfigs = {
  speed: { 
    fields: [...baseFields, speedField, typeField], 
    showDetail: true 
  },
  redlight: { 
    fields: [...baseFields, speedField, typeField], 
    showDetail: true 
  },
  barrier: { 
    fields: baseFields, 
    showDetail: true 
  },
  parking: { 
    fields: [...baseFields, typeField], 
    showDetail: true 
  },
  sidewalk: { 
    fields: [...baseFields, typeField], 
    showDetail: true 
  },
  lane: { 
    fields: [...baseFields, laneField, typeField], 
    showDetail: true 
  },
  lprsearch: { 
    fields: [...baseFields, speedField, typeField, laneField], 
    showDetail: true 
  },
};