# backend/app/src/services/data_vehicle.py
from src.repositories.camera import CameraRepository

class CameraService:
    def __init__(self):
        self.camera_repo = CameraRepository()

    def get_camera(self):
        data = self.camera_repo.get_camera()
        if not data:
            return {"message": "ไม่พบข้อมูล"}
        return data
