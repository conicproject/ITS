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
    _instance = None

    BATCH_LIMIT = 5000

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return  # ✅ ถ้าเคย init แล้ว → ข้ามเลย

        logger.info("🚀 Initializing DataVehicleRepository...")
        self.oracle_conn = OracleConnection()
        self.postgres_conn = PostgresConnection()
        self.last_time = self._get_last_time_from_db()
        logger.info(f"🕓 Initial last_time = {self.last_time}")
        self._initialized = True

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
            logger.info("⏭️ extract_data not ready yet, using default last_time")  # ✅ ไม่มี traceback
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

    # data_vehicle.py — แก้ record_5m ให้รับ slot time
    def record_5m(self, slot_start: datetime, slot_end: datetime):
        conn = None
        cursor = None
        try:
            conn = self.postgres_conn.get_connection()
            cursor = conn.cursor()

            logger.info(f"📊 Aggregating vehicle_pass → record [{slot_start} → {slot_end}]")

            sql = """
                INSERT INTO records (
                    checkpoint_id,
                    direction,
                    car_type_id,
                    volume,
                    lane_volume,
                    lane_speed,
                    avg_speed,
                    time_range_id,
                    created_date,
                    created_at
                )
                SELECT
                    cp.checkpoint_id,

                    -- direction volume
                    jsonb_object_agg(
                        dirs.direction_index,
                        COALESCE(agg.volume, 0)
                    ) AS direction,

                    vt.type_id,

                    -- ✅ FIX: ใช้ total_agg แทน SUM(agg.volume)
                    COALESCE(total_agg.total_volume, 0) AS volume,

                    -- lane volume
                    jsonb_object_agg(
                        ln.lane_code,
                        COALESCE(lane_agg.volume, 0)
                    ) AS lane_volume,

                    -- lane speed
                    jsonb_object_agg(
                        ln.lane_code,
                        COALESCE(lane_agg.avg_speed, 0)
                    ) AS lane_speed,

                    -- avg speed (weighted)
                    COALESCE(
                        SUM(lane_agg.volume * lane_agg.avg_speed)
                        / NULLIF(SUM(lane_agg.volume), 0),
                    0)::int AS avg_speed,

                    234,
                    %(created)s,
                    NOW()

                FROM checkpoint cp

                -- lock direction
                CROSS JOIN (
                    SELECT unnest(ARRAY['eastWest','westEast']) AS direction_index
                ) dirs

                -- lock vehicle type
                CROSS JOIN (
                    SELECT type_id FROM vehicle_type
                ) vt

                LEFT JOIN lane ln
                    ON ln.checkpoint_id::int = cp.checkpoint_id

                -- aggregate direction
                LEFT JOIN (
                    SELECT
                        vp.crossing_id,
                        vp.direction_index,
                        vt2.type_id,
                        COUNT(*) AS volume
                    FROM vehicle_pass vp
                    LEFT JOIN vehicle_type vt2
                        ON vp.vehicle_type = vt2.type_name
                    WHERE vp.pass_time >= %(start)s
                    AND vp.pass_time < %(end)s
                    GROUP BY
                        vp.crossing_id,
                        vp.direction_index,
                        vt2.type_id
                ) agg
                    ON agg.crossing_id = cp.checkpoint_id
                    AND agg.direction_index = dirs.direction_index
                    AND agg.type_id = vt.type_id

                -- ✅ FIX: aggregate total volume แยกต่างหาก
                LEFT JOIN (
                    SELECT
                        vp.crossing_id,
                        vt2.type_id,
                        COUNT(*) AS total_volume
                    FROM vehicle_pass vp
                    LEFT JOIN vehicle_type vt2
                        ON vp.vehicle_type = vt2.type_name
                    WHERE vp.pass_time >= %(start)s
                    AND vp.pass_time < %(end)s
                    GROUP BY
                        vp.crossing_id,
                        vt2.type_id
                ) total_agg
                    ON total_agg.crossing_id = cp.checkpoint_id
                    AND total_agg.type_id = vt.type_id

                -- aggregate lane
                LEFT JOIN (
                    SELECT
                        vp.crossing_id,
                        vp.lane_no,
                        vt2.type_id,
                        COUNT(*) AS volume,
                        AVG(vp.vehicle_speed) FILTER (WHERE vp.vehicle_speed IS NOT NULL) AS avg_speed
                    FROM vehicle_pass vp
                    LEFT JOIN vehicle_type vt2
                        ON vp.vehicle_type = vt2.type_name
                    WHERE vp.pass_time >= %(start)s
                    AND vp.pass_time < %(end)s
                    GROUP BY
                        vp.crossing_id,
                        vp.lane_no,
                        vt2.type_id
                ) lane_agg
                    ON lane_agg.crossing_id = cp.checkpoint_id
                    AND lane_agg.lane_no::varchar = ln.lane_code
                    AND lane_agg.type_id = vt.type_id

                GROUP BY
                    cp.checkpoint_id,
                    vt.type_id,
                    total_agg.total_volume  -- ✅ เพิ่ม total_volume เข้า GROUP BY

                ON CONFLICT (checkpoint_id, car_type_id, created_date)
                DO UPDATE SET
                    volume = EXCLUDED.volume,
                    direction = EXCLUDED.direction,
                    lane_volume = EXCLUDED.lane_volume,
                    lane_speed = EXCLUDED.lane_speed,
                    avg_speed = EXCLUDED.avg_speed;
            """

            cursor.execute(sql, {
                "created": slot_start,
                "start": slot_start,
                "end": slot_end
            })

            conn.commit()

            logger.info(f"✅ record_5m done [{slot_start.strftime('%H:%M')} → {slot_end.strftime('%H:%M')}]")

        except Exception:
            logger.exception("❌ Error creating record_5m")
            if conn:
                conn.rollback()
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

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
                    vp.pass_time, vp.vehicle_speed, vt.type_nameth,
                    vu.plate_pic_url, vu.image_path, vu.target_sub_url
                FROM vehicle_pass vp
                LEFT JOIN vehicle_url vu
                    ON vp.pass_id = vu.pass_id
                LEFT JOIN vehicle_type vt
                    ON vp.vehicle_type = vt.type_name
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
