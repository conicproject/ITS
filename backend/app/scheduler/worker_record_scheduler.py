# backend/app/scheduler/worker_record_scheduler.py

import logging
import time
from src.scheduler.record_scheduler import start_scheduler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    force=True
)

logger = logging.getLogger(__name__)

logger.info("🚀 Record Scheduler Started")

start_scheduler()

while True:
    time.sleep(60)