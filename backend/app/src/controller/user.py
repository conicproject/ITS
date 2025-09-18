# backend/app/src/controller/user.py
from fastapi import HTTPException, Depends
from src.repositories import user as user_repo
from src.models.user import UserResponse, SingleUserResponse
from fastapi import HTTPException
from passlib.context import CryptContext
from src.models.user import CreateUserRequest  

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserController:
    def insert_user(self, data: CreateUserRequest):
        username = data.user_name
        password = data.user_password
        hashed_password = pwd_context.hash(password)

        user = user_repo.insert_user(username, hashed_password)

        if user is None:
            raise HTTPException(status_code=400, detail="Username already exists")

        return {
            "user_id": user[0],
            "user_name": user[1],
            "user_create_at": user[2]
        }
    
    def get_all_user(self) -> UserResponse:
        return user_repo.get_all_user()
    
    def get_user_by_id(self, user_id: int) -> SingleUserResponse:
        return user_repo.get_user_by_id(user_id)