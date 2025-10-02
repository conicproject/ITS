# backend/app/src/repositories/menu.py
from src.connection.postgres import PostgresConnection
import logging

logger = logging.getLogger(__name__)

class MenuRepository:
    def __init__(self):
        self.conn = PostgresConnection()

    def get_all_menus(self):
        """Return all menus as flat list"""
        try:
            with self.conn.get_connection() as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        'SELECT id, label, path, parent_id, "order" FROM menus ORDER BY "order"'
                    )
                    rows = cursor.fetchall()
                    return [
                        {
                            "id": r[0],
                            "label": r[1],
                            "path": r[2],
                            "parent_id": r[3],
                            "order": r[4],
                        }
                        for r in rows
                    ]
        except Exception as e:
            logger.error(f"Get all menus error: {str(e)}")
            raise
