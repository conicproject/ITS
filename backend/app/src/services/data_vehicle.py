# backend/app/src/services/data_vehicle.py
from src.repositories.data_vehicle import DataVehicleRepository

class DataVehicleService:
    def __init__(self):
        self.repo = DataVehicleRepository()

    def get_data_vehicle(self):
        data = self.repo.get_data_vehicle()
        if not data:
            return {"message": "ไม่พบข้อมูล"}
        return data
