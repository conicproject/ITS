# backend/app/src/services/vehicle_type.py
from src.repositories.vehicle_type import VehicleTypeRepository

class VehicleTypeService:
    def __init__(self):
        self.vehicle_type_repo = VehicleTypeRepository()

    def get_vehicle_type(self):
        data = self.vehicle_type_repo.get_vehicle_type()
        if not data:
            return {"message": "ไม่พบข้อมูล"}
        return data