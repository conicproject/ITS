# backend/app/src/controller/vehicle_type.py
from src.services.vehicle_type import VehicleTypeService
from fastapi import HTTPException

class VehicleTypeController:
    def __init__(self):
        self.vehicle_type = VehicleTypeService()

    def get_vehicle_type(self):
        try:
            return self.vehicle_type.get_vehicle_type()
        except Exception as e:
            print("Get vehicle_type error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")