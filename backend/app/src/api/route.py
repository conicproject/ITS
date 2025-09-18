# backend/app/src/api/route.py
from fastapi import APIRouter
from src.controller.user import UserController
from src.controller.auth import AuthController

router = APIRouter()
user_controller = UserController()
auth_controller = AuthController()

# Auth endpoints
router.add_api_route("/user-login", auth_controller.user_login, methods=["POST"])
router.add_api_route("/auth-verify-token", auth_controller.auth_verify_token, methods=["POST"])

# User endpoints
router.add_api_route("/insert-user", user_controller.insert_user, methods=["POST"])
router.add_api_route("/get-all-user", user_controller.get_all_user, methods=["GET"])
router.add_api_route("/get-user-by-id/{user_id}", user_controller.get_user_by_id, methods=["GET"])
