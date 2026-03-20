from src.services.data_vehicle import DataVehicleService
import logging
import time
import threading
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

service = DataVehicleService()

_scheduler_started = False


def _get_next_2m_slot() -> datetime:
    """คำนวณ slot ถัดไปที่หาร 2 ลงตัว เช่น 9:43 → 9:44, 9:59 → 10:00"""
    now = datetime.now()
    next_minute = ((now.minute // 2) + 1) * 2

    if next_minute >= 60:
        return now.replace(second=0, microsecond=0, minute=0) + timedelta(hours=1)
    return now.replace(second=0, microsecond=0, minute=next_minute)


def _get_current_slot() -> tuple[datetime, datetime]:
    now = datetime.now()
    slot_end_minute = (now.minute // 2) * 2
    slot_end = now.replace(second=0, microsecond=0, minute=slot_end_minute)
    slot_start = slot_end - timedelta(minutes=2)
    return slot_start, slot_end


def run_record_5m():
    slot_start, slot_end = _get_current_slot()
    try:
        logger.info(f"⏰ Running record_5m [{slot_start.strftime('%H:%M')} → {slot_end.strftime('%H:%M')}]")
        service.record_5m(slot_start, slot_end)
        logger.info("✅ record_5m completed")
    except Exception:
        logger.exception("❌ record_5m job failed")


def _scheduler_loop():
    while True:
        next_slot = _get_next_2m_slot()
        delay = (next_slot - datetime.now()).total_seconds()

        logger.info(f"⏳ Next run at {next_slot.strftime('%H:%M:%S')} (in {delay:.1f}s)")
        time.sleep(delay)

        run_record_5m()


def start_scheduler():
    global _scheduler_started
    if _scheduler_started:
        logger.warning("⚠️ Scheduler already running, skipping...")
        return
    _scheduler_started = True

    thread = threading.Thread(target=_scheduler_loop, daemon=True)
    thread.start()
    logger.info("🚀 Scheduler started — synced to 2-minute clock slots")