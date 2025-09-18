# backend/app/src/services/auth.py
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException
from src.connection.postgres import PostgresConnection

SECRET_KEY = "your-secret-key"  # ควรเก็บใน .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 300

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self):
        self.conn = PostgresConnection()

    def authenticate_user(self, username: str, password: str):
        try:
            with self.conn.get_connection() as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT personnel_id, personnel_username, personnel_password, personnel_role
                        FROM personnel
                        WHERE personnel_username = %s
                        """,
                        (username,)
                    )
                    row = cursor.fetchone()

            if not row:
                return None

            personnel_id, personnel_username, personnel_password, personnel_role = row

            # ตรวจสอบ password
            if not pwd_context.verify(password, personnel_password):
                return None

            return {
                "id": personnel_id,
                "username": personnel_username,
                "role": personnel_role
            }
        except Exception as e:
            print("DB error:", e)
            return None

    def generate_token(self, user_data: dict):
        expire = datetime.utcnow() + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
        to_encode = {
            "id": user_data["id"],
            "username": user_data["username"],
            "role": user_data["role"],
            "exp": expire
        }
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    def decode_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")