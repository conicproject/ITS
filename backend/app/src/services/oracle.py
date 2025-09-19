import datetime
from src.repositories.oracle import OracleRepository
from src.models.oracle import TrafficResponse

class OracleService:
    def __init__(self):
        self.oracle_repository = OracleRepository()

    def get_traffic_pass_yesterday(self, save_to_file: str = None) -> TrafficResponse:
        traffic = self.oracle_repository.get_traffic_pass_yesterday()
        if not save_to_file:
            yesterday = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")
            save_to_file = f"/app/data/vehicle-all-dairy/traffic_all_{yesterday}.json"
        self.oracle_repository.save_traffic_to_json(traffic, save_to_file)
        return traffic
    
    def get_traffic_truck_pass_yesterday(self, save_to_file: str = None) -> TrafficResponse:
        traffic = self.oracle_repository.get_traffic_truck_pass_yesterday()
        if not save_to_file:
            yesterday = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")
            save_to_file = f"/app/data/vehicle-truck-dairy/traffic_truck_{yesterday}.json"
        self.oracle_repository.save_traffic_to_json(traffic, save_to_file)
        return traffic
