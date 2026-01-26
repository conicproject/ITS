# backend/app/src/services/data_vehicle.py
from src.repositories.data_vehicle import DataVehicleRepository

class DataVehicleService:
    def __init__(self):
        self.data_vehicle = DataVehicleRepository()

    def get_data_vehicle(self):
        data = self.data_vehicle.get_data_vehicle()
        if not data:
            return []
        return data

    def data_search_vehicle(self, date, province=None, lpr=None, camera=None):
        """
        รองรับการ search หลายเงื่อนไข
        - date (required)
        - province (optional)
        - lpr (optional)
        - camera (optional)
        """

        data = self.data_vehicle.data_search_vehicle(
            date=date,
            province=province,
            lpr=lpr,
            camera=camera
        )

        if not data:
            return []

        return data
