# src/controller/vehicle_by_hour.py

from src.services.vehicle_by_hour import VehicleByHourService


class VehicleByHourController:

    def __init__(self):
        self.service = VehicleByHourService()

    def get_vehicle_by_hour(self, filters: dict = None):
        return self.service.get_vehicle_by_hour(filters)

    def get_vehicle_type_all(self):
        return self.service.get_vehicle_type_all()