# backend/app/src/models/oracle.py
from pydantic import BaseModel
from datetime import datetime
from typing import List

class Record(BaseModel):
    PASS_ID: str
    PLATE_PIC_URL: str
    IMAGE_PATH: str
    PLATE_NO: str
    LANE_NO: str
    PROVINCE_NAMETH: str
    CHECKPOINT_NICKNAME: str
    LATITUDE: float
    LONGTITUDE: float
    DISTRICT_NAME: str
    CAMERA_CODE: str
    ROAD_DIRECTION: str
    PASS_TIME: datetime
    TYPE_NAME: str
    COLOR_NAME: str

class TrafficResponse(BaseModel):
    records: List[Record]
    total: int
