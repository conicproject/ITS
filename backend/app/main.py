import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from src.api.route import router as api_router
from config.cors import setup_cors
from src.middleware.token_refresh import TokenRefreshMiddleware
from src.scheduler.record_scheduler import start_scheduler
from src.scheduler.blacklist_scheduler import BlacklistScheduler

blacklist_scheduler = BlacklistScheduler() 

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──
    start_scheduler()
    task = asyncio.create_task(blacklist_scheduler.start())  # ✅ เพิ่ม
    yield
    # ── Shutdown ──
    blacklist_scheduler.stop()  # ✅ เพิ่ม
    task.cancel()               # ✅ เพิ่ม

app = FastAPI(title="My API", lifespan=lifespan)
setup_cors(app)
app.add_middleware(TokenRefreshMiddleware)
app.include_router(api_router, prefix="/api")