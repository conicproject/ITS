# backend/app/src/services/data_vehicle.py
from src.repositories.data_vehicle import DataVehicleRepository
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class DataVehicleService:
    def __init__(self):
        self.data_vehicle = DataVehicleRepository()

    def get_data_vehicle(self):
        """ดึงข้อมูลล่าสุดจาก Oracle"""
        try:
            data = self.data_vehicle.get_data_vehicle()
            if not data:
                logger.info("⏳ No new data from Oracle")
                return []

            logger.info(f"✅ Retrieved {len(data)} records from Oracle")
            return data
        except Exception as e:
            logger.exception("❌ Error in get_data_vehicle service:")
            raise

    def record_5m(self, slot_start: datetime, slot_end: datetime):
        try:
            self.data_vehicle.record_5m(slot_start, slot_end)
            logger.info(f"✅ record_5m aggregated [{slot_start} → {slot_end}]")
        except Exception:
            logger.exception("❌ Error in record_5m service:")
            raise

    def data_search_vehicle(
        self,
        date,
        date_to=None,
        province=None,
        lpr=None,
        camera=None,
        vehicle_type=None,
        vehicle_color=None,
        page=1,
        page_size=10,
    ):
        try:
            page = max(int(page or 1), 1)
            page_size = min(max(int(page_size or 10), 1), 100)  # กันไม่ให้ขอเยอะเกินไป
            offset = (page - 1) * page_size

            logger.info(
                "🔍 Searching with: date=%s, date_to=%s, province=%s, lpr=%s, camera=%s, "
                "vehicle_type=%s, vehicle_color=%s, page=%s, page_size=%s",
                date, date_to, province, lpr, camera, vehicle_type, vehicle_color, page, page_size,
            )

            # ⚡ repository ยิง query เดียว (COUNT(*) OVER()) ได้ทั้งข้อมูลหน้านี้ + total count
            rows, total_count = self.data_vehicle.data_search_vehicle(
                date=date,
                date_to=date_to,
                province=province,
                lpr=lpr,
                camera=camera,
                vehicle_type=vehicle_type,
                vehicle_color=vehicle_color,
                limit=page_size,
                offset=offset,
            )

            if not rows:
                logger.info("⏳ No results found for search criteria")
                return [], 0

            logger.info(f"✅ Found {len(rows)} rows on page {page} (total match = {total_count})")
            return rows, total_count

        except Exception as e:
            logger.exception("❌ Error in data_search_vehicle service:")
            raise