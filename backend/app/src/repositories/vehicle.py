# backend/app/src/repositories/vehicle.py

import base64
import hashlib
import hmac
import json
import logging
import time
from datetime import datetime, timezone, timedelta

import requests
import urllib3
from psycopg2.extras import execute_values

from config.artemis import (
    ARTEMIS_HOST,
    ARTEMIS_APP_KEY,
    ARTEMIS_APP_SECRET
)
from src.connection.postgres import PostgresConnection
from src.utils.vehicle_pass_mapper import map_record, UPSERT_SQL as VEHICLE_PASS_UPSERT_SQL
from src.utils.vehicle_alarm_mapper import map_alarm_record, UPSERT_SQL as VEHICLE_ALARM_UPSERT_SQL
from src.utils.vehicle_url_mapper import map_url_record, UPSERT_SQL as VEHICLE_URL_UPSERT_SQL
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

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

# page size used when pulling full records (not just totals)
RECORD_PAGE_SIZE = 500


class VehicleRepository:

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

    def _format_dt(self, dt: datetime) -> str:
        """datetime -> Artemis-style ISO string, e.g. 2026-08-13T10:15:00.000+07:00"""
        return dt.strftime("%Y-%m-%dT%H:%M:%S.") + f"{dt.microsecond // 1000:03d}+07:00"

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

        return self._format_dt(begin), self._format_dt(end)

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

    def _request_page(self, begin_time, end_time, page_no, page_size):
        """
        Fetch one page of full vehicle-pass records (not just totals)
        for the given time window.
        """
        payload = {
            "pageNo": page_no,
            "pageSize": page_size,
            "beginTime": begin_time,
            "endTime": end_time,
        }

        body_str = json.dumps(payload, separators=(",", ":"))
        body_bytes = body_str.encode("utf-8")
        headers = self._build_signed_headers(body_bytes)

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
            raise Exception(f"Artemis Error {result}")

        return result.get("data", {})

    def _fetch_records_in_range(self, begin_time, end_time, page_size=RECORD_PAGE_SIZE):
        """
        Generator yielding every raw record from Artemis for [begin_time, end_time),
        paging through the full result set.
        """
        page_no = 1

        while True:

            data = self._request_page(begin_time, end_time, page_no, page_size)

            items = data.get("list", []) or []

            if not items:
                break

            yield from items

            total = data.get("total", 0)

            if page_no * page_size >= total:
                break

            page_no += 1

    def _dedupe_rows(self, rows):
        """
        Artemis pagination can return the same passId more than once within
        a single fetch (e.g. records shifting across page boundaries while
        paging). ON CONFLICT DO UPDATE can't touch the same row twice in one
        statement, so keep only the last occurrence of each pass_id (index 0
        in the row tuple, per COLUMNS order in every mapper).
        """
        deduped = {}
        for row in rows:
            deduped[row[0]] = row  # pass_id -> row; later occurrence wins
        return list(deduped.values())

    def _upsert(self, upsert_sql, rows, table_name):
        """
        Generic upsert: dedupe by pass_id, then execute_values against the
        given table. Requires a UNIQUE constraint on pass_id for that table,
        e.g.:
            ALTER TABLE {table_name} ADD CONSTRAINT {table_name}_pass_id_key UNIQUE (pass_id);
        """
        if not rows:
            return 0

        rows = self._dedupe_rows(rows)

        conn = PostgresConnection().get_connection()

        try:
            with conn:
                with conn.cursor() as cur:
                    execute_values(cur, upsert_sql, rows, page_size=len(rows))

            return len(rows)

        except Exception:
            logger.exception(f"Failed to upsert rows into {table_name}")
            raise

        finally:
            conn.close()

    def get_data_collection_dashboard(self, filters: dict = None):
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

    def get_vehicle_type_all(self, filters: dict = None):
        """
        ดึงรายการ vehicleType ทั้งหมดจากข้อมูล Artemis
        """

        filters = filters or {}

        target_date = filters.get("date")

        begin_time, end_time = self._get_day_range(target_date)

        vehicle_types = set()

        page = 1
        page_size = 1000

        while True:

            payload = {
                "pageNo": page,
                "pageSize": page_size,

                "beginTime": begin_time,
                "endTime": end_time,
            }

            body_str = json.dumps(
                payload,
                separators=(",", ":")
            )

            body_bytes = body_str.encode("utf-8")

            headers = self._build_signed_headers(body_bytes)

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

                    raise Exception(result)


                items = (
                    result
                    .get("data", {})
                    .get("list", [])
                )


                if not items:
                    break


                for item in items:

                    vehicle_type = item.get(
                        "vehicleType"
                    )

                    vehicle_type_name = item.get(
                        "vehicleTypeName"
                    )

                    if vehicle_type:

                        vehicle_types.add(
                            (
                                vehicle_type,
                                vehicle_type_name
                            )
                        )


                # ถ้าน้อยกว่าหน้าเต็ม แปลว่าหน้าสุดท้ายแล้ว
                if len(items) < page_size:
                    break


                page += 1


            except Exception as e:

                logger.exception(
                    "Get vehicle type all error"
                )

                raise e


        return {
            "success": True,
            "date": target_date or datetime.now(self.tz).strftime("%Y-%m-%d"),
            "data": [
                {
                    "vehicleType": v[0],
                    "vehicleTypeName": v[1]
                }
                for v in sorted(vehicle_types)
            ]
        }

    def service_vehicle_5m(self, filters: dict = None):
        """
        Pull vehicle-pass records from Artemis and upsert them into
        the vehicle_pass table.

        filters:
            { "slot_start": datetime, "slot_end": datetime } (optional)
            ไม่ส่งมา -> ใช้ (ตอนนี้ - 5 นาที, ตอนนี้)
            ส่งมาจาก scheduler เพื่อให้ตรงกับ clock slot ที่หาร 5 ลงตัว
        """
        filters = filters or {}
        slot_start = filters.get("slot_start")
        slot_end = filters.get("slot_end")

        if slot_start and slot_end:
            begin_dt = slot_start if slot_start.tzinfo else slot_start.replace(tzinfo=self.tz)
            end_dt = slot_end if slot_end.tzinfo else slot_end.replace(tzinfo=self.tz)
        else:
            end_dt = datetime.now(self.tz)
            begin_dt = end_dt - timedelta(minutes=5)

        begin_time = self._format_dt(begin_dt)
        end_time = self._format_dt(end_dt)

        pass_rows = []
        alarm_rows = []
        url_rows = []
        fetched = 0

        try:
            for rec in self._fetch_records_in_range(begin_time, end_time):
                fetched += 1
                try:
                    pass_rows.append(map_record(rec))
                    alarm_rows.append(map_alarm_record(rec))
                    url_rows.append(map_url_record(rec))
                except Exception:
                    logger.exception(
                        f"Failed to map record {rec.get('passId')}"
                    )

            pass_upserted = self._upsert(VEHICLE_PASS_UPSERT_SQL, pass_rows, "vehicle_pass")
            alarm_upserted = self._upsert(VEHICLE_ALARM_UPSERT_SQL, alarm_rows, "vehicle_alarm")
            url_upserted = self._upsert(VEHICLE_URL_UPSERT_SQL, url_rows, "vehicle_url")

            return {
                "success": True,
                "beginTime": begin_time,
                "endTime": end_time,
                "fetched": fetched,
                "upserted": {
                    "vehicle_pass": pass_upserted,
                    "vehicle_alarm": alarm_upserted,
                    "vehicle_url": url_upserted,
                },
            }

        except Exception as e:

            logger.exception("service_vehicle_5m failed")

            return {
                "success": False,
                "beginTime": begin_time,
                "endTime": end_time,
                "fetched": fetched,
                "upserted": {
                    "vehicle_pass": 0,
                    "vehicle_alarm": 0,
                    "vehicle_url": 0,
                },
                "error": str(e),
            }