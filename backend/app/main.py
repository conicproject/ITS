# main.py
from fastapi import FastAPI
from src.api.route import router as api_router
from config.cors import setup_cors

app = FastAPI(title="My API")
setup_cors(app)
app.include_router(api_router, prefix="/api")
