# backend/app/src/services/user.py
from passlib.context import CryptContext
from src.repositories.user import UserRepository

class UserService:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.user_repository = UserRepository()

    def create_user(self, username: str, password: str):
        """Create new user with hashed password"""
        hashed_password = self.pwd_context.hash(password)
        return self.user_repository.insert_user(username, hashed_password)

    def get_all_users(self):
        """Get all users"""
        return self.user_repository.get_all_users()

    def get_user_by_id(self, user_id: int):
        """Get user by ID"""
        return self.user_repository.get_user_by_id(user_id)