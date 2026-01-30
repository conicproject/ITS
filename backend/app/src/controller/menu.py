# backend/app/src/controller/menu.py
from fastapi import HTTPException, Depends
from src.services.menu import MenuService
from src.controller.auth import AuthController

auth_controller = AuthController()

class MenuController:
    def __init__(self):
        self.menu_service = MenuService()

    def get_menus(self, user=Depends(auth_controller.get_current_user)):
        try:
            project_id = user.get("project_id")
            if project_id is None:
                raise HTTPException(
                    status_code=401,
                    detail="Project not found in token"
                )

            return self.menu_service.get_menu_tree(project_id)

        except HTTPException:
            raise
        except Exception as e:
            print("Get menus error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")
