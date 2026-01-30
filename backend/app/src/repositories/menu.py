# backend/app/src/repositories/menu.py
from src.connection.postgres import PostgresConnection
import logging

logger = logging.getLogger(__name__)

class MenuRepository:
    def __init__(self):
        self.conn = PostgresConnection()

    def get_all_menus_by_project(self, project_id: int):
        try:
            with self.conn.get_connection() as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT
                            m.id,
                            m.label,
                            m.path,
                            m.parent_id,
                            m."order"
                        FROM menus m
                        LEFT JOIN menus p ON p.id = m.parent_id
                        WHERE %s = ANY(
                            COALESCE(m.project_id, p.project_id)
                        )
                        ORDER BY m."order"
                        """,
                        (project_id,)
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
            logger.error(f"Get menus by project error: {str(e)}")
            raise
