# backend/app/src/connection/oracle.py
import cx_Oracle
import os
from dotenv import load_dotenv
import logging
from contextlib import contextmanager
import time

logger = logging.getLogger(__name__)

# โหลด .env จาก project root (ปรับ path ตามจริง)
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
load_dotenv(os.path.join(PROJECT_ROOT, "env", ".env"))

class OracleConnection:
    def __init__(self):
        self.host = os.getenv("ORACLE_HOST")
        self.port = os.getenv("ORACLE_PORT")
        self.service = os.getenv("ORACLE_SERVICE")
        self.username = os.getenv("ORACLE_USER")
        self.password = os.getenv("ORACLE_PASSWORD")
        
        if not all([self.host, self.port, self.service, self.username, self.password]):
            missing = [k for k, v in {
                'ORACLE_HOST': self.host,
                'ORACLE_PORT': self.port,
                'ORACLE_SERVICE': self.service,
                'ORACLE_USER': self.username,
                'ORACLE_PASSWORD': self.password
            }.items() if not v]
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

    def get_connection(self):
        dns_tns = cx_Oracle.makedsn(self.host, self.port, service_name=self.service)
        return cx_Oracle.connect(self.username, self.password, dns_tns, mode=cx_Oracle.SYSDBA)

    @contextmanager
    def get_connection_context(self):
        conn = self.get_connection()
        try:
            yield conn
        finally:
            conn.close()
            logger.debug("Oracle connection closed")
