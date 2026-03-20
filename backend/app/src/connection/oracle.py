import cx_Oracle
import os
from dotenv import load_dotenv
import logging
from contextlib import contextmanager

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
load_dotenv(os.path.join(PROJECT_ROOT, "env", ".env"))


class OracleConnection:
    _tried_connect = False   # ✅ class-level → ใช้ร่วมกันทุก instance
    _conn = None

    def __init__(self):
        self.host = os.getenv("ORACLE_HOST")
        self.port = os.getenv("ORACLE_PORT")
        self.service = os.getenv("ORACLE_SERVICE")
        self.username = os.getenv("ORACLE_USER")
        self.password = os.getenv("ORACLE_PASSWORD")

        self.dsn = cx_Oracle.makedsn(
            self.host,
            int(self.port),
            service_name=self.service
        )

    def get_connection(self):
        if OracleConnection._tried_connect:
            return OracleConnection._conn  # ✅ คืน conn เดิม ไม่ใช่ None เสมอ

        OracleConnection._tried_connect = True

        try:
            OracleConnection._conn = cx_Oracle.connect(
                self.username,
                self.password,
                self.dsn,
                mode=cx_Oracle.SYSDBA
            )
            logger.info("✅ Oracle connected successfully → %s:%s/%s", self.host, self.port, self.service)
            return OracleConnection._conn

        except cx_Oracle.DatabaseError as e:
            logger.warning("❌ Oracle connection failed → %s:%s/%s | reason: %s", self.host, self.port, self.service, e)
            return None