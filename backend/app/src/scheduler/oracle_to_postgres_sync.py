# backend/app/src/scheduler/oracle_to_postgres_sync.py

import time
import logging
import json
from datetime import datetime, timedelta
from statistics import mean
from src.connection.oracle import OracleConnection
from src.connection.postgres import PostgresConnection

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

FETCH_INTERVAL_MINUTES = 5
STATE_FILE = "last_sync_time.txt"


def get_last_sync_time():
    try:
        with open(STATE_FILE, "r") as f:
            ts = f.read().strip()
            return datetime.fromisoformat(ts)
    except FileNotFoundError:
        return datetime.now() - timedelta(minutes=FETCH_INTERVAL_MINUTES)
    except Exception as e:
        logger.error(f"Error reading state file: {e}")
        return datetime.now() - timedelta(minutes=FETCH_INTERVAL_MINUTES)


def save_last_sync_time(ts: datetime):
    with open(STATE_FILE, "w") as f:
        f.write(ts.isoformat())


def fetch_from_oracle(start_time: datetime, end_time: datetime):
    oracle_conn = OracleConnection()
    with oracle_conn.get_connection_context() as conn:
        cursor = conn.cursor()

        sql_command = """
            SELECT pr.PROJECT_NAME, ch.CHECKPOINT_ID, ch.CHECKPOINT_NICKNAME, la.ROAD_DIRECTION,
                   dt.DISTRICT_NAME, vt.TYPE_NAMETH, vp.PLATE_NO, p.PROVINCE_NAMETH,
                   vu.PLATE_PIC_URL, vu.IMAGE_PATH,
                   ch.LATITUDE, ch.LONGTITUDE, vp.LANE_NO, rd.ROAD_NAME,
                   vc.COLOR_NAMETH, vp.VEHICLE_SPEED, vp.PASS_TIME
            FROM XVOT_XVOTDB_USER.VEHICLE_PASS vp
                JOIN CHECKPOINT ch ON ch.AREA_CODE = vp.AREA_CODE 
                JOIN VEHICLE_TYPE vt ON vt.TYPE_NAME = vp.VEHICLE_TYPE
                JOIN VEHICLE_COLOR vc ON vc.COLOR_NAME = vp.VEHICLE_COLOR
                JOIN PROJECT pr ON pr.PROJECT_ID = ch.PROJECT_ID 
                JOIN LANE la ON la.CHECKPOINT_ID = ch.CHECKPOINT_ID AND la.LANE_CODE = vp.LANE_NO
                JOIN DISTRICT dt ON dt.DISTRICT_ID = ch.DISTRICT_ID
                JOIN ROAD rd ON rd.ROAD_ID = ch.ROAD_ID
                JOIN CAMERA c ON c.CAMERA_ID = la.CAMERA_ID
                JOIN XVOT_XVOTDB_USER.VEHICLE_URL vu ON vu.PASS_ID = vp.PASS_ID
                JOIN PROVINCE p ON p.PROVINCE_ID = vp.PLATE_PROVINCE
            WHERE vp.PASS_TIME BETWEEN TO_DATE(:start_time, 'YYYY-MM-DD HH24:MI:SS')
                                  AND TO_DATE(:end_time, 'YYYY-MM-DD HH24:MI:SS')
            ORDER BY vp.PASS_TIME ASC
        """

        cursor.execute(sql_command, {
            "start_time": start_time.strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": end_time.strftime("%Y-%m-%d %H:%M:%S"),
        })

        columns = [col[0].lower() for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
        logger.info(f"✅ Oracle returned {len(rows)} rows from {start_time} → {end_time}")
        return rows


def save_to_postgres_as_json(rows):
    if not rows:
        logger.info("⚠️ No new data to insert.")
        return

    # คำนวณข้อมูลสรุป
    total = len(rows)
    speeds = [float(r["vehicle_speed"]) for r in rows if r.get("vehicle_speed") is not None]
    avg_speed = mean(speeds) if speeds else 0.0
    finish_time = datetime.now()

    # เพิ่ม field inserted_at ให้แต่ละ record
    for r in rows:
        r["inserted_at"] = finish_time.isoformat()

    # แปลงข้อมูลเป็น JSON
    extract_data_json = json.dumps(rows, ensure_ascii=False)

    # บันทึกลง PostgreSQL
    pg_conn = PostgresConnection()
    conn = pg_conn.get_connection()
    cursor = conn.cursor()

    insert_sql = """
        INSERT INTO tb_enforcement_extract_5m (
            extract_data, extract_total, extract_avg_speeds, extract_finish, create_at
        )
        VALUES (%s, %s, %s, %s, NOW());
    """

    try:
        cursor.execute(insert_sql, (extract_data_json, total, avg_speed, finish_time))
        conn.commit()
        logger.info(f"💾 Inserted JSON extract ({total} records, avg_speed={avg_speed:.2f}) into tb_enforcement_extract_5m.")
    except Exception as e:
        conn.rollback()
        logger.error(f"❌ Error inserting JSON extract: {e}")
    finally:
        cursor.close()
        conn.close()


def main():
    logger.info("🚀 Starting Oracle → PostgreSQL JSON sync every 5 minutes...")
    while True:
        try:
            start_time = get_last_sync_time()
            end_time = datetime.now()

            rows = fetch_from_oracle(start_time, end_time)
            save_to_postgres_as_json(rows)

            save_last_sync_time(end_time)
        except Exception as e:
            logger.error(f"⚠️ Error during sync loop: {e}")
        finally:
            time.sleep(FETCH_INTERVAL_MINUTES * 60)


if __name__ == "__main__":
    main()
