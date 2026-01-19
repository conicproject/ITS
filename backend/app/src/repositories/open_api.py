# backend/app/src/repositories/open_api.py
import requests
import logging
import urllib3
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

# ปิดการแจ้งเตือน InsecureRequestWarning
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

logger = logging.getLogger(__name__)

class OpenAPIRepository:
    def __init__(self):
        self.base_url = "https://10.151.1.76:443"
        
        # สร้าง session พร้อม connection pooling
        self.session = requests.Session()
        self.session.verify = False
        
        # ตั้งค่า connection adapter สำหรับ connection pooling
        adapter = HTTPAdapter(
            pool_connections=10,
            pool_maxsize=20,
            max_retries=0  # ปิด retry ของ requests เพราะเราจัดการเอง
        )
        self.session.mount('http://', adapter)
        self.session.mount('https://', adapter)
        
        # Timeout settings
        self.auth_timeout = 30
        self.data_timeout = 120  # เพิ่มเป็น 120 วินาทีสำหรับ data query

    def get_auth(self):
        """ขอ access token จาก OAuth"""
        url = f"{self.base_url}/artemis/oauth/token"

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        }

        data = {
            "grant_type": "client_credentials",
            "client_id": "25239392",
            "client_secret": "JSyWspAtKjCvzDdFgE3F",
        }

        try:
            response = self.session.post(
                url,
                data=data,
                headers=headers,
                timeout=self.auth_timeout
            )

            if response.status_code != 200:
                raise Exception(f"Auth failed: {response.text}")

            return response.json()
            
        except requests.exceptions.Timeout:
            raise Exception("Authentication timeout")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Authentication error: {str(e)}")

    def get_vehicle_data(
        self,
        token: str,
        start_time: str,
        end_time: str,
        page_no: int,
        page_size: int = 500
    ):
        """
        Query vehicle data with pagination
        
        Args:
            token: Access token from OAuth
            start_time: Start datetime in format "YYYY-MM-DDTHH:MM:SS.000+07:00"
            end_time: End datetime in format "YYYY-MM-DDTHH:MM:SS.000+07:00"
            page_no: Page number (1-indexed)
            page_size: Number of records per page
            
        Returns:
            dict: Response with data and metadata
            
        Raises:
            Exception: When request fails or times out
        """
        url = f"{self.base_url}/artemis/api/aiapplication/v1/vehicle/data/query"

        headers = {
            "Content-Type": "application/json",
            "access_token": token,
        }

        payload = {
            "data": {
                "plateNo": "",
                "beginTime": start_time,
                "endTime": end_time,
                "crossIndexCodes": "",
                "laneNo": "",
                "plateProvince": "",
                "queryType": "vehiclealarm",
            },
            "metadata": {
                "pageNo": page_no,
                "pageSize": page_size,
            }
        }

        try:
            response = self.session.post(
                url,
                json=payload,
                headers=headers,
                timeout=self.data_timeout  # ใช้ timeout ที่สูงขึ้น
            )

            if response.status_code != 200:
                error_data = response.text
                raise Exception(f"API error (HTTP {response.status_code}): {error_data}")

            result = response.json()
            
            # ตรวจสอบว่ามี error code จาก backend หรือไม่
            if "code" in result and result["code"] != "0":
                msg = result.get("msg", "Unknown error")
                code = result.get("code", "")
                raise Exception(f'{{"msg":"{msg}","code":"{code}"}}')
            
            return result

        except requests.exceptions.Timeout:
            # แปลง timeout exception ให้เป็น format ที่ service รู้จัก
            raise Exception('{"msg":"backend service read timeout.","code":"0x02401033"}')
            
        except requests.exceptions.ConnectionError as e:
            raise Exception(f"Connection error: {str(e)}")
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Request error: {str(e)}")
        
    def __del__(self):
        """ปิด session เมื่อ object ถูกทำลาย"""
        if hasattr(self, 'session'):
            try:
                self.session.close()
            except:
                pass