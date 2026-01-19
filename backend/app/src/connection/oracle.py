# backend/app/src/connection/oracle.py
import cx_Oracle
import os
from dotenv import load_dotenv
import logging
from contextlib import contextmanager
import time

logger = logging.getLogger(__name__)

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

        self.dsn = cx_Oracle.makedsn(
            self.host,
            int(self.port),
            service_name=self.service
        )

        self._conn = None

    # ===============================
    # 🔁 connect with retry forever
    # ===============================
    def get_connection(self):
        while True:
            try:
                conn = cx_Oracle.connect(
                    self.username,
                    self.password,
                    self.dsn,
                    mode=cx_Oracle.SYSDBA
                )

                logger.info("✅ Oracle connected")
                return conn

            except cx_Oracle.DatabaseError as e:
                logger.error(
                    f"❌ Oracle connect failed, retrying Error: {str(e)}"
                )

    # ===============================
    # ♻️ get or reconnect
    # ===============================
    def get_or_reconnect(self):
        if self._conn:
            try:
                self._conn.ping()
                return self._conn
            except cx_Oracle.DatabaseError:
                logger.warning("🔌 Oracle connection lost, reconnecting...")
                try:
                    self._conn.close()
                except Exception:
                    pass

        self._conn = self.get_connection()
        return self._conn

    # ===============================
    # 🧩 context manager
    # ===============================
    @contextmanager
    def get_connection_context(self):
        conn = self.get_or_reconnect()
        try:
            yield conn
        except cx_Oracle.DatabaseError:
            logger.exception("🔥 Oracle error during operation")
            raise
