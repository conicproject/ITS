# backend/app/src/repositories/user.py
from src.connection.postgres import PostgresConnection
import logging

logger = logging.getLogger(__name__)

class UserRepository:
    def __init__(self):
        self.conn = PostgresConnection()

    def insert_user(self, username: str, hashed_password: str):
        """Insert new user into database"""
        try:
            with self.conn.get_connection() as connection:
                with connection.cursor() as cursor:
                    # ตรวจสอบ username ซ้ำ
                    cursor.execute(
                        "SELECT user_id FROM users WHERE user_name = %s",
                        (username,)
                    )
                    if cursor.fetchone():
                        return None

                    # Insert user
                    cursor.execute(
                        """
                        INSERT INTO users (user_name, user_password)
                        VALUES (%s, %s)
                        RETURNING user_id, user_name, user_create_at
                        """,
                        (username, hashed_password)
                    )
                    user = cursor.fetchone()
                    connection.commit()
                    return user
        except Exception as e:
            logger.error(f"Insert user error: {str(e)}")
            raise

    def get_all_users(self):
        """Get all users from database"""
        try:
            with self.conn.get_connection() as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        "SELECT user_id, user_name, user_create_at FROM users ORDER BY user_create_at DESC"
                    )
                    users = cursor.fetchall()
                    return [
                        {
                            "user_id": user[0],
                            "user_name": user[1],
                            "user_create_at": user[2]
                        }
                        for user in users
                    ]
        except Exception as e:
            logger.error(f"Get all users error: {str(e)}")
            raise

    def get_user_by_id(self, user_id: int):
        """Get user by ID from database"""
        try:
            with self.conn.get_connection() as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        "SELECT user_id, user_name, user_create_at FROM users WHERE user_id = %s",
                        (user_id,)
                    )
                    user = cursor.fetchone()
                    if user:
                        return {
                            "user_id": user[0],
                            "user_name": user[1],
                            "user_create_at": user[2]
                        }
                    return None
        except Exception as e:
            logger.error(f"Get user by ID error: {str(e)}")
            raise