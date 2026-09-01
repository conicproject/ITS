# backend/app/scheduler/worker_blacklist_scheduler.py

import asyncio
import logging
from src.scheduler.blacklist_scheduler import BlacklistScheduler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    force=True
)

logger = logging.getLogger(__name__)

blacklist_scheduler = BlacklistScheduler()

async def main():
    logger.info("🚀 Blacklist Scheduler Started")
    await blacklist_scheduler.start()

if __name__ == "__main__":
    asyncio.run(main())