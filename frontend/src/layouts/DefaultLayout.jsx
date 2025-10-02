// src/layouts/DefaultLayout.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DefaultLayout({ children }) {
  const navigate = useNavigate();

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
  const [sidebarLocked, setSidebarLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarHover, setSidebarHover] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const handleMouseMove = (e) => {
        if (!sidebarLocked && e.clientX <= 10) {
          setSidebarHover(true);
        }
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isMobile, sidebarLocked]);

  const toggleSidebar = () => {
    console.log("Toggle sidebar clicked, current sidebarOpen:", sidebarOpen);
    setSidebarOpen((prev) => !prev);
  };

  const desktopContentStyle =
    !isMobile && sidebarLocked ? { transition: "margin-left 0.3s" } : {};

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        sidebarLocked={sidebarLocked}
        sidebarHover={sidebarHover}
        setSidebarHover={setSidebarHover}
        isMobile={isMobile}
        setSidebarOpen={setSidebarOpen}
        overlayMode={isMobile}
      />

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 10,
          }}
        />
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          ...desktopContentStyle,
          position: "relative",
          zIndex: 0,
        }}
      >
        <Navbar onHamburgerClick={toggleSidebar} />
        <main style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default DefaultLayout;