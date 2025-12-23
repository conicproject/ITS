from src.services.camera import CameraService
from fastapi import HTTPException, Depends

class CameraController:
    def __init__(self):
        self.camera = CameraService()

    def get_camera(self):
        try:
            return self.camera.get_camera()
        except Exception as e:
            print("Get menus error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")