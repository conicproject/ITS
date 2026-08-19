# backend/app/scheduler/worker_vehicle_scheduler.py

import logging
import time
from src.scheduler.vehicle_scheduler import start_scheduler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    force=True
)

logger = logging.getLogger(__name__)

logger.info("🚀 Vehicle Scheduler Started")

start_scheduler()

while True:
    time.sleep(60)