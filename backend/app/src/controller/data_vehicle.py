# backend/app/src/controller/data_vehicle.py
from fastapi import HTTPException, Body
from src.services.data_vehicle import DataVehicleService
from datetime import datetime, date

class DataVehicleController:
    def __init__(self):
        self.service = DataVehicleService()

    async def get_data_vehicle(self):
        try:
            result = self.service.get_data_vehicle()
            return {"status": "success", "data": result}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def data_search_vehicle(self, payload: dict = Body(...)):

        try:
            # 🔹 default date
            raw_date = payload.get("date", "today")

            if raw_date == "today":
                search_date = date.today()
            else:
                search_date = datetime.strptime(raw_date, "%Y-%m-%d").date()

            result = self.service.data_search_vehicle(
                date=search_date,
                province=payload.get("province"),
                lpr=payload.get("lpr"),
                camera=payload.get("camera"),
            )

            return {"status": "success", "data": result}

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
