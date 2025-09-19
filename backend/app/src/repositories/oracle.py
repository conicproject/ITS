# backend/app/src/repositories/oracle.py
from src.connection.oracle import OracleConnection
from src.models.oracle import Record, TrafficResponse
from datetime import datetime, timedelta
import re
import logging
import json
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OracleRepository:
    def __init__(self):
        self.oracle_conn_wrapper = OracleConnection()
        # fields ต้องตรงกับ model Record ของคุณ
        self.fields = [
            "PASS_ID", "PLATE_PIC_URL", "IMAGE_PATH", "PLATE_NO", "LANE_NO",
            "PROVINCE_NAMETH", "CHECKPOINT_NICKNAME", "LATITUDE", "LONGTITUDE",
            "DISTRICT_NAME", "CAMERA_CODE", "ROAD_DIRECTION", "PASS_TIME",
            "TYPE_NAME", "COLOR_NAME"
        ]

    def is_valid_row(self, row):
        """ตรวจสอบว่าแถวข้อมูลถูกต้อง"""
        if not row or None in row:
            return False
        plate_no = str(row[3])
        invalid_values = ["unknown", "ไม่ระบุ"]
        if any(val in row for val in invalid_values):
            return False
        if re.search(r"[A-Za-zก-ฮ]", plate_no):
            return False
        return True

    def row_to_record(self, row):
        """แปลง row เป็น Record"""
        record_dict = dict(zip(self.fields, row))
        record_dict["LATITUDE"] = float(row[7] or 0.0)
        record_dict["LONGTITUDE"] = float(row[8] or 0.0)
        return Record(**record_dict)

    def get_traffic_pass_yesterday(self) -> TrafficResponse:
        """ดึงข้อมูลรถทุกประเภทของเมื่อวาน แบ่งเป็น interval 5 นาที"""
        logger.info("Fetching all traffic data for yesterday in 5-minute intervals")
        try:
            yesterday = datetime.now() - timedelta(days=1)
            start_datetime = yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
            end_datetime = yesterday.replace(hour=23, minute=59, second=59, microsecond=999999)
            delta = timedelta(minutes=5)

            sql_command = """
                SELECT vp.PASS_ID, vu.PLATE_PIC_URL, vu.IMAGE_PATH, vp.PLATE_NO, vp.LANE_NO,
                       p.PROVINCE_NAMETH, ch.CHECKPOINT_NICKNAME, ch.LATITUDE, ch.LONGTITUDE, dt.DISTRICT_NAME,
                       c.CAMERA_CODE, la.ROAD_DIRECTION, vp.PASS_TIME, vt.TYPE_NAME, vc.COLOR_NAME
                FROM XVOT_XVOTDB_USER.VEHICLE_PASS vp
                JOIN CHECKPOINT ch ON ch.AREA_CODE = vp.AREA_CODE
                JOIN VEHICLE_TYPE vt ON vt.TYPE_NAME = vp.VEHICLE_TYPE
                JOIN VEHICLE_COLOR vc ON vc.COLOR_NAME = vp.VEHICLE_COLOR 
                JOIN LANE la ON la.CHECKPOINT_ID = ch.CHECKPOINT_ID AND la.LANE_CODE = vp.LANE_NO
                JOIN DISTRICT dt ON dt.DISTRICT_ID = ch.DISTRICT_ID
                JOIN CAMERA c ON c.CAMERA_ID = la.CAMERA_ID
                JOIN XVOT_XVOTDB_USER.VEHICLE_URL vu ON vu.PASS_ID = vp.PASS_ID
                JOIN PROVINCE p ON p.PROVINCE_ID = vp.PLATE_PROVINCE
                WHERE vp.PASS_TIME >= TO_TIMESTAMP(:start_time, 'YYYY-MM-DD HH24:MI:SS')
                  AND vp.PASS_TIME <= TO_TIMESTAMP(:end_time, 'YYYY-MM-DD HH24:MI:SS')
                ORDER BY vp.PASS_TIME DESC
            """

            all_records = []
            current_start = start_datetime
            with self.oracle_conn_wrapper.get_connection_context() as conn:
                with conn.cursor() as cursor:
                    while current_start < end_datetime:
                        current_end = min(current_start + delta, end_datetime)
                        start_naive = current_start.strftime("%Y-%m-%d %H:%M:%S")
                        end_naive = current_end.strftime("%Y-%m-%d %H:%M:%S")

                        cursor.execute(sql_command, {"start_time": start_naive, "end_time": end_naive})
                        interval_records = [self.row_to_record(r) for r in cursor.fetchall() if self.is_valid_row(r)]

                        logger.info("Interval %s ~ %s : fetched %d records", start_naive, end_naive, len(interval_records))
                        all_records.extend(interval_records)
                        current_start += delta

            total = len(all_records)
            logger.info("Fetched total %d records for yesterday", total)
            return TrafficResponse(records=all_records, total=total)

        except Exception as e:
            logger.error("Failed to fetch traffic data: %s", e)
            return TrafficResponse(records=[], total=0)

    def get_traffic_truck_pass_yesterday(self) -> TrafficResponse:
        """ดึงข้อมูลเฉพาะรถบรรทุกของเมื่อวาน"""
        logger.info("Fetching truck traffic data for yesterday")
        try:
            yesterday = datetime.now() - timedelta(days=1)
            start_datetime = yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
            end_datetime = yesterday.replace(hour=23, minute=59, second=59, microsecond=999999)

            sql_command = """
                SELECT vp.PASS_ID, vu.PLATE_PIC_URL, vu.IMAGE_PATH, vp.PLATE_NO, vp.LANE_NO,
                       p.PROVINCE_NAMETH, ch.CHECKPOINT_NICKNAME, ch.LATITUDE, ch.LONGTITUDE, dt.DISTRICT_NAME,
                       c.CAMERA_CODE, la.ROAD_DIRECTION, vp.PASS_TIME, vt.TYPE_NAME, vc.COLOR_NAME
                FROM XVOT_XVOTDB_USER.VEHICLE_PASS vp
                JOIN CHECKPOINT ch ON ch.AREA_CODE = vp.AREA_CODE
                JOIN VEHICLE_TYPE vt ON vt.TYPE_NAME = vp.VEHICLE_TYPE
                JOIN VEHICLE_COLOR vc ON vc.COLOR_NAME = vp.VEHICLE_COLOR 
                JOIN LANE la ON la.CHECKPOINT_ID = ch.CHECKPOINT_ID AND la.LANE_CODE = vp.LANE_NO
                JOIN DISTRICT dt ON dt.DISTRICT_ID = ch.DISTRICT_ID
                JOIN CAMERA c ON c.CAMERA_ID = la.CAMERA_ID
                JOIN XVOT_XVOTDB_USER.VEHICLE_URL vu ON vu.PASS_ID = vp.PASS_ID
                JOIN PROVINCE p ON p.PROVINCE_ID = vp.PLATE_PROVINCE
                WHERE vp.PASS_TIME >= TO_TIMESTAMP(:start_time, 'YYYY-MM-DD HH24:MI:SS')
                  AND vp.PASS_TIME <= TO_TIMESTAMP(:end_time, 'YYYY-MM-DD HH24:MI:SS')
                  AND vp.VEHICLE_TYPE = 'truck'
                ORDER BY vp.PASS_TIME DESC
            """

            start_naive = start_datetime.strftime("%Y-%m-%d %H:%M:%S")
            end_naive = end_datetime.strftime("%Y-%m-%d %H:%M:%S")

            with self.oracle_conn_wrapper.get_connection_context() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(sql_command, {"start_time": start_naive, "end_time": end_naive})
                    rows = cursor.fetchall()

            records = [self.row_to_record(r) for r in rows if self.is_valid_row(r)]
            logger.info("Fetched total %d truck records for yesterday", len(records))
            return TrafficResponse(records=records, total=len(records))

        except Exception as e:
            logger.error("Failed to fetch truck traffic data: %s", e)
            return TrafficResponse(records=[], total=0)
        
    def save_traffic_to_json(self, traffic: TrafficResponse, file_path: str):
        try:
            path = Path(file_path)
            path.parent.mkdir(parents=True, exist_ok=True)
            data = {
                "records": [
                    {**r.model_dump(), "PASS_TIME": r.PASS_TIME.isoformat()} 
                    for r in traffic.records
                ],
                "total": traffic.total
            }

            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=4)

            logger.info("Saved %d records to %s", traffic.total, file_path)

        except Exception as e:
            logger.error("Failed to save traffic data to JSON: %s", e)

