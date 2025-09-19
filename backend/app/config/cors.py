from fastapi.middleware.cors import CORSMiddleware

origins = ["http://192.168.1.111:50000",]

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )