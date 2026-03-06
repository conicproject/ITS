from src.connection.oracle import OracleConnection
from src.connection.postgres import PostgresConnection

class CheckpointRepository:
    def __init__(self):
        self.conn = PostgresConnection()
    
    def get_checkpoint(self):
        """Return checkpoint status data"""
        try:
            with self.conn.get_connection() as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        "SELECT checkpoint_name, latitude, longtitude, checkpoint_nickname FROM checkpoint"
                    )
                    rows = cursor.fetchall()

                    return [
                        {
                            "name": r[0],
                            "latitude": r[1],
                            "longitude": r[2],
                            "nickname": r[3]
                        }
                        for r in rows
                    ]

        except Exception as e:
            print("❌ ERROR get_checkpoint:", e)   # 🔥 สำคัญ
            raise Exception(str(e))