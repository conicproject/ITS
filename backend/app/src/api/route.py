# backend/app/src/api/route.py
from fastapi import APIRouter
from src.controller.user import UserController
from src.controller.auth import AuthController

router = APIRouter()
user_controller = UserController()
auth_controller = AuthController()

# Auth endpoints
router.add_api_route("/auth/login", auth_controller.login, methods=["POST"], tags=["Authentication"])
router.add_api_route("/auth/verify-token", auth_controller.verify_token, methods=["POST"], tags=["Authentication"])

# User endpoints - รองรับทั้ง RESTful และ endpoint เดิม
router.add_api_route("/users", user_controller.create_user, methods=["POST"], tags=["Users"])
router.add_api_route("/users", user_controller.get_all_users, methods=["GET"], tags=["Users"])
router.add_api_route("/users/{user_id}", user_controller.get_user_by_id, methods=["GET"], tags=["Users"])
