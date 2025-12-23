# backend/app/src/middleware/token_refresh.py
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from src.services.auth import AuthService

class TokenRefreshMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # ข้ามเส้นทาง login และ docs
        skip_paths = ["/api/auth/login", "/docs", "/openapi.json", "/redoc"]
        if any(request.url.path.startswith(path) for path in skip_paths):
            return await call_next(request)
        
        # ตรวจสอบ token
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                auth_service = AuthService()
                payload = auth_service.decode_token(token)
                
                # สร้าง token ใหม่ (reset 60 นาที)
                new_token = auth_service.generate_token({
                    "id": payload["id"],
                    "username": payload["username"]
                })
                
                # ส่ง response พร้อม token ใหม่
                response = await call_next(request)
                response.headers["X-New-Token"] = new_token
                return response
                
            except Exception as e:
                print(f"Token refresh error: {e}")
        
        return await call_next(request)