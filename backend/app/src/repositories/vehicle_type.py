# backend/app/src/repositories/vehicle_type.py
from src.connection.postgres import PostgresConnection

class VehicleTypeRepository:
    def __init__(self):
        self.conn = PostgresConnection()

    def get_vehicle_type(self):
        """Return all vehicle types ordered by type_id"""
        try:
            with self.conn.get_connection() as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT type_id, type_name, type_nameth, pcu
                        FROM public.vehicle_type
                        ORDER BY type_id ASC
                        """
                    )
                    rows = cursor.fetchall()

                    return [
                        {
                            "typeId": r[0],
                            "typeName": r[1],
                            "typeNameTh": r[2],
                            "pcu": float(r[3]) if r[3] is not None else None,
                        }
                        for r in rows
                    ]

        except Exception as e:
            print("❌ ERROR get_vehicle_type:", e)
            raise Exception(str(e))