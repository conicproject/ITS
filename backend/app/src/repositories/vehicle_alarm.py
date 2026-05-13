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
            conditions.append("plate_no ILIKE %(plate_no)s")
            params["plate_no"] = f"%{filters['plate_no']}%"

        if filters.get("alarm_type"):
            conditions.append("violative_action = %(alarm_type)s")
            params["alarm_type"] = filters["alarm_type"]

        if filters.get("crossing_id"):
            conditions.append("crossing_id = %(crossing_id)s")
            params["crossing_id"] = filters["crossing_id"]

        if filters.get("start_date"):
            conditions.append("pass_time >= %(start_date)s")
            params["start_date"] = filters["start_date"]

        if filters.get("end_date"):
            conditions.append("pass_time <= %(end_date)s")
            params["end_date"] = filters["end_date"]

        params["limit"]  = filters.get("limit", 50)
        params["offset"] = filters.get("offset", 0)

        where = " AND ".join(conditions)

        query = f"""
            SELECT
                alarm_id,
                plate_no,
                plate_province,
                pass_time,
                alarm_type,
                alarm_process,
                alarm_process_result,
                violative_action,
                crossing_id,
                direction_index,
                vehicle_type,
                vehicle_speed,
                vehicle_color,
                alarm_user_name,
                violative_company,
                lane_no,
                tfs_id,
                mobile_device_latitude,
                mobile_device_longitude
            FROM vehicle_alarm
            WHERE {where}
            ORDER BY pass_time DESC
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