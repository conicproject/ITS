from src.connection.oracle import OracleConnection
from src.connection.postgres import PostgresConnection

class CameraRepository:
    def __init__(self):
        self.conn = PostgresConnection()
    
    def get_camera(self):
        """Return camera status data"""
        try:
            with self.conn.get_connection() as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        'SELECT id, status, last_updated FROM camera_status ORDER BY last_updated DESC'
                    )
                    rows = cursor.fetchall()
                    return [
                        {
                            "id": r[0],
                            "status": r[1],
                            "last_updated": r[2],
                        }
                        for r in rows
                    ]
        except Exception as e:
            raise