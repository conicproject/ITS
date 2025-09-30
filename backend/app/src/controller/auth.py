from fastapi import HTTPException, Depends, Header
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from src.services.auth import AuthService
from src.models.user import LoginRequest

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class AuthController:
    def __init__(self):
        self.auth_service = AuthService()

    def login(self, request: LoginRequest):
        try:
            username = request.username
            password = request.password

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

    def get_current_user(self, token: str = Depends(oauth2_scheme)):
        try:
            payload = self.auth_service.decode_token(token)
            return payload
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
