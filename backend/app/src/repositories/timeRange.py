from fastapi import HTTPException, status
from src.connection.oracle import OracleConnection
from typing import List, Dict, Optional


class TimeRangeRepository:
    """Repository สำหรับจัดการข้อมูล Time Range"""

    def __init__(self):
        self.oracle_connection = OracleConnection().get_connection()
        self.not_found_msg = 'Time range not found'
    

    def _row_to_dict(self, row, columns) -> Dict:
        """แปลง row data เป็น dict"""
        return {
            'id': row[columns.index('ID')],
            'start_time': row[columns.index('START_TIME')],
            'end_time': row[columns.index('END_TIME')]
        }


    def get_all(self) -> List[Dict]:
        """ดึงข้อมูล time range ทั้งหมด"""
        sql_command = 'SELECT ID, START_TIME, END_TIME FROM BMA_PHASE_II.TIME_RANGES ORDER BY START_TIME'

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command)
        
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        cursor.close()

        # แปลงเป็น list of dict
        result = [self._row_to_dict(row, columns) for row in rows]

        return result


    def get_by_id(self, id: int) -> Dict:
        """ดึงข้อมูล time range ตาม ID"""
        sql_command = """
            SELECT ID, START_TIME, END_TIME 
            FROM BMA_PHASE_II.TIME_RANGES 
            WHERE ID = :id
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command, {'id': id})
        
        row = cursor.fetchone()
        
        if not row:
            cursor.close()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=self.not_found_msg
            )
        
        columns = [col[0] for col in cursor.description]
        cursor.close()

        return self._row_to_dict(row, columns)
    

    def get_by_endtime(self, end_time: str) -> Dict:
        """ดึงข้อมูล time range ตาม end_time"""
        sql_command = """
            SELECT ID, START_TIME, END_TIME 
            FROM BMA_PHASE_II.TIME_RANGES 
            WHERE END_TIME = :end_time
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command, {'end_time': end_time})
        
        row = cursor.fetchone()
        
        if not row:
            cursor.close()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=self.not_found_msg
            )
        
        columns = [col[0] for col in cursor.description]
        cursor.close()
        
        return self._row_to_dict(row, columns)


    def get_by_starttime(self, start_time: str) -> Dict:
        """ดึงข้อมูล time range ตาม start_time"""
        sql_command = """
            SELECT ID, START_TIME, END_TIME 
            FROM BMA_PHASE_II.TIME_RANGES 
            WHERE START_TIME = :start_time
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command, {'start_time': start_time})
        
        row = cursor.fetchone()
        
        if not row:
            cursor.close()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=self.not_found_msg
            )
        
        columns = [col[0] for col in cursor.description]
        cursor.close()
        
        return self._row_to_dict(row, columns)


    def get_first_record(self) -> Optional[Dict]:
        """ดึงข้อมูล time range แรกสุด"""
        sql_command = """
            SELECT ID, START_TIME, END_TIME 
            FROM BMA_PHASE_II.TIME_RANGES 
            ORDER BY ID ASC 
            FETCH FIRST 1 ROW ONLY
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command)
        
        row = cursor.fetchone()
        
        if not row:
            cursor.close()
            return None
            
        columns = [col[0] for col in cursor.description]
        cursor.close()

        return self._row_to_dict(row, columns)
    

    def get_last_record(self) -> Optional[Dict]:
        """ดึงข้อมูล time range ล่าสุด"""
        sql_command = """
            SELECT ID, START_TIME, END_TIME 
            FROM BMA_PHASE_II.TIME_RANGES 
            ORDER BY ID DESC 
            FETCH FIRST 1 ROW ONLY
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command)
        
        row = cursor.fetchone()
        
        if not row:
            cursor.close()
            return None
            
        columns = [col[0] for col in cursor.description]
        cursor.close()

        return self._row_to_dict(row, columns)


    def create(self, start_time: str, end_time: str) -> Dict:
        """สร้าง time range ใหม่"""
        sql_command = """
            INSERT INTO BMA_PHASE_II.TIME_RANGES (START_TIME, END_TIME) 
            VALUES (:start_time, :end_time)
            RETURNING ID INTO :new_id
        """

        cursor = self.oracle_connection.cursor()
        new_id = cursor.var(int)
        
        cursor.execute(sql_command, {
            'start_time': start_time,
            'end_time': end_time,
            'new_id': new_id
        })
        
        self.oracle_connection.commit()
        cursor.close()

        return {
            'id': new_id.getvalue()[0],
            'start_time': start_time,
            'end_time': end_time
        }


    def update(self, id: int, start_time: str = None, end_time: str = None) -> Dict:
        """อัพเดท time range"""
        # ตรวจสอบว่ามี record อยู่จริง
        existing = self.get_by_id(id)
        
        # สร้าง update query แบบ dynamic
        updates = []
        params = {'id': id}
        
        if start_time is not None:
            updates.append("START_TIME = :start_time")
            params['start_time'] = start_time
        
        if end_time is not None:
            updates.append("END_TIME = :end_time")
            params['end_time'] = end_time
        
        if not updates:
            return existing  # ไม่มีอะไรต้อง update
        
        sql_command = f"""
            UPDATE BMA_PHASE_II.TIME_RANGES 
            SET {', '.join(updates)} 
            WHERE ID = :id
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command, params)
        self.oracle_connection.commit()
        cursor.close()

        # ดึงข้อมูลที่ update แล้วกลับมา
        return self.get_by_id(id)


    def delete(self, id: int) -> bool:
        """ลบ time range"""
        # ตรวจสอบว่ามี record อยู่จริง
        self.get_by_id(id)
        
        sql_command = """
            DELETE FROM BMA_PHASE_II.TIME_RANGES 
            WHERE ID = :id
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command, {'id': id})
        self.oracle_connection.commit()
        cursor.close()

        return True


    def exists(self, start_time: str, end_time: str) -> bool:
        """ตรวจสอบว่ามี time range นี้อยู่แล้วหรือไม่"""
        sql_command = """
            SELECT COUNT(*) 
            FROM BMA_PHASE_II.TIME_RANGES 
            WHERE START_TIME = :start_time AND END_TIME = :end_time
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command, {
            'start_time': start_time,
            'end_time': end_time
        })
        
        count = cursor.fetchone()[0]
        cursor.close()

        return count > 0