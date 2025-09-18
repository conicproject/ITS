# backend/app/src/controller/user.py
from fastapi import HTTPException, Depends
from src.repositories import user as user_repo
from src.models.user import UserResponse, SingleUserResponse
from fastapi import HTTPException
from passlib.context import CryptContext
from src.connection.postgres import PostgresConnection
from src.models.user import CreateUserRequest  


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserController:
    def insert_user(self, data: CreateUserRequest):
        """
        เพิ่ม user ใหม่ลง Postgres
        """
        username = data.user_name
        password = data.user_password
        hashed_password = pwd_context.hash(password)
        conn = PostgresConnection()

        try:
            with conn.get_connection() as connection:
                with connection.cursor() as cursor:
                    # ตรวจสอบ username ซ้ำ
                    cursor.execute(
                        "SELECT user_id FROM users WHERE user_name = %s",
                        (username,)
                    )
                    if cursor.fetchone():
                        raise HTTPException(status_code=400, detail="Username already exists")

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

            return {
                "user_id": user[0],
                "user_name": user[1],
                "user_create_at": user[2]
            }

        except Exception as e:
            print("Insert user error:", str(e))
            raise HTTPException(status_code=500, detail="Failed to create user")

    def get_all_user(self) -> UserResponse:
        return user_repo.get_all_user()
    
    def get_user_by_id(self, user_id: int) -> SingleUserResponse:
        return user_repo.get_user_by_id(user_id)