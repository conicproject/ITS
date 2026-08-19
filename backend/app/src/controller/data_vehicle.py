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
        ค้นหาข้อมูล VEHICLE_PASS แบบแบ่งหน้า (server-side pagination)

        Payload:
        - date: "today" | "YYYY-MM-DD" (required)
        - province: str (optional) - รหัสจังหวัด
        - plate_no: str (optional) - ทะเบียนรถ (แทน lpr)
        - camera: int (optional) - CROSSING_ID
        - vehicle_type: str (optional)
        - vehicle_color: str (optional)
        - page: int (optional, default 1)
        - page_size: int (optional, default 10) - จำนวนรายการต่อหน้า

        ⚡ ไม่ดึงข้อมูลทั้งหมดมาไว้ที่ backend/frontend อีกต่อไป — ดึงเฉพาะ
        page_size แถวที่ต้องแสดง ณ หน้านั้น ๆ จาก database ตรง ๆ (LIMIT/OFFSET)
        พร้อม total_count จาก COUNT(*) OVER() ในตัว ทำให้ frontend คำนวณ
        total_pages ได้โดยไม่ต้อง query นับจำนวนแยกอีกรอบ
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
            vehicle_color = payload.get("vehicle_color")  # ✅ เพิ่ม filter สีที่ frontend ส่งมา

            # 🔹 frontend multi-select ส่งเป็น array (เช่น ["red"]) — เลือกตัวแรกไปก่อน
            # ถ้าต้องการรองรับหลายค่าจริง ๆ (IN (...)) ต้องแก้ repository เพิ่ม
            if isinstance(camera, list):
                camera = camera[0] if camera else None
            if isinstance(vehicle_type, list):
                vehicle_type = vehicle_type[0] if vehicle_type else None
            if isinstance(vehicle_color, list):
                vehicle_color = vehicle_color[0] if vehicle_color else None

            # 🔹 pagination params
            page = int(payload.get("page") or 1)
            page_size = int(payload.get("page_size") or 10)

            logger.debug(
                "📦 Search params: date=%s, province=%s, plate_no=%s, camera=%s, "
                "vehicle_type=%s, vehicle_color=%s, page=%s, page_size=%s",
                search_date, province, plate_no, camera, vehicle_type, vehicle_color, page, page_size,
            )

            # 🔹 เรียก service — คืนค่าเป็น (rows, total_count)
            rows, total_count = self.service.data_search_vehicle(
                date=search_date,
                province=province,
                lpr=plate_no,
                camera=camera,
                vehicle_type=vehicle_type,
                vehicle_color=vehicle_color,
                page=page,
                page_size=page_size,
            )

            return {
                "status": "success",
                "data": rows,
                "count": total_count,   # ✅ จำนวนทั้งหมดที่ตรง filter (ไม่ใช่แค่จำนวนแถวในหน้านี้)
                "page": page,
                "page_size": page_size,
                "filters": {
                    "date": str(search_date),
                    "province": province,
                    "plate_no": plate_no,
                    "camera": camera,
                    "vehicle_type": vehicle_type,
                    "vehicle_color": vehicle_color,
                }
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.exception("❌ Error in data_search_vehicle controller:")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")