# backend/app/config/cors.py
from fastapi.middleware.cors import CORSMiddleware

origins = ["http://10.142.1.121:5410",]

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-New-Token"]
    )