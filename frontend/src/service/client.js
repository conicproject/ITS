import axios from "axios";

const apiClient = axios.create({
  headers: { "Content-Type": "application/json" },
});

// ⭐ 1. ใส่ Authorization header อัตโนมัติ
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ⭐ 2. Response interceptor: รับ token ใหม่ + auto logout เมื่อเจอ 401
apiClient.interceptors.response.use(
  (response) => {
    // 🔄 รับ token ใหม่จาก header (ถ้ามี)
    const newToken = response.headers['x-new-token'];
    if (newToken) {
      localStorage.setItem("token", newToken);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // เช็คว่าไม่ใช่หน้า login
      const isLoginPage = window.location.pathname === "/" || 
                          window.location.pathname === "/login";
      
      if (!isLoginPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;