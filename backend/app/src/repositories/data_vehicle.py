# backend/app/src/repositories/data_vehicle.py
from src.connection.oracle import OracleConnection
import logging

logger = logging.getLogger(__name__)

class DataVehicleRepository:
    def __init__(self):
        self.conn = OracleConnection()

    def get_data_vehicle(self):
        """
        ดึง 5 แถวแรกจาก XVOT_XVOTDB_USER.VEHICLE_PASS
        """
        try:
            with self.conn.get_connection() as connection:
                with connection.cursor() as cursor:
                    sql = """
                        SELECT PASS_ID, CROSSING_ID, LANE_NO, DIRECTION_INDEX, PLATE_NO, PASS_TIME
                        FROM XVOT_XVOTDB_USER.VEHICLE_PASS
                        WHERE ROWNUM <= 5
                    """
                    cursor.execute(sql)
                    rows = cursor.fetchall()

                    results = []
                    for r in rows:
                        results.append({
                            "pass_id": r[0],
                            "crossing_id": r[1],
                            "lane_no": r[2],
                            "direction_index": r[3],
                            "plate_no": r[4],
                            "pass_time": r[5].strftime("%Y-%m-%d %H:%M:%S") if r[5] else None
                        })
                    return results
        except Exception as e:
            logger.error(f"Error fetching vehicle data: {e}")
            raise
