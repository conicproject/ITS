# backend/app/src/repositories/user.py
from src.connection.oracle import OracleConnection
from src.connection.postgres import PostgresConnection

import logging

logger = logging.getLogger(__name__)

def insert_user(username: str, hashed_password: str):
    """Insert user ใหม่ลง Postgres"""
    conn = PostgresConnection()
    try:
        with conn.get_connection() as connection:
            with connection.cursor() as cursor:
                # ตรวจสอบ username ซ้ำ
                cursor.execute(
                    "SELECT user_id FROM users WHERE user_name = %s",
                    (username,)
                )
                if cursor.fetchone():
                    return None  # ให้ controller ไปจัดการ error เอง

                # Insert user
                cursor.execute(
                    """
                    INSERT INTO users (user_name, user_password)
                    VALUES (%s, %s)
                    RETURNING user_id, user_name, user_create_at
                    """,
                    (username, hashed_password)
                )
                user = cursor.fetchone()
                connection.commit()
                return user
    except Exception as e:
        print("Insert user error:", str(e))
        raise

def get_all_user():
    """ดึงข้อมูล users จาก Oracle database"""
    try:
        oracle_conn = OracleConnection()
        
        with oracle_conn.get_connection_context() as conn:
            cursor = conn.cursor()
            
            # Query ข้อมูลจาก Oracle
            query = "SELECT * FROM BMA_PHASE_II.USERS WHERE ROWNUM <= 5"
            logger.info(f"Executing query: {query}")
            
            cursor.execute(query)
            
            # ดึง column names
            columns = [desc[0] for desc in cursor.description]
            
            # ดึงข้อมูล
            rows = cursor.fetchall()
            
            # แปลงเป็น list of dictionaries
            users = []
            for row in rows:
                user_dict = dict(zip(columns, row))
                users.append(user_dict)
            
            cursor.close()
            
            logger.info(f"Successfully fetched {len(users)} users from Oracle")
            
            return {
                "users": users,
                "total_count": len(users),
                "source": "Oracle BMA_PHASE_II.USERS"
            }
            
    except Exception as e:
        logger.error(f"Error fetching users from Oracle: {str(e)}")
        # Return fallback data ในกรณีที่เกิด error
        return {
            "error": str(e),
            "users": ["Alice", "Bob", "Charlie"],  # fallback data
            "source": "Fallback data due to Oracle connection error"
        }

def get_user_by_id(user_id: int):
    """ดึงข้อมูล user ตาม ID จาก Oracle database"""
    try:
        oracle_conn = OracleConnection()
        
        with oracle_conn.get_connection_context() as conn:
            cursor = conn.cursor()
            
            # Query ข้อมูล user ตาม ID (ปรับ column name ตามจริงใน database)
            query = "SELECT * FROM BMA_PHASE_II.USERS WHERE USER_ID = :user_id AND ROWNUM = 1"
            logger.info(f"Executing query: {query} with user_id: {user_id}")
            
            cursor.execute(query, {"user_id": user_id})
            
            # ดึง column names
            columns = [desc[0] for desc in cursor.description]
            
            # ดึงข้อมูล
            row = cursor.fetchone()
            
            cursor.close()
            
            if row:
                user_dict = dict(zip(columns, row))
                logger.info(f"Successfully fetched user {user_id} from Oracle")
                
                return {
                    "user": user_dict,
                    "source": "Oracle BMA_PHASE_II.USERS"
                }
            else:
                logger.warning(f"User {user_id} not found in Oracle")
                return {
                    "error": f"User {user_id} not found",
                    "user": None
                }
            
    except Exception as e:
        logger.error(f"Error fetching user {user_id} from Oracle: {str(e)}")
        # Return fallback data
        return {
            "error": str(e),
            "user": {"id": user_id, "name": f"User {user_id}"},  # fallback data
            "source": "Fallback data due to Oracle connection error"
        }