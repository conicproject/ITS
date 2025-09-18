# backend/app/src/models/user.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CreateUserRequest(BaseModel):
    user_name: str
    user_password: str

class User(BaseModel):
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    user_create_at: Optional[datetime] = None

class UserResponse(BaseModel):
    users: List[User]
    total: int

class SingleUserResponse(BaseModel):
    user: User