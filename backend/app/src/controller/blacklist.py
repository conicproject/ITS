# backend/app/src/controller/blacklist.py
from fastapi import HTTPException
from src.schemas.blacklist import BlacklistCreate, BlacklistResponse, CheckBlacklistRequest  # ✅ เพิ่ม
from src.services.blacklist import BlacklistService

class BlacklistController:
    def __init__(self):
        self.blacklist_svc = BlacklistService()

    def get_blacklist(self):
        try:
            return self.blacklist_svc.get_blacklist()
        except Exception as e:
            print("Get blacklist error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")

    def insert_blacklist(self, payload: BlacklistCreate) -> BlacklistResponse:
        try:
            return self.blacklist_svc.insert_blacklist(payload.model_dump())
        except Exception as e:
            print("Insert blacklist error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")

    def delete_blacklist(self, blacklist_id: int):  # ✅ method หายไป ต้องเพิ่มกลับ
        try:
            return self.blacklist_svc.delete_blacklist(blacklist_id)
        except Exception as e:
            print("Delete blacklist error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")

    def alert_blacklist_passing(self, license_plate: str):  # ✅ method หายไป ต้องเพิ่มกลับ
        try:
            return self.blacklist_svc.alert_blacklist_passing(license_plate)
        except Exception as e:
            print("Check blacklist error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")

    def check_blacklist_5m(self, payload: CheckBlacklistRequest):
        try:
            results = self.blacklist_svc.check_blacklist_in_vehicle_pass(payload.minutes)
            return {"matched_count": len(results), "alerts": results}
        except Exception as e:
            print("Check blacklist 5m error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")