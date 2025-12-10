# backend/app/src/services/auth.py
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException
from src.repositories.auth import AuthRepository
import os

# ===== อ่านค่า env ตรง ๆ =====
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_SECONDS = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS", 3600)
)

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY not found in environment variables")

class AuthService:
    def __init__(self):
        self.pwd_context = CryptContext(
            schemes=["bcrypt"],
            deprecated="auto"
        )
        self.auth_repository = AuthRepository()

    def authenticate_user(self, username: str, password: str):
        user_data = self.auth_repository.get_user_by_username(username)

        if not user_data:
            raise HTTPException(status_code=401, detail="User not found")

        if not self.pwd_context.verify(password, user_data["password"]):
            raise HTTPException(status_code=401, detail="Password not match")

        return {
            "id": user_data["id"],
            "username": user_data["username"]
        }

    def generate_token(self, user_data: dict):
        expire = datetime.now(timezone.utc) + timedelta(
            seconds=ACCESS_TOKEN_EXPIRE_SECONDS
        )

        payload = {
            "id": user_data["id"],
            "username": user_data["username"],
            "exp": expire
        }

        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    def decode_token(self, token: str):
        try:
            return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired token"
            )
