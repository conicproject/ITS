# backend/app/src/models/user.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Request model สำหรับสร้าง user
class CreateUserRequest(BaseModel):
    user_name: str
    user_password: str

# Response model สำหรับ user
class User(BaseModel):
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    user_create_at: Optional[datetime] = None

class UserResponse(BaseModel):
    users: List[User]
    total_count: int
    source: str
    error: Optional[str] = None

class SingleUserResponse(BaseModel):
    user: Optional[User]
    source: str
    error: Optional[str] = None
