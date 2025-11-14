import pandas as pd
from src.connection.oracle import OracleConnection

class OracleCheckpointRepository:
    def __init__(self):
        self.oracle_connection = OracleConnection().get_connection()
        self.not_found_msg = 'checkpoint not found'

    def get_by_id(self, id: str):
        sql_command = f"""
            SELECT CHECKPOINT_ID, CHECKPOINT_NAMETH, CHECKPOINT_NICKNAME
            FROM CHECKPOINT c 
            WHERE CHECKPOINT_CODE IS NOT NULL
                AND PROJECT_ID = 2
                AND AREA_CODE IS NOT NULL
                AND CHECKPOINT_ID = '{id}'
        """

        try:
            cursor = self.oracle_connection.cursor()
            cursor.execute(sql_command)
            data = cursor.fetchall()

            if not data:
                return None

            columns = [col[0] for col in cursor.description]
            df = pd.DataFrame(data, columns=columns)
            df = df.rename(columns={
                'CHECKPOINT_ID': 'id',
                'CHECKPOINT_NAMETH': 'name',
                'CHECKPOINT_NICKNAME': 'short_name'
            })

            return df.to_dict('records')[0]

        except Exception as e:
            print(f"❌ Error in get_by_id: {e}")
            return None
        finally:
            cursor.close()
