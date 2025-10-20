# backend/app/src/controller/data_vehicle.py
from fastapi import HTTPException
from src.services.data_vehicle import DataVehicleService
from datetime import datetime

class DataVehicleController:
    def __init__(self):
        self.service = DataVehicleService()

    async def get_data_vehicle(self):
        try:
            result = self.service.get_data_vehicle()
            return {"status": "success", "data": result}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

