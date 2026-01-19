# backend/app/src/controller/oracle.py
from fastapi import HTTPException
import logging
from src.services.oracle import OracleService
import cx_Oracle

logger = logging.getLogger(__name__)


class OracleController:
    def __init__(self):
        self.oracle_service = OracleService()

    def get_traffic_pass_yesterday(self):
        try:
            return self.oracle_service.get_traffic_pass_yesterday()

        except cx_Oracle.DatabaseError as e:
            logger.error("Oracle DB error", exc_info=e)
            raise HTTPException(
                status_code=503,
                detail="Database service unavailable"
            )

        except Exception as e:
            logger.exception("Unexpected error")
            raise HTTPException(
                status_code=500,
                detail="Internal server error"
            )

    def get_traffic_truck_pass_yesterday(self):
        try:
            return self.oracle_service.get_traffic_truck_pass_yesterday()

        except cx_Oracle.DatabaseError as e:
            logger.error("Oracle DB error", exc_info=e)
            raise HTTPException(
                status_code=503,
                detail="Database service unavailable"
            )

        except Exception as e:
            logger.exception("Unexpected error")
            raise HTTPException(
                status_code=500,
                detail="Internal server error"
            )
