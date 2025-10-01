# backend/app/src/services/menu.py
from src.repositories.menu import MenuRepository

class MenuService:
    def __init__(self):
        self.menu_repo = MenuRepository()

    def get_menu_tree(self):
        """Return menu as nested tree"""
        rows = self.menu_repo.get_all_menus()
        menu_map = {r['id']: {**r, "children": []} for r in rows}
        tree = []
        for r in rows:
            if r['parent_id']:
                menu_map[r['parent_id']]['children'].append(menu_map[r['id']])
            else:
                tree.append(menu_map[r['id']])
        return tree
