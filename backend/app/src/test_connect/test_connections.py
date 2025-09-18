import sys
import os
from fastapi import FastAPI
import pytz
from datetime import datetime
import logging
from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
load_dotenv(dotenv_path=os.path.abspath(os.path.join(os.path.dirname(__file__), '../../env/.env')))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Connection Test API")

def test_oracle_connection():
    try:
        from src.connection.oracle import OracleConnection
        logger.info("Testing Oracle connection...")
        conn = OracleConnection().get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM DUAL")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        logger.info(f"Oracle connection successful: {result}")
        return True
    except Exception as e:
        logger.error(f"Oracle connection failed: {str(e)}")
        return False

def test_postgres_connection():
    try:
        from src.connection.postgres import PostgresConnection
        logger.info("Testing PostgreSQL connection...")
        conn = PostgresConnection().get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        logger.info(f"PostgreSQL connection successful: {result}")
        return True
    except Exception as e:
        logger.error(f"PostgreSQL connection failed: {str(e)}")
        return False

@app.get("/test-connections")
async def test_connections_endpoint():
    results = run_connection_tests()
    return results

def run_connection_tests():
    thailand_tz = pytz.timezone('Asia/Bangkok')
    current_time = datetime.now(thailand_tz)
    logger.info(f"Test started at: {current_time}")

    results = {
        "oracle": test_oracle_connection(),
        "postgres": test_postgres_connection(),
    }

    for test_name, result in results.items():
        status = "PASS" if result else "FAIL"
        logger.info(f"{test_name.upper()}: {status}")

    all_passed = all(results.values())
    return {
        "timestamp": str(current_time),
        "results": results,
        "all_passed": all_passed
    }

if __name__ == "__main__":
    run_connection_tests()
