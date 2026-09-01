# backend/app/src/services/blacklist.py
from src.repositories.blacklist import BlacklistRepository
import logging

logger = logging.getLogger(__name__)

class BlacklistService:
    def __init__(self):
        self.blacklist_repo = BlacklistRepository()

    def get_blacklist(self):
        return self.blacklist_repo.get_blacklist()

    def insert_blacklist(self, blacklist_data: dict):
        return self.blacklist_repo.insert_blacklist(blacklist_data)

    def delete_blacklist(self, blacklist_id: int):
        return self.blacklist_repo.delete_blacklist(blacklist_id)

    def alert_blacklist_passing(self, license_plate: str):
        return self.blacklist_repo.alert_blacklist_passing(license_plate)

    def check_blacklist_in_vehicle_pass(self, minutes: int = 5):
        return self.blacklist_repo.check_blacklist_in_vehicle_pass(minutes)

    def search_blacklist(self, date, date_to=None, plate_no=None, page=1, page_size=10):
        try:
            page = max(int(page or 1), 1)
            page_size = min(max(int(page_size or 10), 1), 100)
            offset = (page - 1) * page_size

            logger.info(
                "🔍 Searching blacklist with: date=%s, date_to=%s, plate_no=%s, page=%s, page_size=%s",
                date, date_to, plate_no, page, page_size,
            )

            rows, total_count = self.blacklist_repo.search_blacklist(
                date=date,
                date_to=date_to,
                plate_no=plate_no,
                limit=page_size,
                offset=offset,
            )

            if not rows:
                logger.info("⏳ No results found for blacklist search criteria")
                return [], 0

            logger.info(f"✅ Found {len(rows)} rows on page {page} (total match = {total_count})")
            return rows, total_count

        except Exception:
            logger.exception("❌ Error in search_blacklist service:")
            raise