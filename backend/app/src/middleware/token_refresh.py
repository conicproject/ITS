# backend/app/src/middleware/token_refresh.py
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from src.services.auth import AuthService

class TokenRefreshMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.auth_service = AuthService()          # ✅ สร้างครั้งเดียว ไม่ใช่ทุก request

    async def dispatch(self, request: Request, call_next):
        skip_paths = ["/api/auth/login", "/docs", "/openapi.json", "/redoc"]
        if any(request.url.path.startswith(path) for path in skip_paths):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = self.auth_service.decode_token(token)

                new_token = self.auth_service.generate_token({
                    "id": payload["id"],
                    "username": payload["username"],
                    "project_id": payload["project_id"],   # ✅ ต้องมี ไม่งั้น token ใหม่พัง
                })

                response = await call_next(request)
                response.headers["X-New-Token"] = new_token
                return response

            except Exception as e:
                print(f"Token refresh error: {e}")

        return await call_next(request)