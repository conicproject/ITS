# backend/app/src/services/auth.py
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException
from src.repositories.auth import AuthRepository

SECRET_KEY = "your-secret-key"  # ควรเก็บใน .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 300

class AuthService:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.auth_repository = AuthRepository()

    def authenticate_user(self, username: str, password: str):
        try:
            user_data = self.auth_repository.get_user_by_username(username)
            
            if not user_data:
                return None

            # ตรวจสอบ password
            if not self.pwd_context.verify(password, user_data["password"]):
                return None

            return {
                "id": user_data["id"],
                "username": user_data["username"]
            }
        except Exception as e:
            print("Authentication error:", e)
            return None

    def generate_token(self, user_data: dict):
        expire = datetime.utcnow() + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
        to_encode = {
            "id": user_data["id"],
            "username": user_data["username"],
            "exp": expire
        }
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    def decode_token(self, token: str):
        """Decode and validate JWT token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")