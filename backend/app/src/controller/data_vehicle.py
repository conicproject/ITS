# backend/app/src/controller/data_vehicle.py
from fastapi import HTTPException, Body
from src.services.data_vehicle import DataVehicleService
from datetime import datetime, date
import logging

logger = logging.getLogger(__name__)

class DataVehicleController:
    def __init__(self):
        self.service = DataVehicleService()

    async def get_data_vehicle(self):
        """ดึงข้อมูลล่าสุดจาก Oracle"""
        try:
            result = self.service.get_data_vehicle()
            return {
                "status": "success", 
                "data": result,
                "count": len(result)
            }
        except Exception as e:
            logger.exception("❌ Error in get_data_vehicle controller:")
            raise HTTPException(status_code=500, detail=str(e))
    
    async def record_5m(self):
        """ดึงข้อมูลล่าสุดจาก Oracle"""
        try:
            result = self.service.record_5m()
            return {
                "status": "success", 
                "data": result,
                "count": len(result)
            }
        except Exception as e:
            logger.exception("❌ Error in get_data_vehicle controller:")
            raise HTTPException(status_code=500, detail=str(e))

    async def data_search_vehicle(self, payload: dict = Body(...)):
        """
        ค้นหาข้อมูล VEHICLE_PASS
        
        Payload:
        - date: "today" | "YYYY-MM-DD" (required)
        - province: str (optional) - รหัสจังหวัด
        - plate_no: str (optional) - ทะเบียนรถ (แทน lpr)
        - camera: int (optional) - CROSSING_ID
        """
        try:
            # 🔹 จัดการ date parameter
            raw_date = payload.get("date", "today")

            if raw_date == "today":
                search_date = date.today()
                logger.info(f"🔍 Searching for today: {search_date}")
            else:
                try:
                    search_date = datetime.strptime(raw_date, "%Y-%m-%d").date()
                    logger.info(f"🔍 Searching for date: {search_date}")
                except ValueError:
                    raise HTTPException(
                        status_code=400, 
                        detail="Invalid date format. Use 'today' or 'YYYY-MM-DD'"
                    )

            # 🔹 เปลี่ยนจาก lpr → plate_no เพื่อความชัดเจน
            plate_no = payload.get("plate_no") or payload.get("lpr")
            province = payload.get("province")
            camera = payload.get("camera")
            vehicle_type = payload.get("vehicle_type")

            logger.debug(f"📦 Search params: date={search_date}, province={province}, plate_no={plate_no}, camera={camera}, vehicle_type={vehicle_type}")

            # 🔹 เรียก service
            result = self.service.data_search_vehicle(
                date=search_date,
                province=province,
                lpr=plate_no,
                camera=camera,
                vehicle_type=vehicle_type
            )

            return {
                "status": "success", 
                "data": result,
                "count": len(result),
                "filters": {
                    "date": str(search_date),
                    "province": province,
                    "plate_no": plate_no,
                    "camera": camera
                }
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.exception("❌ Error in data_search_vehicle controller:")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")