# backend/app/src/scheduler/blacklist_scheduler.py
import asyncio
import logging
from datetime import datetime, timedelta
from src.services.blacklist import BlacklistService

logger = logging.getLogger(__name__)


def _get_next_5m_slot() -> datetime:
    """คำนวณ slot ถัดไปที่หาร 5 ลงตัว — เหมือน record_scheduler"""
    now = datetime.now()
    next_minute = ((now.minute // 5) + 1) * 5

    if next_minute >= 60:
        return now.replace(second=0, microsecond=0, minute=0) + timedelta(hours=1)
    return now.replace(second=0, microsecond=0, minute=next_minute)


class BlacklistScheduler:
    def __init__(self):
        self.blacklist_svc = BlacklistService()
        self._running = False

    async def _run_check(self):
        now = datetime.now()
        logger.info(f"🔍 Checking blacklist at {now.strftime('%H:%M:%S')}")
        try:
            results = self.blacklist_svc.check_blacklist_in_vehicle_pass(minutes=5)
            if results:
                logger.warning(
                    f"🚨 พบ blacklist ผ่าน {len(results)} คัน: "
                    # f"{[r['license_plate'] for r in results]}"
                    f"{[r['plate_no'] for r in results]}"
                )
            else:
                logger.info("✅ ไม่พบ blacklist ผ่านใน 5 นาทีที่ผ่านมา")
        except Exception as e:
            logger.error(f"Blacklist scheduler error: {e}")

    async def start(self):
        self._running = True

        while self._running:
            next_slot = _get_next_5m_slot()
            delay = (next_slot - datetime.now()).total_seconds()

            logger.info(
                f"⏳ Next blacklist check at {next_slot.strftime('%H:%M:%S')} "
                f"(in {delay:.1f}s)"
            )
            await asyncio.sleep(delay)
            await self._run_check()

    def stop(self):
        self._running = False
        logger.info("🛑 Blacklist scheduler stopped")