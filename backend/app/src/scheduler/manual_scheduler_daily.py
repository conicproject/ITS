# backend/app/src/scheduler/manual_scheduler_daily.py
#
# ใช้สำหรับ run ด้วยตนเอง เพื่อ "reset" ข้อมูลรถ (vehicle_pass, vehicle_alarm,
# vehicle_url) ของวันที่ระบุ — ลบข้อมูลเดิมของวันนั้นออกจากทั้ง 3 ตารางก่อน
# แล้วดึงข้อมูลใหม่จาก Artemis มา upsert กลับเข้าไปทีละ slot 5 นาที (288 slots/วัน)
#
# แก้ START_DATE / END_DATE ให้ตรงกับช่วงที่ต้องการ reset

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
from src.connection.postgres import PostgresConnection
from datetime import datetime, timedelta
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

# ============================================================
# ✏️  แก้วันที่ตรงนี้ (รองรับช่วงวันที่)
# ถ้าต้องการรันวันเดียว ให้ใส่ START_DATE = END_DATE เหมือนกัน
START_DATE = "17-08-2026"
END_DATE = "17-08-2026"
# ============================================================

# ตารางทั้ง 3 ที่ต้อง reset พร้อมกัน — ทุกตารางมีคอลัมน์ pass_time
TABLES = ["vehicle_pass", "vehicle_alarm", "vehicle_url"]

repo = VehicleRepository()


def parse_target_date(date_str: str) -> datetime.date:
    return datetime.strptime(date_str, "%d-%m-%Y").date()


def generate_date_range(start: datetime.date, end: datetime.date) -> list[datetime.date]:
    """สร้างรายการวันที่ทั้งหมดตั้งแต่ start ถึง end (รวมทั้งสองวัน)"""
    if start > end:
        raise ValueError(f"START_DATE ({start}) ต้องมาก่อนหรือเท่ากับ END_DATE ({end})")

    dates = []
    current = start
    while current <= end:
        dates.append(current)
        current += timedelta(days=1)
    return dates


def delete_records_for_date(date: datetime.date):
    """ลบข้อมูลใน vehicle_pass, vehicle_alarm, vehicle_url ตาม pass_time ของวันนั้น
    (ใช้ transaction เดียวคุมทั้ง 3 ตาราง — ถ้าตัวใดตัวหนึ่งล้มเหลว จะ rollback ทั้งหมด
    ไม่ให้ข้อมูลบางตารางถูกลบไปแล้วแต่บางตารางยังเหลืออยู่)"""
    conn = None
    cursor = None
    try:
        conn = PostgresConnection().get_connection()
        cursor = conn.cursor()

        total_deleted = {}
        for table in TABLES:
            cursor.execute(
                f"DELETE FROM {table} WHERE pass_time::date = %s",
                (date,)
            )
            total_deleted[table] = cursor.rowcount

        conn.commit()

        for table, count in total_deleted.items():
            logger.info(f"🗑️  Deleted {count} rows from {table} for date {date}")

    except Exception:
        logger.exception("❌ Failed to delete records")
        if conn:
            conn.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def generate_slots(date: datetime.date) -> list[tuple[datetime, datetime]]:
    """สร้าง slot ทุก 5 นาที ตั้งแต่ 00:00 → 24:00 (288 slots)"""
    slots = []
    slot_start = datetime(date.year, date.month, date.day, 0, 0, 0)
    day_end = slot_start + timedelta(days=1)

    while slot_start < day_end:
        slot_end = slot_start + timedelta(minutes=5)
        slots.append((slot_start, slot_end))
        slot_start = slot_end

    return slots


def run_for_date(date: datetime.date, today: datetime.date) -> tuple[int, int]:
    """รันการ reset สำหรับวันเดียว คืนค่า (success, failed)"""

    # ❌ ห้ามอนาคต
    if date > today:
        logger.error(f"❌ Future date not allowed: {date} — skipping")
        return 0, 0

    # ❌ ห้ามวันนี้ (ข้อมูลของวันนี้ยังไม่ครบ)
    if date == today:
        logger.error(f"❌ Today not allowed: {date} (data incomplete) — skipping")
        return 0, 0

    slots = generate_slots(date)

    logger.info(f"📅 Target date : {date}")
    logger.info(f"📦 Total slots : {len(slots)} slots (00:00 → 24:00)")
    logger.info(f"🎯 Tables      : {', '.join(TABLES)}")
    logger.info("=" * 60)

    delete_records_for_date(date)

    success = 0
    failed = 0

    for i, (slot_start, slot_end) in enumerate(slots, 1):
        label = f"[{slot_start.strftime('%H:%M')} → {slot_end.strftime('%H:%M')}]"
        try:
            result = repo.service_vehicle_5m(
                filters={"slot_start": slot_start, "slot_end": slot_end}
            )
            if result.get("success"):
                fetched = result.get("fetched", 0)
                upserted = result.get("upserted", {})
                if fetched == 0:
                    logger.warning(f"  ⚠️  ({i:3d}/{len(slots)}) {label} — no data fetched (0 records)")
                else:
                    logger.info(
                        f"  ✅ ({i:3d}/{len(slots)}) {label} "
                        f"pass={upserted.get('vehicle_pass', 0)} "
                        f"alarm={upserted.get('vehicle_alarm', 0)} "
                        f"url={upserted.get('vehicle_url', 0)}"
                    )
                success += 1
            else:
                logger.error(f"  ❌ ({i:3d}/{len(slots)}) {label} FAILED — {result.get('error')}")
                failed += 1
        except Exception:
            logger.error(f"  ❌ ({i:3d}/{len(slots)}) {label} FAILED (exception)")
            failed += 1

    logger.info("-" * 60)
    logger.info(f"🏁 Day done ({date}) — success: {success}, failed: {failed}, total: {len(slots)}")
    logger.info("=" * 60)

    return success, failed


def run_reset(start_date_str: str, end_date_str: str):
    start = parse_target_date(start_date_str)
    end = parse_target_date(end_date_str)
    today = datetime.now().date()

    dates = generate_date_range(start, end)

    logger.info(f"🚀 Running reset for {len(dates)} day(s): {start} → {end}")
    logger.info(f"🎯 Tables: {', '.join(TABLES)}")
    logger.info("=" * 60)

    total_success = 0
    total_failed = 0
    processed_days = 0

    for date in dates:
        success, failed = run_for_date(date, today)
        if success or failed:
            processed_days += 1
        total_success += success
        total_failed += failed

    logger.info("#" * 60)
    logger.info(
        f"🎉 ALL DONE — days processed: {processed_days}/{len(dates)} | "
        f"total success: {total_success} | total failed: {total_failed}"
    )


if __name__ == "__main__":
    run_reset(START_DATE, END_DATE)