# backend/app/src/services/open_api.py
from src.repositories.open_api import OpenAPIRepository
import logging
import time

logger = logging.getLogger(__name__)

class OpenAPIService:
    def __init__(self):
        self.repo = OpenAPIRepository()
        self.max_retries = 5
        self.retry_delay = 3

    def get_auth(self):
        return self.repo.get_auth()

    def _fetch_page(
        self, 
        access_token: str, 
        start_date: str, 
        end_date: str, 
        page_no: int, 
        page_size: int
    ) -> list:
        """ดึงข้อมูลหน้าเดียว พร้อม retry mechanism สำหรับ timeout"""
        retry = 0
        
        while retry < self.max_retries:
            try:
                logger.info(f"📄 กำลังดึงหน้าที่ {page_no}... (ครั้งที่ {retry + 1})")
                
                response = self.repo.get_vehicle_data(
                    token=access_token,
                    start_time=start_date,
                    end_time=end_date,
                    page_no=page_no,
                    page_size=page_size
                )

                data = response.get("data", {})
                items = data.get("items", [])
                
                logger.info(f"✅ ดึงหน้าที่ {page_no} สำเร็จ - ได้ {len(items)} รายการ")
                return items  # ส่ง list of dict objects

            except Exception as e:
                error_str = str(e)
                
                if "0x02401033" in error_str or "backend service read timeout" in error_str.lower():
                    retry += 1
                    
                    if retry < self.max_retries:
                        wait_time = self.retry_delay * retry
                        logger.warning(
                            f"⏱️ หน้าที่ {page_no} timeout (0x02401033) "
                            f"- retry ครั้งที่ {retry}/{self.max_retries} "
                            f"รอ {wait_time} วินาที..."
                        )
                        time.sleep(wait_time)
                    else:
                        logger.error(
                            f"❌ หน้าที่ {page_no} timeout หลังจาก retry {self.max_retries} ครั้ง"
                        )
                        raise Exception(
                            f"หน้า {page_no} timeout (0x02401033) "
                            f"หลังจาก retry {self.max_retries} ครั้ง"
                        )
                else:
                    logger.error(f"❌ หน้าที่ {page_no} เกิดข้อผิดพลาด: {error_str}")
                    raise

        raise Exception(f"ไม่สามารถดึงหน้า {page_no} ได้หลังจาก retry {self.max_retries} ครั้ง")

    def get_data_yesterday(self, start_date: str, end_date: str):
        """ดึงข้อมูลทีละหน้าตามลำดับจนครบ total_page พร้อม retry สำหรับ timeout"""
        auth = self.repo.get_auth()
        access_token = auth.get("access_token")

        if not access_token:
            raise Exception("ไม่พบ access_token")

        page_size = 500
        all_data = []
        
        logger.info("🚀 เริ่มดึงข้อมูล - กำลังตรวจสอบหน้าแรก...")
        
        try:
            first_page_items = self._fetch_page(
                access_token=access_token,
                start_date=start_date,
                end_date=end_date,
                page_no=1,
                page_size=page_size
            )
            
            response = self.repo.get_vehicle_data(
                token=access_token,
                start_time=start_date,
                end_time=end_date,
                page_no=1,
                page_size=page_size
            )
            
            data = response.get("data", {})
            metadata = data.get("metadata")

            if not metadata:
                raise Exception("หน้าแรกไม่มี metadata")

            total_page = metadata["totalPage"]
            total_count = metadata["totalCount"]

            logger.info(
                f"📊 ข้อมูลทั้งหมด: {total_count} รายการ, "
                f"{total_page} หน้า (หน้าละ {page_size} รายการ)"
            )
            
            all_data.extend(first_page_items)

        except Exception as e:
            logger.error(f"❌ ไม่สามารถดึงหน้าแรกได้: {str(e)}")
            raise

        for page_no in range(2, total_page + 1):
            try:
                items = self._fetch_page(
                    access_token=access_token,
                    start_date=start_date,
                    end_date=end_date,
                    page_no=page_no,
                    page_size=page_size
                )
                
                all_data.extend(items)
                
                progress_percent = (page_no * 100) // total_page
                logger.info(
                    f"📥 ความคืบหน้า: {page_no}/{total_page} หน้า "
                    f"({progress_percent}%) - รวม {len(all_data)} รายการ"
                )
                
            except Exception as e:
                logger.error(
                    f"❌ หยุดการดึงข้อมูลที่หน้า {page_no}/{total_page} "
                    f"เนื่องจากเกิดข้อผิดพลาด: {str(e)}"
                )
                logger.info(f"📦 ได้ข้อมูลบางส่วน: {len(all_data)} รายการจาก {page_no - 1} หน้า")
                raise

        if len(all_data) < total_count:
            logger.warning(
                f"⚠️ ได้ข้อมูล {len(all_data)} รายการ "
                f"น้อยกว่าที่คาดหวัง {total_count} รายการ"
            )
        elif len(all_data) > total_count:
            logger.warning(
                f"⚠️ ได้ข้อมูล {len(all_data)} รายการ "
                f"มากกว่าที่คาดหวัง {total_count} รายการ"
            )
        else:
            logger.info(f"✅ ได้ข้อมูลครบถ้วน {len(all_data)} รายการ")
        
        logger.info(f"🎉 ดึงข้อมูลเสร็จสิ้น - ได้ทั้งหมด {len(all_data)} รายการ จาก {total_page} หน้า")

        return {
            "total": len(all_data),
            "pages_fetched": total_page,
            "expected_total": total_count,
            "data": all_data  # ✅ list of dict objects
        }