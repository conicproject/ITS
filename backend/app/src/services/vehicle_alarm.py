# backend/app/src/services/vehicle_alarm.py
from src.repositories.vehicle_alarm import VehicleAlarmRepository

class VehicleAlarmService:
    def __init__(self):
        self.repo = VehicleAlarmRepository()

    def get_vehicle_alarm(self, filters: dict):
        return self.repo.get_vehicle_alarm(filters)