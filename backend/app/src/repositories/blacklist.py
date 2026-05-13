# backend/app/src/repositories/blacklist.py
from src.connection.postgres import PostgresConnection
import logging
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

    # ✅ เพิ่ม method นี้
    # backend/app/src/repositories/blacklist.py  (เฉพาะ method นี้)

    def check_blacklist_in_vehicle_pass(self, minutes: int = 5):
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
        insert_query = """
            INSERT INTO blacklists_passing (
                id, blacklist_id, pass_id, plate_url, image_url,
                plate_no, province, checkpoint, latitude, longtitude,
                direction, pass_time, type, color, status
            )
            VALUES (
                %(id)s, %(blacklist_id)s, %(pass_id)s, %(plate_url)s, %(image_url)s,
                %(plate_no)s, %(province)s, %(checkpoint)s, %(latitude)s, %(longtitude)s,
                %(direction)s, %(pass_time)s, %(type)s, %(color)s, 'new'
            )
            ON CONFLICT (pass_id) DO NOTHING
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

            for idx, r in enumerate(results, start=1):
                logger.info(f"📝 inserting pass_id={r['pass_id']} plate={r['plate_no']}")
                try:
                    cur.execute(insert_query, {
                        "id":           idx,
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
                    logger.info(f"✅ insert success pass_id={r['pass_id']}")
                except Exception as insert_err:
                    logger.error(f"❌ insert failed: {insert_err}")
                    raise

            conn.commit()
            logger.info("✅ commit done")
            return results

        except Exception as e:
            logger.error(f"❌ ERROR: {e}")
            if conn:
                conn.rollback()
            raise e
        finally:
            if cur:  cur.close()
            if conn: conn.close()