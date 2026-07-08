// src/layouts/DefaultLayout.jsx
import {
  useState,
  useEffect,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/bar/Navbar";
import Sidebar from "../components/bar/Sidebar";

function DefaultLayout({ children }) {
  const navigate = useNavigate();

  // ================== CHECK TOKEN ==================
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          alert("Session หมดอายุ โปรด login ใหม่");
          navigate("/");
        }
      } catch (err) {
        console.error("JWT decode error:", err);
      }
    };

    const intervalId = setInterval(checkToken, 1000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: `
          radial-gradient(900px 600px at 12% -5%, rgba(56, 130, 246, 0.2), transparent 60%),
          radial-gradient(800px 600px at 88% 8%, rgba(124, 92, 255, 0.16), transparent 60%),
          radial-gradient(900px 700px at 70% 110%, rgba(34, 211, 238, 0.12), transparent 55%),
          linear-gradient(160deg, rgb(8, 17, 39) 0%, rgb(7, 13, 28) 55%, rgb(6, 10, 22) 100%)
        `,
      }}
    >
      <Sidebar
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        setSidebarOpen={setSidebarOpen}
      />

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 40,
          }}
        />
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0, // 🔥 สำคัญมาก (แก้ ApexCharts width=0)
        }}
      >
        <Navbar onHamburgerClick={toggleSidebar} />

        {Children.map(children, (child) =>
          isValidElement(child)
            ? cloneElement(child, { sidebarOpen })
            : child
        )}
      </div>
    </div>
  );
}

export default DefaultLayout;
