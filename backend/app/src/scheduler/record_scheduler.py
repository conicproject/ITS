from src.services.data_vehicle import DataVehicleService
import logging
import time
import threading
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

service = DataVehicleService()

_scheduler_started = False


def _get_next_5m_slot() -> datetime:
    """คำนวณ slot ถัดไปที่หาร 5 ลงตัว เช่น 9:43 → 9:45, 9:59 → 10:00"""
    now = datetime.now()
    next_minute = ((now.minute // 5) + 1) * 5

    if next_minute >= 60:
        return now.replace(second=0, microsecond=0, minute=0) + timedelta(hours=1)
    return now.replace(second=0, microsecond=0, minute=next_minute)


def _scheduler_loop():
    while True:
        next_slot = _get_next_5m_slot()
        delay = (next_slot - datetime.now()).total_seconds()

        logger.info(f"⏳ Next run at {next_slot.strftime('%H:%M:%S')} (in {delay:.1f}s)")
        time.sleep(delay)

        slot_end = next_slot
        slot_start = slot_end - timedelta(minutes=5)
        run_record_5m(slot_start, slot_end)


def run_record_5m(slot_start: datetime, slot_end: datetime):
    try:
        logger.info(f"⏰ Running record_5m [{slot_start.strftime('%H:%M')} → {slot_end.strftime('%H:%M')}]")
        service.record_5m(slot_start, slot_end)
        logger.info("✅ record_5m completed")
    except Exception:
        logger.exception("❌ record_5m job failed")


def start_scheduler():
    global _scheduler_started
    if _scheduler_started:
        logger.warning("⚠️ Scheduler already running, skipping...")
        return
    _scheduler_started = True

    thread = threading.Thread(target=_scheduler_loop, daemon=True)
    thread.start()
    logger.info("🚀 Scheduler started — synced to 5-minute clock slots")