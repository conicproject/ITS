# backend/app/src/services/vehicle.py

from src.repositories.vehicle import VehicleRepository

class VehicleService:

    def __init__(self):
        self.repository = VehicleRepository()

    def get_data_collection_dashboard(self, filters: dict = None):
        return self.repository.get_data_collection_dashboard(filters)
    
    def service_vehicle_5m(self, filters: dict = None):
        return self.repository.service_vehicle_5m(filters)
