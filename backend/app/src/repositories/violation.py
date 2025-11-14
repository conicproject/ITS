# backend/app/src/repositories/violation.py
from unittest import result
from src.schemas.violation import ViolationRecord
from src.connection.oracle import OracleConnection

import datetime
import pandas as pd

class ViolationRepository:

    def __init__(self):
        self.oracle_connection = OracleConnection().get_connection()


    def get_by_date(self, date, checkpoint_id):
        sql_command = '''
            SELECT DIRECTION, TIME_RANGE_ID, CREATED_DATE, CAR_TYPE_ID, VOLUME FROM BMA_PHASE_II.VIOLATION_RECORDS
            WHERE CREATED_DATE = TO_DATE('{}', 'YYYY-MM-DD')
                AND CHECKPOINT_ID = {}
        '''.format(date, checkpoint_id)

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command)
        data = cursor.fetchall()
        columns = [row[0] for row in cursor.description]

        df = pd.DataFrame(data=data, columns=columns)
        df = df.rename(columns={
            "DIRECTION": "direction",
            "TIME_RANGE_ID": "time_range_id",
            "CREATED_DATE": "date",
            "CAR_TYPE_ID": "car_type_id",
            "VOLUME": "volume"
        })

        data = df.to_dict('records')

        return data
    
    def get_volume_by_date(self, date, checkpoint_id):
        sql_command = '''
            SELECT DIRECTION, TIME_RANGE_ID, CREATED_DATE,CAR_TYPE_ID, SUM(VOLUME) AS VOLUME FROM BMA_PHASE_II.RECORDS 
            WHERE CREATED_DATE = TO_DATE('{}', 'YYYY-MM-DD')
                AND CHECKPOINT_ID = {}
            GROUP BY DIRECTION, CAR_TYPE_ID ,TIME_RANGE_ID, CREATED_DATE
            ORDER BY DIRECTION, CAR_TYPE_ID,TIME_RANGE_ID, CREATED_DATE
        '''.format(date,
            checkpoint_id
        )

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command)
        data = cursor.fetchall()
        columns = [row[0] for row in cursor.description]

        df = pd.DataFrame(data=data, columns=columns)
        df = df.rename(columns={
            "DIRECTION": "direction",
            "TIME_RANGE_ID": "time_range_id",
            "CREATED_DATE": "date",
            "CAR_TYPE_ID": "car_type_id",
            "VOLUME": "volume"
        })

        data = df.to_dict('records')


        return data