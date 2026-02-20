# backend/app/src/repositories/data_vehicle.py

import json
import logging
from datetime import datetime, timedelta
from src.connection.oracle import OracleConnection
from src.connection.postgres import PostgresConnection

# ตั้งค่า logging ให้แสดงระดับ DEBUG ทั้งใน console และ log file
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("sync_debug.log", mode="a", encoding="utf-8"),
    ],
)
logger = logging.getLogger(__name__)


class DataVehicleRepository:
    """ดึงข้อมูลจาก Oracle และบันทึกลง Postgres แบบ Realtime"""

    BATCH_LIMIT = 5000

    def __init__(self):
        logger.info("🚀 Initializing DataVehicleRepository...")
        self.oracle_conn = OracleConnection()
        self.postgres_conn = PostgresConnection()
        self.last_time = self._get_last_time_from_db()
        logger.info(f"🕓 Initial last_time = {self.last_time}")

    # ---------------- Oracle ----------------
    def _open_oracle(self):
        logger.debug("🔌 Opening Oracle connection...")
        self.oracle_connection = self.oracle_conn.get_connection()
        self.oracle_cursor = self.oracle_connection.cursor()

    def _close_oracle(self):
        logger.debug("🔌 Closing Oracle connection...")
        try:
            if hasattr(self, "oracle_cursor") and self.oracle_cursor:
                self.oracle_cursor.close()
            if hasattr(self, "oracle_connection") and self.oracle_connection:
                self.oracle_connection.close()
        except Exception as e:
            logger.warning(f"⚠️ Error closing Oracle connection: {e}")
        finally:
            self.oracle_cursor, self.oracle_connection = None, None

    # ---------------- Postgres ----------------
    def _get_last_time_from_db(self):
        """อ่านเวลาล่าสุดจากข้อมูลที่บันทึกใน Postgres"""
        conn = None
        cursor = None
        try:
            conn = self.postgres_conn.get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT MAX(last_pass_time) FROM extract_data")
            result = cursor.fetchone()
            last_time = result[0] if result and result[0] else None
            now = datetime.now()

            if last_time and last_time.date() < now.date():
                last_time = now.replace(hour=0, minute=0, second=0, microsecond=0)
                logger.info("🌅 New day detected → reset last_time = 00:00 today")

            if not last_time:
                last_time = now - timedelta(minutes=5)
                logger.info(f"🔰 No last sync → start from {last_time}")

            return last_time

        except Exception as e:
            logger.exception("❌ Error reading last sync time from Postgres:")
            return datetime.now() - timedelta(minutes=5)
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    def _save_to_postgres(self, data_rows):
        """บันทึกข้อมูลลง Postgres แบ่งเป็น sub-batch"""
        if not data_rows:
            logger.info("⏳ No data to save in this batch.")
            return

        logger.info(f"📝 Preparing to save {len(data_rows)} total rows to Postgres.")

        for i in range(0, len(data_rows), self.BATCH_LIMIT):
            sub_batch = data_rows[i:i + self.BATCH_LIMIT]
            latest_time = max(row["PASS_TIME"] for row in sub_batch)
            logger.debug(f"📦 Sub-batch {i // self.BATCH_LIMIT + 1} → {len(sub_batch)} rows (latest_time={latest_time})")

            conn = None
            cursor = None
            try:
                conn = self.postgres_conn.get_connection()
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO extract_data (extract_data_text, extract_data_timestamp, last_pass_time)
                    VALUES (%s, %s, %s)
                """, (
                    json.dumps(sub_batch, default=str),
                    datetime.now(),
                    latest_time
                ))
                conn.commit()
                logger.info(f"💾 Saved {len(sub_batch)} records to Postgres (last_pass_time={latest_time})")
                self.last_time = latest_time

            except Exception as e:
                logger.exception("❌ Failed to save sub-batch to Postgres:")
                if conn:
                    conn.rollback()
            finally:
                if cursor:
                    cursor.close()
                if conn:
                    conn.close()

    # ---------------- Oracle Fetch ----------------
    def get_data_vehicle(self):
        """ดึงข้อมูลใหม่จาก Oracle (เฉพาะของวันนั้น และหลัง last_time)"""
        try:
            self._open_oracle()

            logger.info(f"🔍 Fetching Oracle data since {self.last_time}")

            # 🔹 แก้ไข: ใช้ FETCH FIRST แทน LIMIT (Oracle syntax)
            sql = """
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
                WHERE vp.PASS_TIME >= TRUNC(SYSDATE)
                  AND vp.PASS_TIME < TRUNC(SYSDATE) + 1
                  AND vp.PASS_TIME > TO_TIMESTAMP(:last_time, 'YYYY-MM-DD HH24:MI:SS')
                ORDER BY vp.PASS_TIME
                FETCH FIRST 100 ROWS ONLY
            """

            params = {"last_time": self.last_time.strftime("%Y-%m-%d %H:%M:%S")}
            self.oracle_cursor.execute(sql, params)
            columns = [col[0] for col in self.oracle_cursor.description]
            rows = [dict(zip(columns, row)) for row in self.oracle_cursor.fetchall()]

            logger.info(f"📊 Oracle returned {len(rows)} rows.")
            if rows:
                latest_time = rows[-1]["PASS_TIME"]
                logger.info(f"✅ Found {len(rows)} new records → latest PASS_TIME = {latest_time}")
                self.last_time = latest_time
            else:
                logger.info("⏳ No new data found in Oracle.")
            return rows

        except Exception as e:
            logger.exception("❌ Error querying Oracle:")
            return []
        finally:
            self._close_oracle()

    def data_search_vehicle(self, date, province=None, lpr=None, camera=None, vehicle_type=None):
        """
        ค้นหาข้อมูลจาก VEHICLE_PASS + VEHICLE_URL
        """

        conn = None
        cursor = None

        try:
            conn = self.postgres_conn.get_connection()
            cursor = conn.cursor()

            # ✅ เช็คเวลาเฉพาะ vehicle_pass
            conditions = ["vp.pass_time >= %s", "vp.pass_time < %s"]
            params = [date, date + timedelta(days=1)]

            # จังหวัด
            if province:
                conditions.append("vp.plate_province = %s")
                params.append(province)

            # ทะเบียน
            if lpr:
                conditions.append("vp.plate_no ILIKE %s")
                params.append(f"%{lpr}%")

            # กล้อง
            if camera:
                conditions.append("vp.crossing_id = %s")
                params.append(int(camera))

            # ประเภทรถ
            if vehicle_type:
                conditions.append("vp.vehicle_type = %s")
                params.append(vehicle_type)

            where_clause = " AND ".join(conditions)

            sql = f"""
                SELECT
                    vp.pass_id, vp.crossing_id, vp.crossing_index_code, vp.lane_no, vp.plate_no,
                    vp.direction_index, vp.vehicle_color, vp.vehicle_type, vp.vehicle_color_depth,
                    vp.vehicle_logo, vp.vehicle_sub_logo, vp.vehicle_model, vp.plate_province,
                    vp.pass_time,
                    vu.plate_pic_url, vu.image_path, vu.target_sub_url
                FROM vehicle_pass vp
                LEFT JOIN vehicle_url vu
                    ON vp.pass_id = vu.pass_id
                WHERE {where_clause}
                ORDER BY vp.pass_time DESC
                LIMIT 100
            """

            logger.debug("🔎 SQL: %s", sql)
            logger.debug("📦 PARAMS: %s", params)

            cursor.execute(sql, params)
            rows = cursor.fetchall()

            if not rows:
                logger.info("⏳ No data found for search criteria")
                return []

            columns = [desc[0] for desc in cursor.description]
            result = [dict(zip(columns, row)) for row in rows]

            logger.info("✅ Found %s records", len(result))
            return result

        except Exception:
            logger.exception("❌ Error searching VEHICLE_PASS + VEHICLE_URL:")
            return []

        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    # ---------------- Combined ----------------
    def sync_to_postgres(self):
        """ดึงข้อมูลจาก Oracle แล้วบันทึกเป็น batch 5 นาที"""
        logger.info("🔁 Starting sync_to_postgres()")
        rows = self.get_data_vehicle()
        self._save_to_postgres(rows)


# ---------------- Run Realtime ----------------
if __name__ == "__main__":
    import time
    repo = DataVehicleRepository()
    try:
        while True:
            
            repo.sync_to_postgres()
            print("✅ Synced data from Oracle to Postgres.")
            time.sleep(30)  # ดึงทุก 30 วินาที
    except KeyboardInterrupt:
        print("⏹️ Stop by user")
