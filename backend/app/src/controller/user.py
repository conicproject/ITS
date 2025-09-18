# backend/app/src/controller/user.py
from fastapi import HTTPException
from src.services.user import UserService
from src.models.user import CreateUserRequest, UserResponse, SingleUserResponse

class UserController:
    def __init__(self):
        self.user_service = UserService()

    def create_user(self, data: CreateUserRequest):
        """Create new user"""
        try:
            user = self.user_service.create_user(data.user_name, data.user_password)
            if user is None:
                raise HTTPException(status_code=400, detail="Username already exists")

            return {
                "user_id": user[0],
                "user_name": user[1],
                "user_create_at": user[2]
            }
        except HTTPException:
            raise
        except Exception as e:
            print("Create user error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")
    
    def get_all_users(self) -> UserResponse:
        """Get all users"""
        try:
            return self.user_service.get_all_users()
        except Exception as e:
            print("Get all users error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")
    
    def get_user_by_id(self, user_id: int) -> SingleUserResponse:
        """Get user by ID"""
        try:
            user = self.user_service.get_user_by_id(user_id)
            if user is None:
                raise HTTPException(status_code=404, detail="User not found")
            return user
        except HTTPException:
            raise
        except Exception as e:
            print("Get user by ID error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")