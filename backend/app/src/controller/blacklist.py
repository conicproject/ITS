# backend/app/src/controller/blacklist.py
from typing import Optional
from fastapi import HTTPException, Body
from datetime import datetime, date
import logging
from src.schemas.blacklist import BlacklistCreate, BlacklistResponse, CheckBlacklistRequest
from src.services.blacklist import BlacklistService

logger = logging.getLogger(__name__)

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

    def delete_blacklist(self, blacklist_id: int):
        try:
            return self.blacklist_svc.delete_blacklist(blacklist_id)
        except Exception as e:
            print("Delete blacklist error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")

    def alert_blacklist_passing(self, license_plate: str):
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

    async def search_blacklist(self, payload: dict = Body(...)):
        try:
            # 🔹 date parameter (วันเริ่มต้น) — รองรับ "today" หรือ "YYYY-MM-DD"
            raw_date = payload.get("date", "today")

            if raw_date == "today":
                search_date = date.today()
                logger.info(f"🔍 Searching blacklist for today: {search_date}")
            else:
                try:
                    search_date = datetime.strptime(raw_date, "%Y-%m-%d").date()
                    logger.info(f"🔍 Searching blacklist for date: {search_date}")
                except ValueError:
                    raise HTTPException(
                        status_code=400,
                        detail="Invalid date format. Use 'today' or 'YYYY-MM-DD'"
                    )

            # 🔹 end_date parameter (วันสิ้นสุด)
            raw_end_date = payload.get("end_date")
            search_end_date = None
            if raw_end_date:
                try:
                    search_end_date = datetime.strptime(raw_end_date, "%Y-%m-%d").date()
                except ValueError:
                    raise HTTPException(
                        status_code=400,
                        detail="Invalid end_date format. Use 'YYYY-MM-DD'"
                    )

                if search_end_date < search_date:
                    raise HTTPException(
                        status_code=400,
                        detail="end_date must not be earlier than date"
                    )

            plate_no = payload.get("plate_no") or payload.get("lpr")

            page = int(payload.get("page") or 1)
            page_size = int(payload.get("page_size") or 10)

            logger.debug(
                "📦 Blacklist search params: date=%s, end_date=%s, plate_no=%s, page=%s, page_size=%s",
                search_date, search_end_date, plate_no, page, page_size,
            )

            rows, total_count = self.blacklist_svc.search_blacklist(
                date=search_date,
                date_to=search_end_date,
                plate_no=plate_no,
                page=page,
                page_size=page_size,
            )

            return {
                "status": "success",
                "data": rows,
                "count": total_count,
                "page": page,
                "page_size": page_size,
                "filters": {
                    "date": str(search_date),
                    "end_date": str(search_end_date or search_date),
                    "plate_no": plate_no,
                }
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.exception("❌ Error in search_blacklist controller:")
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")