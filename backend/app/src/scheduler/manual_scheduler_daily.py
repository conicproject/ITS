# manual_scheduler_daily.py
# ใช้สำหรับ run ด้วยตนเอง เพื่อ re-aggregate ข้อมูลทั้งวัน
# แก้ TARGET_DATE ให้ตรงกับวันที่ต้องการ

from src.services.data_vehicle import DataVehicleService
from datetime import datetime, timedelta
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

# ============================================================
# ✏️  แก้วันที่ตรงนี้
TARGET_DATE = "24-03-2026"
# ============================================================

service = DataVehicleService()


def parse_target_date(date_str: str) -> datetime.date:
    return datetime.strptime(date_str, "%d-%m-%Y").date()


def delete_records_for_date(date: datetime.date):
    """ลบข้อมูลใน records ตาม created_date"""
    conn = None
    cursor = None
    try:
        conn = service.data_vehicle.postgres_conn.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM records WHERE created_date::date = %s",
            (date,)
        )
        deleted = cursor.rowcount
        conn.commit()
        logger.info(f"🗑️  Deleted {deleted} rows for date {date}")
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


def run_daily(date_str: str):
    date = parse_target_date(date_str)

    today = datetime.now().date()

    # ❌ ห้ามอนาคต
    if date > today:
        logger.error(f"❌ Future date not allowed: {date}")
        return

    # ❌ ห้ามวันนี้
    if date == today:
        logger.error(f"❌ Today not allowed: {date} (data incomplete)")
        return

    slots = generate_slots(date)

    logger.info(f"📅 Target date : {date}")
    logger.info(f"📦 Total slots : {len(slots)} slots (00:00 → 24:00)")
    logger.info("=" * 60)

    delete_records_for_date(date)

    success = 0
    failed = 0

    for i, (slot_start, slot_end) in enumerate(slots, 1):
        label = f"[{slot_start.strftime('%H:%M')} → {slot_end.strftime('%H:%M')}]"
        try:
            service.record_5m(slot_start, slot_end)
            logger.info(f"  ✅ ({i:3d}/{len(slots)}) {label}")
            success += 1
        except Exception:
            logger.error(f"  ❌ ({i:3d}/{len(slots)}) {label} FAILED")
            failed += 1

    logger.info("=" * 60)
    logger.info(f"🏁 Done — success: {success}, failed: {failed}, total: {len(slots)}")


if __name__ == "__main__":
    run_daily(TARGET_DATE)