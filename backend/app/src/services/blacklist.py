# backend/app/src/services/blacklist.py
from src.repositories.blacklist import BlacklistRepository

class BlacklistService:
    def __init__(self):
        self.blacklist_repo = BlacklistRepository()

    def get_blacklist(self):
        return self.blacklist_repo.get_blacklist()

    def insert_blacklist(self, blacklist_data: dict):
        return self.blacklist_repo.insert_blacklist(blacklist_data)

    def delete_blacklist(self, blacklist_id: int):
        return self.blacklist_repo.delete_blacklist(blacklist_id)

    def alert_blacklist_passing(self, license_plate: str):  # ✅ เพิ่ม
        return self.blacklist_repo.alert_blacklist_passing(license_plate)

    def check_blacklist_in_vehicle_pass(self, minutes: int = 5):
        return self.blacklist_repo.check_blacklist_in_vehicle_pass(minutes)