# backend/app/src/controller/oracle.py
from fastapi import HTTPException, Depends, Header
from fastapi.security import OAuth2PasswordRequestForm
from src.services.oracle import OracleService

class OracleController:
    def __init__(self):
        self.oracle_service = OracleService()

    def get_traffic_pass_yesterday(self):
        try:
            return self.oracle_service.get_traffic_pass_yesterday()
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal server error")
        
    def get_traffic_truck_pass_yesterday(self):
        try:
            return self.oracle_service.get_traffic_truck_pass_yesterday()
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal server error")