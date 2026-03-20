from contextlib import asynccontextmanager
from fastapi import FastAPI
from src.api.route import router as api_router
from config.cors import setup_cors
from src.middleware.token_refresh import TokenRefreshMiddleware
from src.scheduler.record_scheduler import start_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──
    start_scheduler()
    yield
    # ── Shutdown (ถ้ามี cleanup เพิ่มตรงนี้) ──

app = FastAPI(title="My API", lifespan=lifespan)

setup_cors(app)
app.add_middleware(TokenRefreshMiddleware)
app.include_router(api_router, prefix="/api")