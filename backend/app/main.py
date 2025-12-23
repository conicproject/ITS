# main.py
from fastapi import FastAPI
from src.api.route import router as api_router
from config.cors import setup_cors
from src.middleware.token_refresh import TokenRefreshMiddleware  # ⭐ เพิ่ม import

app = FastAPI(title="My API")

setup_cors(app)
app.add_middleware(TokenRefreshMiddleware)
app.include_router(api_router, prefix="/api")