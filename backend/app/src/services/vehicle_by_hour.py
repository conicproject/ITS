# backend/app/src/services/vehicle_by_hour.py
from src.repositories.vehicle_by_hour import VehicleByHourRepository

class VehicleByHourService:

    def __init__(self):
        self.repository = VehicleByHourRepository()

    def get_vehicle_by_hour(self, filters: dict = None):
        return self.repository.get_vehicle_by_hour(filters)

    def get_vehicle_type_all(self, filters: dict = None):
        return self.repository.get_vehicle_type_all()