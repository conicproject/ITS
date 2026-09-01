# backend/app/src/repositories/blacklist.py
from src.connection.postgres import PostgresConnection
import logging
from datetime import datetime, timedelta
logger = logging.getLogger(__name__)

class BlacklistRepository:
    def __init__(self):
        self.conn = PostgresConnection()

    def get_blacklist(self):
        query = """
            SELECT id, department_id, license_plate, plate_province,
                color, type, special_type_id, note, created_date
            FROM blacklists
            ORDER BY id DESC
        """
        conn = None
        cur  = None
        try:
            conn = self.conn.get_connection()
            cur  = conn.cursor()
            cur.execute(query)
            rows = cur.fetchall()
            cols = [desc[0] for desc in cur.description]
            return [dict(zip(cols, row)) for row in rows]
        except Exception as e:
            raise e
        finally:
            if cur:  cur.close()
            if conn: conn.close()

    def insert_blacklist(self, blacklist_data: dict):
        query = """
            INSERT INTO blacklists (
                department_id, license_plate, plate_province,
                color, type, special_type_id, note, created_date
            )
            VALUES (
                %(department_id)s, %(license_plate)s, %(plate_province)s,
                %(color)s, %(type)s, %(special_type_id)s, %(note)s, CURRENT_DATE
            )
            RETURNING id
        """
        params = {
            "department_id":   blacklist_data.get("department_id"),
            "license_plate":   blacklist_data.get("license_plate"),
            "plate_province":  blacklist_data.get("plate_province"),
            "color":           blacklist_data.get("color"),
            "type":            blacklist_data.get("type"),
            "special_type_id": blacklist_data.get("special_type_id"),
            "note":            blacklist_data.get("note", ""),
        }
        conn = None
        cur  = None
        try:
            conn = self.conn.get_connection()
            cur  = conn.cursor()
            cur.execute(query, params)
            new_id = cur.fetchone()[0]
            conn.commit()
            return {"id": new_id, "message": "Blacklist record inserted successfully"}
        except Exception as e:
            if conn: conn.rollback()
            raise e
        finally:
            if cur:  cur.close()
            if conn: conn.close()

    def delete_blacklist(self, blacklist_id: int):
        query = "DELETE FROM blacklists WHERE id = %(id)s RETURNING id"
        conn = None
        cur  = None
        try:
            conn = self.conn.get_connection()
            cur  = conn.cursor()
            cur.execute(query, {"id": blacklist_id})
            deleted = cur.fetchone()
            conn.commit()
            if not deleted:
                raise ValueError(f"ID {blacklist_id} not found")
            return {"id": blacklist_id, "message": "Deleted successfully"}
        except Exception as e:
            if conn: conn.rollback()
            raise e
        finally:
            if cur:  cur.close()
            if conn: conn.close()

    def alert_blacklist_passing(self, license_plate: str):
        query = """
            SELECT id, department_id, license_plate, plate_province,
                color, type, special_type_id, note, created_date
            FROM blacklists
            WHERE license_plate = %(license_plate)s
        """
        conn = None
        cur  = None
        try:
            conn = self.conn.get_connection()
            cur  = conn.cursor()
            cur.execute(query, {"license_plate": license_plate})
            row = cur.fetchone()
            if row:
                cols = [desc[0] for desc in cur.description]
                return dict(zip(cols, row))
            return None
        except Exception as e:
            raise e
        finally:
            if cur:  cur.close()
            if conn: conn.close()

    def check_blacklist_in_vehicle_pass(self, minutes: int = 10):
        query = """
            SELECT
                vp.pass_id,
                vp.plate_no,
                vp.plate_province,
                vp.pass_time,
                vp.crossing_id,
                vp.vehicle_type,
                vp.vehicle_color,
                vp.direction_index,
                vu.plate_pic_url,
                vu.image_path,
                bl.id               AS blacklist_id,
                bl.color            AS bl_color,
                bl.type             AS bl_type,
                cp.checkpoint_nickname,
                cp.latitude,
                cp.longtitude
            FROM vehicle_pass vp
            INNER JOIN blacklists bl
                ON vp.plate_no = bl.license_plate
            LEFT JOIN vehicle_url vu
                ON vu.pass_id = vp.pass_id
            LEFT JOIN checkpoint cp
                ON cp.checkpoint_id = vp.crossing_id
            WHERE vp.pass_time >= NOW() - (%(minutes)s || ' minutes')::INTERVAL
            AND vp.pass_time <= NOW()
            ORDER BY vp.pass_time DESC
        """
        # ✅ ใช้ pass_id เป็น conflict target แทน id ที่ generate เอง
        # ต้องมี: ALTER TABLE blacklists_passing ADD CONSTRAINT blacklists_passing_pass_id_key UNIQUE (pass_id);
        insert_query = """
            INSERT INTO blacklists_passing (
                blacklist_id, pass_id, plate_url, image_url,
                plate_no, province, checkpoint, latitude, longtitude,
                direction, pass_time, type, color, status
            )
            VALUES (
                %(blacklist_id)s, %(pass_id)s, %(plate_url)s, %(image_url)s,
                %(plate_no)s, %(province)s, %(checkpoint)s, %(latitude)s, %(longtitude)s,
                %(direction)s, %(pass_time)s, %(type)s, %(color)s, 'new'
            )
            ON CONFLICT (pass_id) DO NOTHING
            RETURNING id
        """
        conn = None
        cur  = None
        try:
            conn = self.conn.get_connection()
            cur  = conn.cursor()

            cur.execute(query, {"minutes": minutes})
            rows = cur.fetchall()
            cols = [desc[0] for desc in cur.description]
            results = [dict(zip(cols, row)) for row in rows]

            logger.info(f"🔍 found {len(results)} matches, attempting insert...")

            inserted_count = 0
            for r in results:
                try:
                    cur.execute(insert_query, {
                        "blacklist_id": r["blacklist_id"],
                        "pass_id":      r["pass_id"],
                        "plate_url":    r.get("plate_pic_url"),
                        "image_url":    r.get("image_path"),
                        "plate_no":     r["plate_no"],
                        "province":     r.get("plate_province"),
                        "checkpoint":   r.get("checkpoint_nickname"),
                        "latitude":     str(r.get("latitude") or ""),
                        "longtitude":   str(r.get("longtitude") or ""),
                        "direction":    r.get("direction_index"),
                        "pass_time":    r["pass_time"],
                        "type":         r.get("bl_type"),
                        "color":        r.get("bl_color"),
                    })
                    if cur.fetchone():
                        inserted_count += 1
                        logger.info(f"✅ insert success pass_id={r['pass_id']}")
                    else:
                        logger.info(f"⏭️ skip duplicate pass_id={r['pass_id']}")
                except Exception as insert_err:
                    logger.error(f"❌ insert failed: {insert_err}")
                    raise

            conn.commit()
            logger.info(f"✅ commit done — {inserted_count} new rows inserted")
            return results

        except Exception as e:
            logger.error(f"❌ ERROR: {e}")
            if conn:
                conn.rollback()
            raise e
        finally:
            if cur:  cur.close()
            if conn: conn.close()

    def insert_violation_from_blacklist(self, results: list):
        insert_query = """
            INSERT INTO violation_records (
                checkpoint_id, direction, car_type_id,
                volume, time_range_id, created_date, created_at
            )
            VALUES (
                %(checkpoint_id)s, %(direction)s, %(car_type_id)s,
                %(volume)s, %(time_range_id)s, %(created_date)s, %(created_at)s
            )
            RETURNING id
        """
        conn = None
        cur  = None
        try:
            conn = self.conn.get_connection()
            cur  = conn.cursor()

            inserted_ids = []
            for r in results:
                pass_time = r.get("pass_time")
                params = {
                    "checkpoint_id": r.get("crossing_id"),
                    "direction":     str(r.get("direction_index") or "")[:10],
                    "car_type_id":   r.get("vehicle_type"),
                    "volume":        1,
                    "time_range_id": None,
                    "created_date":  pass_time.date() if pass_time else None,
                    "created_at":    pass_time,
                }
                cur.execute(insert_query, params)
                row_inserted = cur.fetchone()
                if row_inserted:
                    inserted_ids.append(row_inserted[0])
                    logger.info(f"✅ inserted violation_record id={row_inserted[0]}")

            conn.commit()
            logger.info(f"✅ commit done — {len(inserted_ids)} records inserted into violation_records")
            return {"inserted": len(inserted_ids), "ids": inserted_ids}

        except Exception as e:
            logger.error(f"❌ ERROR insert_violation_from_blacklist: {e}")
            if conn:
                conn.rollback()
            raise e
        finally:
            if cur:  cur.close()
            if conn: conn.close()


    def _build_search_conditions(self, date_from, date_to, plate_no):
        conditions = ["blacklist_id IS NOT NULL", "pass_time >= %s", "pass_time < %s"]
        params = [date_from, date_to + timedelta(days=1)]
 
        if plate_no:
            conditions.append("plate_no ILIKE %s")
            params.append(f"%{plate_no}%")
 
        return " AND ".join(conditions), params
 
    def search_blacklist(self, date, date_to=None, plate_no=None, limit=10, offset=0):
        conn = None
        cur  = None
 
        limit = min(int(limit or 10), 100)
        offset = max(int(offset or 0), 0)
        date_to = date_to or date
 
        try:
            conn = self.conn.get_connection()
            cur  = conn.cursor()
 
            where_clause, params = self._build_search_conditions(date, date_to, plate_no)
 
            sql = f"""
                SELECT id, blacklist_id, pass_id, plate_url, image_url,
                       plate_no, province, checkpoint, latitude, longtitude,
                       direction, pass_time, type, color, rtsp_url, status,
                       COUNT(*) OVER() AS total_count
                FROM blacklists_passing
                WHERE {where_clause}
                ORDER BY pass_time DESC
                LIMIT %s OFFSET %s
            """
 
            query_params = params + [limit, offset]
            logger.debug("🔎 SQL: %s", sql)
            logger.debug("📦 PARAMS: %s", query_params)
 
            cur.execute(sql, query_params)
            rows = cur.fetchall()
 
            if not rows:
                logger.info("⏳ No data found for blacklist search criteria")
                return [], 0
 
            cols = [desc[0] for desc in cur.description]
            result = [dict(zip(cols, row)) for row in rows]
 
            # total_count เหมือนกันทุกแถว (window function) — ดึงจากแถวแรกแล้วเอาออกจาก dict ข้อมูล
            total_count = result[0]["total_count"]
            for r in result:
                r.pop("total_count", None)
 
            logger.info("✅ Found %s rows on this page (total match = %s)", len(result), total_count)
            return result, total_count
 
        except Exception:
            logger.exception("❌ Error searching blacklists_passing:")
            return [], 0
        finally:
            if cur:  cur.close()
            if conn: conn.close()