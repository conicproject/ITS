# backend/app/src/api/route.py
from fastapi import APIRouter, Depends
from src.controller.user import UserController
from src.controller.auth import AuthController
from src.controller.oracle import OracleController
from src.controller.menu import MenuController

router = APIRouter()
user_controller = UserController()
auth_controller = AuthController()
oracle_controller = OracleController()
menu_controller = MenuController()

# Auth endpoints
router.add_api_route("/auth/login", auth_controller.login, methods=["POST"], tags=["Authentication"])

# User endpoints - protected
router.add_api_route("/users", user_controller.create_user, methods=["POST"], tags=["Users"], dependencies=[Depends(auth_controller.get_current_user)])
router.add_api_route("/users", user_controller.get_all_users, methods=["GET"], tags=["Users"], dependencies=[Depends(auth_controller.get_current_user)])
router.add_api_route("/users/{user_id}", user_controller.get_user_by_id, methods=["GET"], tags=["Users"], dependencies=[Depends(auth_controller.get_current_user)])

# Oracle endpoints - protected
router.add_api_route("/traffic_pass_yesterday", oracle_controller.get_traffic_pass_yesterday, methods=["GET"], tags=["Traffic"], dependencies=[Depends(auth_controller.get_current_user)])
router.add_api_route("/traffic_truck_pass_yesterday", oracle_controller.get_traffic_truck_pass_yesterday, methods=["GET"], tags=["Traffic"], dependencies=[Depends(auth_controller.get_current_user)])

# Menu endpoint - protected
router.add_api_route("/menus", menu_controller.get_menus, methods=["GET"], tags=["Menu"], dependencies=[Depends(auth_controller.get_current_user)]
)