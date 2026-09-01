# backend/app/src/scheduler/test_one_slot.py
#
# ทดสอบดึงข้อมูล 1 slot (5 นาที) จาก Artemis เพื่อเช็คว่า connection
# ใช้งานได้แล้วหรือยัง ก่อนรัน manual_scheduler_daily.py เต็มวัน (288 slots)
#
# หมายเหตุ: ไม่ต้อง load_dotenv() แล้ว เพราะ config/artemis.py มีค่า
# default hardcode ไว้ (ARTEMIS_APP_KEY / ARTEMIS_APP_SECRET) แล้ว

# ============================================================
# 🔧 Workaround: Windows certificate store มี certificate ที่เสีย/
# format ผิดปกติอยู่ ทำให้ ssl.SSLContext.load_default_certs() ที่ urllib3
# เรียกอัตโนมัติทุกครั้ง (ไม่สนใจ verify=False) พังด้วย
# "ASN1: NOT_ENOUGH_DATA" ก่อนจะไปถึงขั้นตอนเชื่อมต่อจริง
#
# โค้ดฝั่ง VehicleRepository ใช้ verify=False อยู่แล้ว (ไม่ได้ตรวจสอบ
# certificate จริงอยู่แล้ว) จึงปิดการโหลด default certs นี้ไปเลย
# ไม่กระทบความปลอดภัยเพิ่มเติมจากที่โค้ดตั้งใจไว้แต่แรก
import ssl
ssl.SSLContext.load_default_certs = lambda self, *args, **kwargs: None
# ============================================================

from src.repositories.vehicle import VehicleRepository
from datetime import datetime

repo = VehicleRepository()

result = repo.service_vehicle_5m(filters={
    "slot_start": datetime(2026, 8, 17, 10, 0, 0),
    "slot_end": datetime(2026, 8, 17, 10, 5, 0),
})

print(result)