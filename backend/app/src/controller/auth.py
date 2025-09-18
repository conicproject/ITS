# backend/app/src/controller/auth.py
from fastapi import HTTPException, Depends, Form, Header
from fastapi.security import OAuth2PasswordRequestForm
from src.services.auth import AuthService

auth_service = AuthService()

class AuthController:

    # Login endpoint
    def user_login(self, form_data: OAuth2PasswordRequestForm = Depends()):
        try:
            username = form_data.username
            password = form_data.password

            user = auth_service.authenticate_user(username, password)
            if not user:
                raise HTTPException(status_code=401, detail="Invalid credentials")

            token = auth_service.generate_token(user)
            return {"token": token, "user": user}

        except Exception as e:
            print("Login error:", str(e))
            raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify JWT token endpoint
    def auth_verify_token(self, authorization: str = Header(...)):
        try:
            token = authorization.split(" ")[1]  # "Bearer <token>"
            payload = auth_service.decode_token(token)
            return {"user": payload}

        except Exception as e:
            print("Verify token error:", str(e))
            raise HTTPException(status_code=401, detail="Invalid token")
