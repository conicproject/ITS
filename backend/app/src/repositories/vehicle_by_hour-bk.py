import base64
import hashlib
import hmac
import json
import logging
import time
from datetime import datetime, timezone, timedelta

import requests
from config.artemis import (
    ARTEMIS_HOST,
    ARTEMIS_APP_KEY,
    ARTEMIS_APP_SECRET
)

logger = logging.getLogger(__name__)

ACCEPT_HEADER = "application/json"
CONTENT_TYPE_HEADER = "application/json"

VEHICLE_TYPES = [
    "vehicle",
    "twoWheelVehicle",
    "pickupTruck",
    "largeBus",
    "buggy",
    "truck",
    "threeWheelVehicle",
    "SUVMPV",
    "van",
    "pedestrian",
]


class VehicleByHourRepository:

    def __init__(self):
        self.base_url = f"https://{ARTEMIS_HOST}"
        self.path = "/artemis/api/xtransfer-qcs/v1/vehicle/ds/query/page"
        self.url = f"{self.base_url}{self.path}"
        # Asia/Bangkok = UTC+7
        self.tz = timezone(timedelta(hours=7))

    def _build_signed_headers(self, body_bytes: bytes):

        content_md5 = (
            base64.b64encode(
                hashlib.md5(body_bytes).digest()
            ).decode("utf-8")
            if body_bytes
            else ""
        )

        date_str = time.strftime(
            "%a, %d %b %Y %H:%M:%S GMT",
            time.gmtime()
        )

        string_to_sign = (
            f"POST\n"
            f"{ACCEPT_HEADER}\n"
            f"{content_md5}\n"
            f"{CONTENT_TYPE_HEADER}\n"
            f"{date_str}\n"
            f"{self.path}"
        )

        signature = base64.b64encode(
            hmac.new(
                ARTEMIS_APP_SECRET.encode("utf-8"),
                string_to_sign.encode("utf-8"),
                hashlib.sha256
            ).digest()
        ).decode("utf-8")

        return {
            "Accept": ACCEPT_HEADER,
            "Content-Type": CONTENT_TYPE_HEADER,
            "Content-MD5": content_md5,
            "Date": date_str,
            "X-Ca-Key": ARTEMIS_APP_KEY,
            "X-Ca-Signature": signature
        }

    def _get_day_range(self, target_date: str = None):
        """
        target_date: 'YYYY-MM-DD' ถ้าไม่ส่งมา ใช้ "วันนี้" ตาม timezone Asia/Bangkok
        คืน (beginTime, endTime) ของวันนั้นวันเดียวเท่านั้น (00:00:00.000 - 23:59:59.999)
        ทำให้เมื่อข้ามวัน ยอดจะเริ่มนับใหม่จาก 0 โดยอัตโนมัติ ไม่พ่วงยอดวันก่อนหน้า
        """
        if target_date:
            day = datetime.strptime(target_date, "%Y-%m-%d").replace(tzinfo=self.tz)
        else:
            day = datetime.now(self.tz)

        begin = day.replace(hour=0, minute=0, second=0, microsecond=0)
        end = day.replace(hour=23, minute=59, second=59, microsecond=999000)

        begin_str = begin.strftime("%Y-%m-%dT%H:%M:%S.") + f"{begin.microsecond // 1000:03d}+07:00"
        end_str = end.strftime("%Y-%m-%dT%H:%M:%S.") + f"{end.microsecond // 1000:03d}+07:00"

        return begin_str, end_str

    def _request_total(
        self,
        vehicle_type,
        direction,
        begin_time,
        end_time,
    ):

        payload = {

            # ใช้แค่ total ไม่ต้องดึงข้อมูลเยอะ
            "pageSize": 1,
            "pageNo": 1,

            "vehicleType": vehicle_type,

            "directionIndex": direction,

            "beginTime": begin_time,

            "endTime": end_time,
        }

        body_str = json.dumps(
            payload,
            separators=(",", ":")
        )

        body_bytes = body_str.encode("utf-8")

        headers = self._build_signed_headers(
            body_bytes
        )

        try:

            response = requests.post(
                self.url,
                data=body_bytes,
                headers=headers,
                verify=False,
                timeout=30
            )

            response.raise_for_status()

            result = response.json()

            if result.get("code") not in ("0", 0):

                logger.warning(
                    f"Artemis Error {result}"
                )

                return 0

            return (
                result
                .get("data", {})
                .get("total", 0)
            )

        except Exception as e:

            logger.exception(
                f"Request error {vehicle_type} {direction}"
            )

            return 0

    def get_vehicle_by_hour(self, filters: dict = None):
        """
        filters: { "date": "YYYY-MM-DD" } (optional)
        ไม่ส่ง date -> ใช้วันนี้เสมอ ทำให้เมื่อข้ามวันปฏิทิน ยอดจะรีเซ็ต
        เป็นของวันใหม่โดยอัตโนมัติ (เพราะ beginTime/endTime ขยับตามวันที่จริง)
        """
        filters = filters or {}
        target_date = filters.get("date")  # None = วันนี้

        begin_time, end_time = self._get_day_range(target_date)

        result = {}

        for vehicle_type in VEHICLE_TYPES:

            east_west = self._request_total(vehicle_type, "eastWest", begin_time, end_time)
            west_east = self._request_total(vehicle_type, "westEast", begin_time, end_time)

            result[vehicle_type] = {
                "total": east_west + west_east,
                "eastWest": east_west,
                "westEast": west_east,
            }

        resolved_date = target_date or datetime.now(self.tz).strftime("%Y-%m-%d")

        return {
            "success": True,
            "data": result,
            "date": resolved_date,
        }