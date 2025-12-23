# backend/app/src/schemas/time_range.py
from pydantic import BaseModel
from typing import List, Optional

class CreateTimeRangeRequest(BaseModel):
    start_time: str
    end_time: str

class TimeRange(BaseModel):
    id: Optional[int] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None

class TimeRangeResponse(BaseModel):
    time_ranges: List[TimeRange]
    total: int

class SingleTimeRangeResponse(BaseModel):
    time_range: TimeRange