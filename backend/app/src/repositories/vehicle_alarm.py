# backend/app/src/repositories/vehicle_alarm.py
from src.connection.postgres import PostgresConnection
import logging
logger = logging.getLogger(__name__)

class VehicleAlarmRepository:
    def __init__(self):
        self.conn = PostgresConnection()

    def get_vehicle_alarm(self, filters: dict):
        conditions = ["1=1"]
        params = {}

        if filters.get("plate_no"):
            conditions.append("va.plate_no ILIKE %(plate_no)s")
            params["plate_no"] = f"%{filters['plate_no']}%"

        if filters.get("alarm_type"):
            conditions.append("va.violative_action = %(alarm_type)s")
            params["alarm_type"] = filters["alarm_type"]

        if filters.get("crossing_id"):
            conditions.append("va.crossing_id = %(crossing_id)s")
            params["crossing_id"] = filters["crossing_id"]

        if filters.get("start_date"):
            conditions.append("va.pass_time >= %(start_date)s")
            params["start_date"] = filters["start_date"]

        if filters.get("end_date"):
            conditions.append("va.pass_time <= %(end_date)s")
            params["end_date"] = filters["end_date"]

        params["limit"]  = filters.get("limit", 50)
        params["offset"] = filters.get("offset", 0)

        where = " AND ".join(conditions)

        query = f"""
            SELECT
                va.alarm_id,
                va.plate_no,
                va.plate_province,
                p.province_name_th,
                p.province_name_en,
                va.pass_time,
                va.alarm_type,
                va.alarm_process,
                va.alarm_process_result,
                va.violative_action,
                va.crossing_id,
                va.direction_index,
                va.vehicle_type,
                vt.type_nameth      AS vehicle_type_th,
                va.vehicle_speed,
                va.vehicle_color,
                va.alarm_user_name,
                va.violative_company,
                va.lane_no,
                va.tfs_id,
                va.mobile_device_latitude,
                va.mobile_device_longitude
            FROM vehicle_alarm va
            LEFT JOIN province p
                ON p.province_id::text = va.plate_province
            LEFT JOIN vehicle_type vt
                ON vt.type_name = va.vehicle_type
            WHERE {where}
            ORDER BY va.pass_time DESC
            LIMIT %(limit)s OFFSET %(offset)s
        """

        conn = None
        cur  = None
        try:
            conn = self.conn.get_connection()
            cur  = conn.cursor()
            cur.execute(query, params)
            rows = cur.fetchall()
            cols = [desc[0] for desc in cur.description]
            return [dict(zip(cols, row)) for row in rows]
        except Exception as e:
            logger.error(f"get_vehicle_alarm error: {e}")
            raise e
        finally:
            if cur:  cur.close()
            if conn: conn.close()