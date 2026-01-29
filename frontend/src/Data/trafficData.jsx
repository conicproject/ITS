/**
 * src/data/trafficData.js
 * ข้อมูลกลางสำหรับระบบจราจรอัจฉริยะ (Unified Traffic Data)
 */

export const globalTrafficData = [
  // =================================================================
  // 1. ตรวจจับความเร็ว (Speeding)
  // =================================================================
  {
    id: 'spd-01',
    category: 'speed',
    licensePlate: '1กก-1234',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถยนต์',
    brand: 'TOYOTA', model: 'Camry', color: 'ขาว',
    timestamp: '2025-01-24 14:25',
    location: 'แยกรัชดา-ห้วยขวาง',
    camera: 'CAM-001',
    status: 'สูง',
    violationType: 'ความเร็วเกินกำหนด',
    violationDetail: 'ขับเร็ว 120 กม./ชม.',
    violationCount: 3,
    position: [13.7763, 100.5718]
  },
  {
    id: 'spd-02',
    category: 'speed',
    licensePlate: '2ขข-5678',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถกระบะ',
    brand: 'ISUZU', model: 'D-Max', color: 'เทา',
    timestamp: '2025-01-24 14:20',
    location: 'แยกพระราม 9',
    camera: 'CAM-002',
    status: 'ปานกลาง',
    violationType: 'ความเร็วเกินกำหนด',
    violationDetail: 'ขับเร็ว 105 กม./ชม.',
    violationCount: 1,
    position: [13.7576, 100.5654]
  },
  {
    id: 'spd-03',
    category: 'speed',
    licensePlate: '3คค-9999',
    province: 'นนทบุรี',
    vehicleType: 'รถตู้',
    brand: 'TOYOTA', model: 'Commuter', color: 'เงิน',
    timestamp: '2025-01-24 14:15',
    location: 'ทางด่วนขั้นที่ 2',
    camera: 'CAM-003',
    status: 'สูง',
    violationType: 'ความเร็วเกินกำหนด',
    violationDetail: 'ขับเร็ว 135 กม./ชม.',
    violationCount: 5,
    position: [13.7468, 100.5349]
  },
  {
    id: 'spd-04',
    category: 'speed',
    licensePlate: '4งง-1010',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'จักรยานยนต์',
    brand: 'HONDA', model: 'PCX', color: 'แดง',
    timestamp: '2025-01-24 14:10',
    location: 'แยกรัชดา-ห้วยขวาง',
    camera: 'CAM-001',
    status: 'สูง',
    violationType: 'ความเร็วเกินกำหนด',
    violationDetail: 'ไม่สวมหมวกนิรภัย',
    violationCount: 2,
    position: [13.7763, 100.5718]
  },
  {
    id: 'spd-05',
    category: 'speed',
    licensePlate: '5จจ-2020',
    province: 'ปทุมธานี',
    vehicleType: 'รถบรรทุก',
    brand: 'HINO', model: '500', color: 'ขาว',
    timestamp: '2025-01-24 14:05',
    location: 'ถนนวิภาวดี',
    camera: 'CAM-004',
    status: 'ต่ำ',
    violationType: 'ความเร็วเกินกำหนด',
    violationDetail: 'ขับเร็ว 95 กม./ชม.',
    violationCount: 0,
    position: [13.8082, 100.5578]
  },

  // =================================================================
  // 2. บัญชีดำ (Blacklist)
  // =================================================================
  {
    id: 'bl-01',
    category: 'blacklist',
    licensePlate: '1กก-9999',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถยนต์',
    brand: 'HONDA', model: 'Accord', color: 'ดำ',
    timestamp: '2025-01-24 14:25',
    location: 'แยกรัชดา-ห้วยขวาง',
    camera: 'CAM-BL-01',
    status: 'สูง',
    violationType: 'บัญชีดำ (Blacklist)',
    violationDetail: 'รถยนต์ในบัญชีดำ (หมายจับคดีอาญา)',
    violationCount: 99,
    position: [13.7763, 100.5718],
    sequencePath: [[13.8282, 100.5699], [13.8033, 100.5746], [13.7763, 100.5718]]
  },
  {
    id: 'bl-02',
    category: 'blacklist',
    licensePlate: '2ขข-8888',
    province: 'ชลบุรี',
    vehicleType: 'รถตู้',
    brand: 'TOYOTA', model: 'Hiace', color: 'ขาว',
    timestamp: '2025-01-24 14:30',
    location: 'จุดสกัดถนนวิภาวดี',
    camera: 'CAM-BL-02',
    status: 'สูง',
    violationType: 'บัญชีดำ (Blacklist)',
    violationDetail: 'รถสวมทะเบียน / ป้ายทะเบียนปลอม',
    violationCount: 12,
    position: [13.8050, 100.5560]
  },
  {
    id: 'bl-03',
    category: 'blacklist',
    licensePlate: '3คค-7777',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถเก๋ง',
    brand: 'MAZDA', model: '2', color: 'แดง',
    timestamp: '2025-01-24 14:45',
    location: 'แยกรัชดา-ลาดพร้าว',
    camera: 'CAM-BL-03',
    status: 'ปานกลาง',
    violationType: 'บัญชีดำ (Blacklist)',
    violationDetail: 'เฝ้าระวังพิเศษ (หนีไฟแนนซ์)',
    violationCount: 5,
    position: [13.8030, 100.5750]
  },
  {
    id: 'bl-04',
    category: 'blacklist',
    licensePlate: '4งง-6666',
    province: 'ระยอง',
    vehicleType: 'รถกระบะดัดแปลง',
    brand: 'FORD', model: 'Ranger', color: 'ดำ',
    timestamp: '2025-01-24 15:00',
    location: 'ด่านตรวจคนเข้าเมือง',
    camera: 'CAM-BL-01',
    status: 'สูง',
    violationType: 'บัญชีดำ (Blacklist)',
    violationDetail: 'รถต้องสงสัยขนส่งสิ่งผิดกฎหมาย',
    violationCount: 20,
    position: [13.7525, 100.5730]
  },

  // =================================================================
  // 3. ฝ่าฝืนช่องทาง (Lane Change)
  // =================================================================
  {
    id: 'ln-01',
    category: 'lane',
    licensePlate: '1กก-1234',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถยนต์',
    brand: 'NISSAN', model: 'Almera', color: 'เงิน',
    timestamp: '2025-01-24 14:25',
    location: 'แยกรัชดา-ห้วยขวาง',
    camera: 'CAM-LN-01',
    status: 'สูง',
    violationType: 'ฝ่าฝืนเครื่องหมายจราจร',
    violationDetail: 'เปลี่ยนช่องทางในเขตห้าม (เส้นทึบ)',
    violationCount: 2,
    position: [13.7763, 100.5718]
  },
  {
    id: 'ln-02',
    category: 'lane',
    licensePlate: '2ขข-5678',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถกระบะ',
    brand: 'MITSUBISHI', model: 'Triton', color: 'ดำ',
    timestamp: '2025-01-24 14:30',
    location: 'สะพานข้ามแยกพระราม 9',
    camera: 'CAM-LN-02',
    status: 'ปานกลาง',
    violationType: 'ฝ่าฝืนเครื่องหมายจราจร',
    violationDetail: 'ขับคร่อมเลน / ไม่ชิดขอบทางซ้าย',
    violationCount: 1,
    position: [13.7576, 100.5654]
  },
  {
    id: 'ln-03',
    category: 'lane',
    licensePlate: '3คค-9012',
    province: 'สมุทรปราการ',
    vehicleType: 'รถบรรทุก',
    brand: 'ISUZU', model: 'GIGA', color: 'ขาว',
    timestamp: '2025-01-24 14:45',
    location: 'ทางด่วนขั้นที่ 2',
    camera: 'CAM-LN-03',
    status: 'สูง',
    violationType: 'ฝ่าฝืนเครื่องหมายจราจร',
    violationDetail: 'รถบรรทุกวิ่งในช่องทางขวาสุด',
    violationCount: 4,
    position: [13.7650, 100.5690]
  },

  // =================================================================
  // 4. จอดผิดกฎหมาย (Parking)
  // =================================================================
  {
    id: 'pk-01',
    category: 'parking',
    licensePlate: '1กก-1234',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถยนต์',
    brand: 'TOYOTA', model: 'Vios', color: 'ดำ',
    timestamp: '2025-01-24 14:25',
    location: 'แยกรัชดา-ห้วยขวาง',
    camera: 'CAM-PK-01',
    status: 'สูง',
    violationType: 'จอดผิดกฎหมาย',
    violationDetail: 'จอดในที่ห้ามจอด (ขาว-แดง)',
    violationCount: 1,
    position: [13.7763, 100.5718]
  },
  {
    id: 'pk-02',
    category: 'parking',
    licensePlate: '2ขข-5678',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถกระบะ',
    brand: 'FORD', model: 'Ranger', color: 'น้ำเงิน',
    timestamp: '2025-01-24 14:30',
    location: 'หน้าตลาดห้วยขวาง',
    camera: 'CAM-PK-02',
    status: 'สูง',
    violationType: 'จอดผิดกฎหมาย',
    violationDetail: 'จอดซ้อนคันกีดขวางการจราจร',
    violationCount: 3,
    position: [13.7790, 100.5735]
  },
  {
    id: 'pk-03',
    category: 'parking',
    licensePlate: '3คค-9012',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถแท็กซี่',
    brand: 'TOYOTA', model: 'Altis', color: 'เขียว-เหลือง',
    timestamp: '2025-01-24 14:45',
    location: 'ป้ายรถเมล์หน้าห้าง',
    camera: 'CAM-PK-03',
    status: 'ปานกลาง',
    violationType: 'จอดผิดกฎหมาย',
    violationDetail: 'จอดแช่ป้ายรถประจำทางเกินเวลา',
    violationCount: 2,
    position: [13.7650, 100.5690]
  },

  // =================================================================
  // 5. ฝ่าไฟแดง (Red Light)
  // =================================================================
  {
    id: 'rl-01',
    category: 'redlight',
    licensePlate: '1กก-1234',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถยนต์',
    brand: 'HONDA', model: 'City', color: 'ขาว',
    timestamp: '2025-01-24 14:25',
    location: 'แยกรัชดา-ห้วยขวาง',
    camera: 'CAM-RL-01',
    status: 'สูง',
    violationType: 'ฝ่าฝืนสัญญาณไฟ',
    violationDetail: 'ฝ่าสัญญาณไฟแดง (ขณะไฟแดง 3 วินาที)',
    violationCount: 2,
    position: [13.7763, 100.5718]
  },
  {
    id: 'rl-02',
    category: 'redlight',
    licensePlate: '2ขข-5678',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถกระบะ',
    brand: 'TOYOTA', model: 'Revo', color: 'ดำ',
    timestamp: '2025-01-24 14:30',
    location: 'แยกพระราม 9',
    camera: 'CAM-RL-02',
    status: 'สูง',
    violationType: 'ฝ่าฝืนสัญญาณไฟ',
    violationDetail: 'ฝ่าสัญญาณไฟแดง (ด้วยความเร็วสูง)',
    violationCount: 4,
    position: [13.7576, 100.5654]
  },
  {
    id: 'rl-03',
    category: 'redlight',
    licensePlate: '3คค-9012',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถจักรยานยนต์',
    brand: 'YAMAHA', model: 'Grand Filano', color: 'เทา',
    timestamp: '2025-01-24 14:45',
    location: 'แยกอโศก-เพชรบุรี',
    camera: 'CAM-RL-03',
    status: 'สูง',
    violationType: 'ฝ่าฝืนสัญญาณไฟ',
    violationDetail: 'จอดล้ำเส้นหยุดในขณะสัญญาณไฟแดง',
    violationCount: 1,
    position: [13.7485, 100.5630]
  },

  // =================================================================
  // 6. ฝ่าฝืนทางเท้า (Sidewalk)
  // =================================================================
  {
    id: 'sw-01',
    category: 'sidewalk',
    licensePlate: '1กก-1234',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถจักรยานยนต์',
    brand: 'HONDA', model: 'Click', color: 'ดำ-แดง',
    timestamp: '2025-01-24 14:25',
    location: 'ปากซอยลาดพร้าว 1',
    camera: 'CAM-SW-01',
    status: 'สูง',
    violationType: 'ฝ่าฝืนบนทางเท้า',
    violationDetail: 'ขับขี่รถจักรยานยนต์บนทางเท้า',
    violationCount: 4,
    position: [13.8130, 100.5615]
  },
  {
    id: 'sw-02',
    category: 'sidewalk',
    licensePlate: '2ขข-5678',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถจักรยานยนต์',
    brand: 'YAMAHA', model: 'NMAX', color: 'ขาว',
    timestamp: '2025-01-24 14:30',
    location: 'หน้าตลาดห้วยขวาง',
    camera: 'CAM-SW-02',
    status: 'สูง',
    violationType: 'ฝ่าฝืนบนทางเท้า',
    violationDetail: 'จอดรถบนทางเท้ากีดขวางทางเดิน',
    violationCount: 2,
    position: [13.7790, 100.5735]
  },
  {
    id: 'sw-03',
    category: 'sidewalk',
    licensePlate: '3คค-9012',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถยนต์',
    brand: 'TOYOTA', model: 'Yaris', color: 'แดง',
    timestamp: '2025-01-24 14:45',
    location: 'ปากซอยลาดพร้าว 1',
    camera: 'CAM-SW-01',
    status: 'สูง',
    violationType: 'ฝ่าฝืนบนทางเท้า',
    violationDetail: 'จอดรถยนต์เกยทางเท้า',
    violationCount: 1,
    position: [13.8130, 100.5615]
  },

  // =================================================================
  // 7. รถบรรทุก/LEZ (Truck Barrier)
  // =================================================================
  {
    id: 'trk-01',
    category: 'truck',
    category: 'barrier', // รองรับทั้ง 2 key
    licensePlate: '70-1234',
    province: 'นครปฐม',
    vehicleType: 'รถบรรทุก 10 ล้อ',
    brand: 'HINO', model: 'Victor', color: 'ขาว',
    timestamp: '2025-01-24 14:25',
    location: 'เขตปทุมวัน (LEZ)',
    camera: 'CAM-LEZ-01',
    status: 'No Green List',
    violationType: 'ตรวจจับรถบรรทุก (LEZ)',
    violationDetail: 'เครื่องยนต์ดีเซล (ไม่ผ่านการลงทะเบียน)',
    violationCount: 1,
    position: [13.7468, 100.5349]
  },
  {
    id: 'trk-02',
    category: 'truck',
    category: 'barrier',
    licensePlate: '71-5678',
    province: 'กรุงเทพมหานคร',
    vehicleType: 'รถบรรทุก 6 ล้อ',
    brand: 'ISUZU', model: 'ELF', color: 'ฟ้า',
    timestamp: '2025-01-24 14:30',
    location: 'เขตปทุมวัน (LEZ)',
    camera: 'CAM-LEZ-01',
    status: 'Green List',
    violationType: 'ตรวจจับรถบรรทุก (LEZ)',
    violationDetail: 'รถยนต์ไฟฟ้า (EV) - ได้รับยกเว้น',
    violationCount: 0,
    position: [13.7576, 100.5654]
  },
  {
    id: 'trk-03',
    category: 'truck',
    category: 'barrier',
    licensePlate: '73-3456',
    province: 'สมุทรสาคร',
    vehicleType: 'รถบรรทุก NGV',
    brand: 'FUSO', model: 'FI', color: 'ขาว',
    timestamp: '2025-01-24 15:00',
    location: 'เขตปทุมวัน (LEZ)',
    camera: 'CAM-LEZ-01',
    status: 'Green List',
    violationType: 'ตรวจจับรถบรรทุก (LEZ)',
    violationDetail: 'รถใช้ก๊าซ NGV - เป็นมิตรต่อสิ่งแวดล้อม',
    violationCount: 0,
    position: [13.7763, 100.5718]
  }
];

// =================================================================
// Helper Functions
// =================================================================

/**
 * ดึงข้อมูลสำหรับ ViolationList
 * @param {string} category - ประเภทการฝ่าฝืน (speed, blacklist, lane, etc.)
 */
export const getListData = (category) => {
  const data = category 
    ? globalTrafficData.filter(d => d.category === category || d.category === category) 
    : globalTrafficData;
  
  return data.map(item => ({
    ...item,
    lpr: item.licensePlate, // mapping ให้ตรงกับ ViolationCard
    type: item.vehicleType,
    time: item.timestamp,
    detail: item.violationDetail
  }));
};

/**
 * แปลงข้อมูลสำหรับ MapSidebar
 * @param {object} item - ข้อมูลรถ 1 คัน
 */
export const getMapData = (item) => {
  if (!item) return {};
  
  // Logic พิเศษสำหรับ Truck Barrier (แปลง Status text)
  let displayStatus = item.status;
  if (item.category === 'truck' || item.category === 'barrier') {
      displayStatus = item.status === 'Green List' ? 'อนุญาต (Green List)' : 'ฝ่าฝืน (No Green List)';
  }

  return {
    plateNumber: item.licensePlate || item.lpr,
    province: item.province || "กรุงเทพมหานคร",
    brand: item.brand || "-",
    model: item.model || "-",
    color: item.color || "-",
    vehicleType: item.vehicleType || item.type || "-",
    violationCount: item.violationCount || 0,
    status: displayStatus,
    reason: item.violationDetail || item.detail || "-",
    latestCamera: item.camera || "-",
    latestTime: item.timestamp || item.time || "-",
    latestLocation: item.location || "-",
    position: item.position || [13.7563, 100.5018],
    sequencePath: item.sequencePath // สำหรับ Blacklist
  };
};