# backend/app/src/api/route.py
from fastapi import APIRouter, Depends
from src.controller.user import UserController
from src.controller.auth import AuthController
from src.controller.oracle import OracleController
from src.controller.menu import MenuController
from src.controller.camera import CameraController
from src.controller.vehicle import VehicleController
from src.controller.data_vehicle import DataVehicleController
from src.controller.open_api import OpenAPIController
from src.controller.checkpoint import CheckpointController
from src.controller.blacklist import BlacklistController
from src.controller.vehicle_alarm import VehicleAlarmController
from src.controller.vehicle_type import VehicleTypeController
from src.controller.image_proxy import ImageProxyController
from src.controller.camera_stream_proxy import CameraStreamProxyController

router = APIRouter()
user_controller = UserController()
auth_controller = AuthController()
oracle_controller = OracleController()
menu_controller = MenuController()
camera_controller = CameraController()
vehicle_controller = VehicleController()
data_vehicle_controller = DataVehicleController()
open_api_controller = OpenAPIController()
checkpoint_controller = CheckpointController()
blacklist_controller = BlacklistController()
vehicle_alarm_controller = VehicleAlarmController()
vehicle_type_controller = VehicleTypeController()
image_proxy_controller = ImageProxyController()
camera_stream_proxy_controller = CameraStreamProxyController()

# Auth endpoints
router.add_api_route("/get_auth", open_api_controller.get_auth, methods=["GET"], tags=["Data"])   
router.add_api_route("/auth/login", auth_controller.login, methods=["POST"], tags=["Authentication"])

# User endpoints - protected
router.add_api_route("/users", user_controller.create_user, methods=["POST"], tags=["Users"],)
router.add_api_route("/users", user_controller.get_all_users, methods=["GET"], tags=["Users"], dependencies=[Depends(auth_controller.get_current_user)])
router.add_api_route("/users/{user_id}", user_controller.get_user_by_id, methods=["GET"], tags=["Users"], dependencies=[Depends(auth_controller.get_current_user)])

# Oracle endpoints - protected
router.add_api_route("/traffic_pass_yesterday", oracle_controller.get_traffic_pass_yesterday, methods=["GET"], tags=["Traffic"], dependencies=[Depends(auth_controller.get_current_user)])
router.add_api_route("/traffic_truck_pass_yesterday", oracle_controller.get_traffic_truck_pass_yesterday, methods=["GET"], tags=["Traffic"], dependencies=[Depends(auth_controller.get_current_user)])

# Menu endpoint - protected
router.add_api_route("/menus", menu_controller.get_menus, methods=["GET"], tags=["Menu"], dependencies=[Depends(auth_controller.get_current_user)])

router.add_api_route("/camera-status", camera_controller.get_camera, methods=["GET"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])
router.add_api_route("/traffic-detail/{record_type}",  vehicle_controller.get_traffic_detail, methods=["GET"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])

# api data_vehicle
# router.add_api_route("/data_vehicle", data_vehicle_controller.get_data_vehicle, methods=["GET"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])
# router.add_api_route("/get_data_yesterday", open_api_controller.get_data_yesterday, methods=["GET"], tags=["Data"])   
router.add_api_route("/record_5m", data_vehicle_controller.record_5m, methods=["GET"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])
router.add_api_route("/data_search_vehicle", data_vehicle_controller.data_search_vehicle, methods=["POST"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])
router.add_api_route("/vehicle_type", vehicle_type_controller.get_vehicle_type, methods=["GET"], tags=["Data"])

# api checkpoint
router.add_api_route("/checkpoint", checkpoint_controller.get_checkpoint, methods=["GET"], tags=["Data"])

# api blacklist
router.add_api_route("/get_blacklist", blacklist_controller.get_blacklist, methods=["GET"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])
router.add_api_route("/data_search_blacklist", blacklist_controller.search_blacklist, methods=["POST"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])
router.add_api_route("/insert_blacklist", blacklist_controller.insert_blacklist, methods=["POST"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])
router.add_api_route("/delete_blacklist/{blacklist_id}", blacklist_controller.delete_blacklist, methods=["DELETE"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])

# api check_blacklist
router.add_api_route("/check_blacklist_5m", blacklist_controller.check_blacklist_5m, methods=["POST"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])

# api get vehicle_alarm
router.add_api_route("/get_vehicle_alarm", vehicle_alarm_controller.get_vehicle_alarm, methods=["POST"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])

#get data vehicle
router.add_api_route("/get_data_collection_dashboard", vehicle_controller.get_data_collection_dashboard, methods=["POST"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])
router.add_api_route("/service_vehicle_5m", vehicle_controller.service_vehicle_5m, methods=["POST"], tags=["Data"], dependencies=[Depends(auth_controller.get_current_user)])

# api image proxy - ดึงรูปจากกล้อง (private IP) มา serve ผ่าน backend เอง
router.add_api_route("/image-proxy", image_proxy_controller.get_image_proxy, methods=["GET"], tags=["Data"])


# api stream - proxy ไปยัง go2rtc (private IP ในวง LAN) ผ่าน backend domain public
# ทำให้เข้าดูวิดีโอได้ทั้งจากใน LAN และนอก LAN โดยไม่ต้องเปิดพอร์ต 1984 ออก internet
router.add_api_route("/camera-stream/{path:path}", camera_stream_proxy_controller.proxy_http, methods=["GET", "POST", "HEAD"], tags=["Data"])
router.add_api_websocket_route("/camera-stream/{path:path}", camera_stream_proxy_controller.proxy_websocket)