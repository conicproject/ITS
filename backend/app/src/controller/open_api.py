# backend/app/src/controllers/open_api.py
from fastapi import HTTPException
from src.services.open_api import OpenAPIService
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class OpenAPIController:
    def __init__(self):
        self.service = OpenAPIService()

    async def get_auth(self):
        try:
            return {
                "status": "success",
                "data": self.service.get_auth()
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_data_yesterday(self):
        try:
            yesterday = datetime.now() - timedelta(days=6)

            start_date = yesterday.strftime("%Y-%m-%dT00:00:00.000+07:00")
            end_date = yesterday.strftime("%Y-%m-%dT23:59:59.000+07:00")

            logger.info(f"📅 Query Date Range: {start_date} → {end_date}")

            result = self.service.get_data_yesterday(start_date, end_date)

            return {
                "status": "success",
                "message": f"ดึงข้อมูลได้ทั้งหมด {result['total']} รายการ จาก {result['pages_fetched']} หน้า",
                "total": result["total"],
                "pages_fetched": result["pages_fetched"],
                "expected_total": result["expected_total"],
                "data": result["data"]  # ✅ list of dict objects
            }

        except Exception as e:
            logger.error(f"❌ Controller Error: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))