# backend/app/src/repositories/auth.py
from src.connection.postgres import PostgresConnection
import logging

logger = logging.getLogger(__name__)

class AuthRepository:
    def __init__(self):
        self.conn = PostgresConnection()

    def get_user_by_username(self, username: str):
        """Get user data by username for authentication"""
        try:
            with self.conn.get_connection() as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT user_id, user_name, user_password
                        FROM users
                        WHERE user_name = %s
                        """,
                        (username,)
                    )
                    row = cursor.fetchone()

                    if not row:
                        return None

                    return {
                        "id": row[0],
                        "username": row[1],
                        "password": row[2]
                    }
        except Exception as e:
            logger.error(f"Get user by username error: {str(e)}")
            raise