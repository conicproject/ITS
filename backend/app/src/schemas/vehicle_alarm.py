# backend/app/src/schemas/vehicle_alarm.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VehicleAlarmQuery(BaseModel):
    plate_no:   Optional[str]      = None
    alarm_type: Optional[str]      = None
    crossing_id: Optional[int]     = None
    start_date: Optional[datetime] = None
    end_date:   Optional[datetime] = None
    limit:      Optional[int]      = 50
    offset:     Optional[int]      = 0