# backend/app/src/services/data_vehicle.py
from src.repositories.data_vehicle import DataVehicleRepository
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

    def get_data_vehicle_5m(self):
        """ดึงข้อมูลล่าสุดจาก Oracle"""
        try:
            data = self.data_vehicle.get_data_vehicle_5m()
            if not data:
                logger.info("⏳ No new data from Oracle")
                return []
            
            logger.info(f"✅ Retrieved {len(data)} records from Oracle")
            return data
        except Exception as e:
            logger.exception("❌ Error in get_data_vehicle service:")
            raise

    def data_search_vehicle(self, date, province=None, lpr=None, camera=None, vehicle_type=None):
        """
        รองรับการ search หลายเงื่อนไข
        - date (required)
        - province (optional)
        - lpr (optional - ทะเบียนรถ)
        - camera (optional - CROSSING_ID)
        """
        try:
            logger.info(f"🔍 Searching with: date={date}, province={province}, lpr={lpr}, camera={camera}")
            
            data = self.data_vehicle.data_search_vehicle(
                date=date,
                province=province,
                lpr=lpr,
                camera=camera,
                vehicle_type=vehicle_type
            )

            if not data:
                logger.info("⏳ No results found for search criteria")
                return []

            logger.info(f"✅ Found {len(data)} matching records")
            return data
            
        except Exception as e:
            logger.exception("❌ Error in data_search_vehicle service:")
            raise