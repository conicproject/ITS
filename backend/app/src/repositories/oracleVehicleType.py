import pandas as pd
from src.connection.oracle import OracleConnection

class OracleVehicleTypeRepository:

    def __init__(self):
        self.oracle_connection = OracleConnection().get_connection()

    def get_list_id(self):
        sql_command = """
            SELECT TYPE_ID FROM VEHICLE_TYPE
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command)
        data = cursor.fetchall()

        columes = [row[0] for row in cursor.description]
        df = pd.DataFrame(data=data, columns=columes)
        df = df.rename(columns={
            'TYPE_ID': 'id'
        })

        df['id'] = df['id'].astype(int)
        df = df.sort_values(by=['id'])
        result = df['id'].to_list()
        
        return result
    
    def get_list_name(self):
        sql_command = """
            SELECT TYPE_NAMETH FROM VEHICLE_TYPE
            ORDER BY LPAD(TYPE_ID, (SELECT MAX(LENGTH(TYPE_ID)) FROM VEHICLE_TYPE))
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command)
        data = cursor.fetchall()

        columes = [row[0] for row in cursor.description]
        df = pd.DataFrame(data=data, columns=columes)
        df = df.rename(columns={
            'TYPE_NAMETH': 'name'
        })

        result = df['name'].to_list()

        return result


    def get_list_active_name_pcu(self):
        sql_command = """
            SELECT TYPE_NAMETH, PCU FROM VEHICLE_TYPE
            WHERE TYPE_NAME IS NOT NULL
            GROUP BY TYPE_NAMETH, PCU
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command)
        data = cursor.fetchall()

        columes = [row[0] for row in cursor.description]
        df = pd.DataFrame(data=data, columns=columes)
        df = df.rename(columns={
            'TYPE_NAMETH': 'name',
            'PCU': 'pcu'
        })

        result = df.to_dict('records')

        return result
    
    def get_list_active_name(self):
        sql_command = """
            SELECT DISTINCT(TYPE_NAMETH) FROM VEHICLE_TYPE
            WHERE TYPE_NAME IS NOT NULL 
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command)
        data = cursor.fetchall()

        columes = [row[0] for row in cursor.description]
        df = pd.DataFrame(data=data, columns=columes)
        df = df.rename(columns={
            'TYPE_NAMETH': 'name'
        })

        result = df['name'].to_list()

        return result

    def list(self):
        sql_command = """
            SELECT TYPE_NAME, TYPE_NAMETH FROM VEHICLE_TYPE
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command)
        data = cursor.fetchall()

        columes = [row[0] for row in cursor.description]
        df = pd.DataFrame(data=data, columns=columes)
        df = df.rename(columns={
            'TYPE_NAME': 'value',
            'TYPE_NAMETH': 'name'
        })

        result = df.to_dict('records')

        return result

    def get_all_list_id(self):
        sql_command = """
            SELECT type_id FROM VEHICLE_TYPE
            ORDER BY LPAD(type_id, (SELECT MAX(LENGTH(type_id)) FROM VEHICLE_TYPE))
        """

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command)
        data = cursor.fetchall()
        list_id = [rec[0] for rec in data]

        return list_id

    def get_by_name(self, name):
        sql_command = """
            SELECT TYPE_ID, TYPE_NAMETH FROM VEHICLE_TYPE
            WHERE TYPE_NAME = '{}' 
        """.format(name)

        cursor = self.oracle_connection.cursor()
        cursor.execute(sql_command)
        data = cursor.fetchall()

        try:
            columes = [row[0] for row in cursor.description]
            df = pd.DataFrame(data=data, columns=columes)
            df = df.rename(columns={
                'TYPE_ID': 'id',
                'TYPE_NAMETH': 'name'
            })

            result = df.to_dict('records')
            result = result[0]

        except:
            result = {
                'id': "0",
                'name': "-",
            }

        return result
        