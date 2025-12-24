# backend/app/config/cors.py
from fastapi.middleware.cors import CORSMiddleware

origins = ["http://192.168.1.111:5400",]

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-New-Token"]
    )