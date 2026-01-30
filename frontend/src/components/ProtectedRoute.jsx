// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import apiClient from '../service/client';
import { getAllowedPaths, saveMenusToStorage, getMenusFromStorage } from '../utils/menuAccess';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      try {
        // ตรวจสอบว่ามีเมนูใน localStorage หรือไม่
        let menus = getMenusFromStorage();
        
        // ถ้าไม่มี ให้ดึงจาก API
        if (!menus || menus.length === 0) {
          const { data } = await apiClient.get('/api/menus');
          menus = data;
          saveMenusToStorage(menus);
        }
        
        // สร้างรายการ path ที่อนุญาต
        const allowedPaths = getAllowedPaths(menus);
        
        // ตรวจสอบ path ปัจจุบัน
        const currentPath = location.pathname;
        
        // กรณีพิเศษสำหรับ /manageuser (เฉพาะ admin)
        if (currentPath === '/manageuser') {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          setIsAuthorized(user.role === 'admin');
        } 
        // กรณีพิเศษสำหรับหน้าย่อยของ function (ต้องตรวจสอบว่ามีสิทธิ์เข้า function หลักหรือไม่)
        else if (currentPath.includes('/function/')) {
          // ดึง base path เช่น /enforcement/function
          const basePath = currentPath.split('/').slice(0, 3).join('/');
          setIsAuthorized(allowedPaths.has(basePath) || allowedPaths.has(currentPath));
        }
        // กรณีทั่วไป
        else {
          setIsAuthorized(allowedPaths.has(currentPath));
        }
        
      } catch (error) {
        console.error('Error checking menu access:', error);
        // ถ้า API error ให้ redirect ไป login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userMenus');
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [location.pathname]);

  // แสดง loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // ถ้าไม่มีสิทธิ์ redirect ไป overview
  if (isAuthorized === false) {
    return <Navigate to="/overview" replace />;
  }

  return children;
}

export default ProtectedRoute;