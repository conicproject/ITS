# backend/app/src/schemas/blacklist.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class BlacklistCreate(BaseModel):
    department_id:   Optional[int] = None
    license_plate:   str
    plate_province:  Optional[str] = None
    color:           Optional[str] = None
    type:            Optional[str] = None
    special_type_id: Optional[int] = None
    note:            Optional[str] = ""

class BlacklistResponse(BaseModel):
    id:      int
    message: str

class CheckBlacklistRequest(BaseModel):
    minutes: int = 5