// src/utils/menuAccess.js
// Utility สำหรับตรวจสอบสิทธิ์การเข้าถึงเมนู

/**
 * ดึงรายการ path ทั้งหมดที่ user มีสิทธิ์เข้าถึง
 */
export const getAllowedPaths = (menus) => {
  const allowedPaths = new Set();
  
  const extractPaths = (menuList) => {
    menuList.forEach(menu => {
      if (menu.path) {
        allowedPaths.add(menu.path);
      }
      if (menu.children && menu.children.length > 0) {
        extractPaths(menu.children);
      }
    });
  };
  
  extractPaths(menus);
  return allowedPaths;
};

/**
 * ตรวจสอบว่า path ที่ระบุอยู่ในรายการที่อนุญาตหรือไม่
 */
export const isPathAllowed = (path, allowedPaths) => {
  return allowedPaths.has(path);
};

/**
 * เก็บข้อมูลเมนูใน localStorage
 */
export const saveMenusToStorage = (menus) => {
  localStorage.setItem('userMenus', JSON.stringify(menus));
};

/**
 * ดึงข้อมูลเมนูจาก localStorage
 */
export const getMenusFromStorage = () => {
  const menus = localStorage.getItem('userMenus');
  return menus ? JSON.parse(menus) : [];
};

/**
 * ลบข้อมูลเมนูจาก localStorage
 */
export const clearMenusFromStorage = () => {
  localStorage.removeItem('userMenus');
};