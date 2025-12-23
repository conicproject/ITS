import time
from src.repositories.data_vehicle import DataVehicleRepository

repo = DataVehicleRepository()

try:
    while True:
        repo.sync_to_postgres()
        time.sleep(30)  # ดึงทุก 30 วินาที
        print("✅ Synced data from Oracle to Postgres.")
except KeyboardInterrupt:
    print("⏹️ Stop by user")
