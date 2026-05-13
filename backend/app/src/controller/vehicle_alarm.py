# backend/app/src/controller/vehicle_alarm.py
from fastapi import HTTPException
from src.schemas.vehicle_alarm import VehicleAlarmQuery
from src.services.vehicle_alarm import VehicleAlarmService

class VehicleAlarmController:
    def __init__(self):
        self.svc = VehicleAlarmService()

    def get_vehicle_alarm(self, query: VehicleAlarmQuery):
        try:
            results = self.svc.get_vehicle_alarm(query.model_dump(exclude_none=True))
            return {"total": len(results), "data": results}
        except Exception as e:
            print("get_vehicle_alarm error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")