# backend/app/src/controller/menu.py
from fastapi import HTTPException, Depends
from src.services.menu import MenuService
from src.controller.auth import AuthController

auth_controller = AuthController()

class MenuController:
    def __init__(self):
        self.menu_service = MenuService()

    def get_menus(self):
        try:
            return self.menu_service.get_menu_tree()
        except Exception as e:
            print("Get menus error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")
