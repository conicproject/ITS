// src/pages/IncidentAccident/DataTest/incidentMockData.jsx

export const incidentData = [
  // =========================================================================
  // 1. Event-related Incidents (กิจกรรมมนุษย์) - Prefix: EV
  // =========================================================================
  {
    id: "EV-1001",
    type: "งานวิ่ง Bangkok Marathon 2025",
    subtype: "special_event",
    location: "สนามหลวง เขตพระนคร",
    datetime: "07/10/2568 04:30",
    severity: "Severe",
    status: "Verified",
    lat: 13.7555, // สนามหลวง
    lng: 100.4930,
    detail: "ปิดการจราจรโดยรอบสนามหลวงและถนนราชดำเนิน เพื่อจัดงานวิ่งมาราธอน",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "EV-1024",
    type: "จุดตรวจ DUI ทองหล่อ",
    subtype: "police_checkpoint",
    location: "ปากซอยทองหล่อ (สุขุมวิท 55)",
    datetime: "26/09/2568 23:15",
    severity: "Minor",
    status: "Verified",
    lat: 13.7245, // ทองหล่อ
    lng: 100.5785,
    detail: "ด่านตรวจวัดแอลกอฮอล์หน้าปากซอย การจราจรชะลอตัวเล็กน้อย",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "EV-1022",
    type: "คอนเสิร์ตใหญ่ Impact Arena",
    subtype: "concert",
    location: "อิมแพ็ค เมืองทองธานี",
    datetime: "22/09/2568 18:00",
    severity: "Severe",
    status: "New",
    lat: 13.9115, // เมืองทอง (นนทบุรี) - โซนเหนือ
    lng: 100.5490,
    detail: "รถติดสะสมบนทางด่วนแจ้งวัฒนะ ทางลงเมืองทองธานี",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "EV-1021",
    type: "การชุมนุมสันติภาพ",
    subtype: "protest",
    location: "อนุสาวรีย์ประชาธิปไตย",
    datetime: "20/09/2568 16:28",
    severity: "Minor",
    status: "Verified",
    lat: 13.7567, // ราชดำเนิน
    lng: 100.5018,
    detail: "กลุ่มผู้ชุมนุมรวมตัวบริเวณวนเวียนอนุสาวรีย์ฯ 1 ช่องทางซ้าย",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "EV-1027",
    type: "งานกาชาดสวนลุมพินี",
    subtype: "festival",
    location: "สวนลุมพินี เขตปทุมวัน",
    datetime: "19/09/2568 17:30",
    severity: "Severe",
    status: "Verified",
    lat: 13.7310, // สวนลุมพินี (ใจกลางเมือง)
    lng: 100.5415,
    detail: "ประชาชนหนาแน่นบริเวณประตูทางเข้า ถนนพระราม 4 รถติดขัด",
    plate: "-", province: "-", brand: "-", color: "-"
  },

  // =========================================================================
  // 2. Road Operation Failures (ระบบถนน/จราจร) - Prefix: RD
  // =========================================================================
  {
    id: "RD-1001",
    type: "งานซ่อมสะพาน",
    subtype: "road_construction",
    location: "สะพานพระราม 9 (ขาออก)",
    datetime: "07/10/2568 10:00",
    severity: "Severe",
    status: "Verified",
    lat: 13.6820, // สะพานแขวน (โซนใต้)
    lng: 100.5050,
    detail: "ปิด 1 ช่องทางซ้ายซ่อมรอยต่อสะพาน ท้ายแถวสะสม 2 กม.",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "RD-1024",
    type: "ไฟจราจรขัดข้อง แยกอโศก",
    subtype: "traffic_light_failure",
    location: "แยกอโศก-สุขุมวิท",
    datetime: "26/09/2568 16:28",
    severity: "Severe",
    status: "New",
    lat: 13.7370, // แยกอโศก (ใจกลางธุรกิจ)
    lng: 100.5610,
    detail: "ไฟสัญญาณดับทุกด้าน ตำรวจจราจรกำลังเร่งระบายรถด้วยมือ",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "RD-1029",
    type: "น้ำรอระบาย (ฝนตกหนัก)",
    subtype: "flood",
    location: "ถนนแจ้งวัฒนะ หน้าศูนย์ราชการ",
    datetime: "19/09/2568 15:45",
    severity: "Moderate",
    status: "In-Process",
    lat: 13.8860, // แจ้งวัฒนะ (โซนเหนือ)
    lng: 100.5640,
    detail: "น้ำท่วมขังสูง 15 ซม. รถเล็กควรหลีกเลี่ยง",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "RD-1043",
    type: "ถนนยุบตัว",
    subtype: "road_damage",
    location: "ถนนพระราม 2 (ก่อสร้างทางด่วน)",
    datetime: "12/09/2568 09:15",
    severity: "Severe",
    status: "Closed",
    lat: 13.6550, // พระราม 2 (โซนตะวันตกเฉียงใต้)
    lng: 100.4350,
    detail: "ผิวจราจรยุบตัวเป็นหลุมลึก ปิดการจราจรช่องทางขนาน",
    plate: "-", province: "-", brand: "-", color: "-"
  },

  // =========================================================================
  // 3. Hazardous Incidents (เหตุการณ์อันตราย) - Prefix: HZ
  // =========================================================================
  {
    id: "HZ-1001",
    type: "ไฟไหม้ชุมชน",
    subtype: "fire",
    location: "ชุมชนคลองเตย",
    datetime: "07/10/2568 12:20",
    severity: "Severe",
    status: "Verified",
    lat: 13.7080, // คลองเตย
    lng: 100.5550,
    detail: "เพลิงไหม้บ้านไม้เรือนไทย ลุกลามไว รถดับเพลิงเข้าพื้นที่ลำบาก",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "HZ-1024",
    type: "สารเคมีรั่วไหล ท่าเรือ",
    subtype: "chemical_leak",
    location: "ท่าเรือกรุงเทพ (คลองเตย)",
    datetime: "26/09/2568 14:00",
    severity: "Severe",
    status: "Verified",
    lat: 13.7030, // ท่าเรือ
    lng: 100.5750,
    detail: "ตู้คอนเทนเนอร์สารเคมีรั่วไหล กันพื้นที่รัศมี 500 เมตร",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "HZ-1022",
    type: "เผาขยะควันพิษ",
    subtype: "toxic_smoke",
    location: "เขตหนองจอก (ชานเมือง)",
    datetime: "22/09/2568 16:28",
    severity: "Moderate",
    status: "New",
    lat: 13.8540, // หนองจอก (โซนตะวันออกสุด)
    lng: 100.8600,
    detail: "กลุ่มควันสีดำจากการเผาขยะอิเล็กทรอนิกส์ ลอยปกคลุมถนน",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "HZ-1020",
    type: "หม้อแปลงระเบิด",
    subtype: "explosion",
    location: "ซอยอารีย์ (พหลโยธิน 7)",
    datetime: "18/09/2568 11:10",
    severity: "Minor",
    status: "New",
    lat: 13.7800, // อารีย์
    lng: 100.5440,
    detail: "หม้อแปลงระเบิดเสียงดัง ไฟดับเป็นวงกว้างในซอย",
    plate: "-", province: "-", brand: "-", color: "-"
  },

  // =========================================================================
  // 4. Obstruction-related Incidents (สิ่งกีดขวาง) - Prefix: OB
  // =========================================================================
  {
    id: "OB-1001",
    type: "แผ่นปูนหล่น",
    subtype: "falling_object",
    location: "ถนนรามคำแหง (แนวรถไฟฟ้า)",
    datetime: "07/10/2568 16:28",
    severity: "Severe",
    status: "Verified",
    lat: 13.7595, // รามคำแหง (โซนตะวันออก)
    lng: 100.6200,
    detail: "เศษปูนร่วงจากรางรถไฟฟ้า กีดขวางเลนขวา",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "OB-1024",
    type: "ตู้คอนเทนเนอร์หล่น",
    subtype: "debris",
    location: "ถนนลาดกระบัง",
    datetime: "26/09/2568 05:45",
    severity: "Severe",
    status: "Verified",
    lat: 13.7220, // ลาดกระบัง (ใกล้สุวรรณภูมิ)
    lng: 100.7800,
    detail: "รถเทรลเลอร์ทำตู้คอนเทนเนอร์ร่วงขวางถนนทุกช่องทาง",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "OB-1022",
    type: "ป้ายโฆษณาล้ม",
    subtype: "building_collapse",
    location: "ถนนวิภาวดีรังสิต",
    datetime: "22/09/2568 16:28",
    severity: "Moderate",
    status: "New",
    lat: 13.8050, // วิภาวดี
    lng: 100.5580,
    detail: "ป้ายโฆษณาขนาดใหญ่ล้มทับศาลาที่พักผู้โดยสารจากพายุลมแรง",
    plate: "-", province: "-", brand: "-", color: "-"
  },
  {
    id: "OB-1015",
    type: "ต้นไม้ล้มขวางถนน",
    subtype: "natural_obstruction",
    location: "ถนนอุทยาน (อักษะ)",
    datetime: "11/09/2568 16:28",
    severity: "Moderate",
    status: "Closed",
    lat: 13.7750, // พุทธมณฑล (โซนตะวันตก)
    lng: 100.3300,
    detail: "ต้นจามจุรีขนาดใหญ่ล้มขวางถนนหลังฝนตกหนัก",
    plate: "-", province: "-", brand: "-", color: "-"
  },

  // =========================================================================
  // 5. Vehicle Incident Data Workflow (อุบัติเหตุยานพาหนะ) - Prefix: VH
  // =========================================================================
  {
    id: "VH-1001",
    type: "รถชน อนุสาวรีย์ชัยฯ",
    subtype: "accident_bus",
    location: "วงเวียนอนุสาวรีย์ชัยสมรภูมิ",
    datetime: "07/10/2568 08:30",
    severity: "Moderate",
    status: "Verified",
    lat: 13.7649, // อนุสาวรีย์ชัยฯ
    lng: 100.5383,
    detail: "รถเมล์เบียดรถตู้โดยสารกลางวงเวียน รถติดขัดหนัก",
    plate: "12-4455", province: "กทม.", brand: "Isuzu", color: "แดง-ครีม"
  },
  {
    id: "VH-1024",
    type: "จักรยานล้ม สวนเบญจกิติ",
    subtype: "breakdown_bicycle",
    location: "สวนเบญจกิติ (ทางปั่นจักรยาน)",
    datetime: "26/09/2568 17:00",
    severity: "Minor",
    status: "Verified",
    lat: 13.7290, // สวนเบญจกิติ
    lng: 100.5580,
    detail: "จักรยานเสียหลักล้ม บาดเจ็บเล็กน้อย",
    plate: "-", province: "-", brand: "Trek", color: "ดำ"
  },
  {
    id: "VH-1022",
    type: "สิบล้อเบรกแตก",
    subtype: "breakdown_truck",
    location: "ทางด่วนบางนา-ตราด กม.5",
    datetime: "22/09/2568 14:15",
    severity: "Severe",
    status: "New",
    lat: 13.6650, // บางนา (โซนตะวันออกเฉียงใต้)
    lng: 100.6500,
    detail: "รถบรรทุกระบบเบรกขัดข้อง จอดเสียเลนขวาสุด",
    plate: "81-9988", province: "ชลบุรี", brand: "Hino", color: "ขาว"
  },
  {
    id: "VH-1021",
    type: "มอเตอร์ไซค์ชนท้าย",
    subtype: "accident_motorcycle",
    location: "วงเวียนใหญ่ (ฝั่งธนบุรี)",
    datetime: "20/09/2568 09:20",
    severity: "Minor",
    status: "Verified",
    lat: 13.7260, // วงเวียนใหญ่ (ฝั่งธน)
    lng: 100.4930,
    detail: "มอเตอร์ไซค์ชนท้ายรถกระบะ คู่กรณีกำลังเจรจา",
    plate: "1กข-5678", province: "กทม.", brand: "Honda", color: "แดง"
  },
  {
    id: "VH-1029",
    type: "รถเก๋งพลิกคว่ำ โทลล์เวย์",
    subtype: "overturn_car",
    location: "ดอนเมืองโทลล์เวย์ (หน้าสนามบิน)",
    datetime: "19/09/2568 23:45",
    severity: "Severe",
    status: "New",
    lat: 13.9120, // ดอนเมือง (โซนเหนือ)
    lng: 100.6000,
    detail: "รถเก๋งเสียหลักชนขอบทางพลิกคว่ำ กีดขวาง 2 ช่องทาง",
    plate: "ขง-9999", province: "กทม.", brand: "Toyota", color: "เทา"
  },
  {
    id: "VH-1020",
    type: "รถชน ทางคู่ขนานลอยฟ้า",
    subtype: "accident_car",
    location: "คู่ขนานลอยฟ้าบรมราชชนนี",
    datetime: "18/09/2568 19:30",
    severity: "Moderate",
    status: "New",
    lat: 13.7790, // บรมราชชนนี (โซนตะวันตก)
    lng: 100.4700,
    detail: "รถเก๋งชนกัน 3 คันรวด การจราจรติดขัดสลับหยุดนิ่ง",
    plate: "3กย-4321", province: "นครปฐม", brand: "Honda", color: "ขาว"
  },
  {
    id: "VH-1012",
    type: "รถเสีย สะพานตากสิน",
    subtype: "breakdown_car",
    location: "สะพานสมเด็จพระเจ้าตากสิน",
    datetime: "11/09/2568 07:45",
    severity: "Moderate",
    status: "Verified",
    lat: 13.7185, // สะพานตากสิน (ข้ามแม่น้ำ)
    lng: 100.5135,
    detail: "รถเก๋งความร้อนขึ้น จอดเสียเชิงทางลงฝั่งธนบุรี",
    plate: "ฌฌ-1234", province: "กทม.", brand: "Mazda", color: "แดง"
  },
];