# backend/app/src/controller/auth.py
from fastapi import HTTPException, Depends, Header
from fastapi.security import OAuth2PasswordRequestForm
from src.services.auth import AuthService

class AuthController:
    def __init__(self):
        self.auth_service = AuthService()

    def login(self, form_data: OAuth2PasswordRequestForm = Depends()):
        """User login endpoint"""
        try:
            username = form_data.username
            password = form_data.password

            user = self.auth_service.authenticate_user(username, password)
            if not user:
                raise HTTPException(status_code=401, detail="Invalid credentials")

            token = self.auth_service.generate_token(user)
            return {"token": token, "user": user}

        except HTTPException:
            raise
        except Exception as e:
            print("Login error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")

    def verify_token(self, authorization: str = Header(...)):
        """Verify JWT token endpoint"""
        try:
            if not authorization.startswith("Bearer "):
                raise HTTPException(status_code=401, detail="Invalid authorization header")
            
            token = authorization.split(" ")[1]
            payload = self.auth_service.decode_token(token)
            return {"user": payload}

        except HTTPException:
            raise
        except Exception as e:
            print("Verify token error:", str(e))
            raise HTTPException(status_code=401, detail="Invalid token")