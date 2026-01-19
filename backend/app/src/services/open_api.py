# backend/app/src/services/open_api.py
from src.repositories.open_api import OpenAPIRepository
import logging
import time

logger = logging.getLogger(__name__)

class OpenAPIService:
    def __init__(self):
        self.repo = OpenAPIRepository()
        self.max_retries = 10  # เพิ่มจาก 5 เป็น 10
        self.initial_retry_delay = 2  # เริ่มต้นที่ 2 วินาที
        self.max_retry_delay = 30  # สูงสุด 30 วินาที

    def get_auth(self):
        return self.repo.get_auth()

    def _fetch_page_with_retry(
        self, 
        access_token: str, 
        start_date: str, 
        end_date: str, 
        page_no: int, 
        page_size: int
    ) -> dict:
        """
        ดึงข้อมูลหน้าเดียว พร้อม retry mechanism แบบ exponential backoff
        
        Returns:
            dict: {"items": [...], "metadata": {...}} (สำหรับหน้าแรก)
                  หรือ {"items": [...]} (สำหรับหน้าอื่นๆ)
        """
        retry = 0
        
        while retry <= self.max_retries:
            try:
                if retry == 0:
                    logger.info(f"📄 กำลังดึงหน้าที่ {page_no}...")
                else:
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
                metadata = data.get("metadata")
                
                logger.info(f"✅ ดึงหน้าที่ {page_no} สำเร็จ - ได้ {len(items)} รายการ")
                
                # หน้าแรกต้องการ metadata ด้วย
                if page_no == 1:
                    return {"items": items, "metadata": metadata}
                else:
                    return {"items": items}

            except Exception as e:
                error_str = str(e)
                
                # ตรวจสอบว่าเป็น timeout error หรือไม่
                is_timeout = (
                    "0x02401033" in error_str or 
                    "backend service read timeout" in error_str.lower() or
                    "timeout" in error_str.lower()
                )
                
                if is_timeout:
                    retry += 1
                    
                    if retry <= self.max_retries:
                        # Exponential backoff with cap
                        wait_time = min(
                            self.initial_retry_delay * (2 ** (retry - 1)),
                            self.max_retry_delay
                        )
                        
                        logger.warning(
                            f"⏱️ หน้าที่ {page_no} timeout "
                            f"- retry ครั้งที่ {retry}/{self.max_retries} "
                            f"รอ {wait_time} วินาที..."
                        )
                        time.sleep(wait_time)
                    else:
                        logger.error(
                            f"❌ หน้าที่ {page_no} timeout หลังจาก retry {self.max_retries} ครั้ง"
                        )
                        raise Exception(
                            f"หน้า {page_no} timeout หลังจาก retry {self.max_retries} ครั้ง: {error_str}"
                        )
                else:
                    # ถ้าไม่ใช่ timeout error ให้ throw ทันที
                    logger.error(f"❌ หน้าที่ {page_no} เกิดข้อผิดพลาด: {error_str}")
                    raise

        raise Exception(f"ไม่สามารถดึงหน้า {page_no} ได้หลังจาก retry {self.max_retries} ครั้ง")

    def get_data_yesterday(self, start_date: str, end_date: str):
        """ดึงข้อมูลทีละหน้าตามลำดับจนครบ total_page พร้อม auto-retry สำหรับ timeout"""
        
        # 1. Get authentication token
        auth = self.repo.get_auth()
        access_token = auth.get("access_token")

        if not access_token:
            raise Exception("ไม่พบ access_token")

        page_size = 500
        all_data = []
        
        logger.info("🚀 เริ่มดึงข้อมูล - กำลังตรวจสอบหน้าแรก...")
        
        # 2. ดึงหน้าแรก (รวม metadata)
        try:
            first_page_result = self._fetch_page_with_retry(
                access_token=access_token,
                start_date=start_date,
                end_date=end_date,
                page_no=1,
                page_size=page_size
            )
            
            first_page_items = first_page_result["items"]
            metadata = first_page_result["metadata"]

            if not metadata:
                raise Exception("หน้าแรกไม่มี metadata")

            total_page = metadata["totalPage"]
            total_count = metadata["totalCount"]

            logger.info(
                f"📊 ข้อมูลทั้งหมด: {total_count:,} รายการ, "
                f"{total_page:,} หน้า (หน้าละ {page_size} รายการ)"
            )
            
            all_data.extend(first_page_items)

        except Exception as e:
            logger.error(f"❌ ไม่สามารถดึงหน้าแรกได้: {str(e)}")
            raise

        # 3. ดึงหน้าที่เหลือ (page 2 ถึง total_page)
        for page_no in range(2, total_page + 1):
            try:
                page_result = self._fetch_page_with_retry(
                    access_token=access_token,
                    start_date=start_date,
                    end_date=end_date,
                    page_no=page_no,
                    page_size=page_size
                )
                
                items = page_result["items"]
                all_data.extend(items)
                
                # แสดง progress
                progress_percent = (page_no * 100) // total_page
                logger.info(
                    f"📥 ความคืบหน้า: {page_no}/{total_page} หน้า "
                    f"({progress_percent}%) - รวม {len(all_data):,} รายการ"
                )
                
                # พักเล็กน้อยระหว่างหน้า (ป้องกัน rate limit)
                if page_no < total_page:
                    time.sleep(0.5)
                
            except Exception as e:
                logger.error(
                    f"❌ หยุดการดึงข้อมูลที่หน้า {page_no}/{total_page} "
                    f"เนื่องจากเกิดข้อผิดพลาด: {str(e)}"
                )
                logger.info(f"📦 ได้ข้อมูลบางส่วน: {len(all_data):,} รายการจาก {page_no - 1} หน้า")
                raise

        # 4. ตรวจสอบความสมบูรณ์ของข้อมูล
        data_diff = total_count - len(all_data)
        
        if data_diff != 0:
            if data_diff > 0:
                logger.warning(
                    f"⚠️ ข้อมูลขาดหาย {data_diff:,} รายการ "
                    f"(ได้ {len(all_data):,}/{total_count:,})"
                )
            else:
                logger.warning(
                    f"⚠️ ได้ข้อมูลมากเกิน {abs(data_diff):,} รายการ "
                    f"(ได้ {len(all_data):,}/{total_count:,})"
                )
        else:
            logger.info(f"✅ ได้ข้อมูลครบถ้วน {len(all_data):,} รายการ")
        
        logger.info(
            f"🎉 ดึงข้อมูลเสร็จสิ้น - ได้ทั้งหมด {len(all_data):,} รายการ "
            f"จาก {total_page:,} หน้า"
        )

        return {
            "total": len(all_data),
            "pages_fetched": total_page,
            "expected_total": total_count,
            "data_diff": data_diff,
            "data": all_data
        }