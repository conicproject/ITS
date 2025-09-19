import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DefaultLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarLocked, setSidebarLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarHover, setSidebarHover] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop hover for sidebar
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
    if (isMobile) {
      setSidebarOpen((prev) => !prev); // mobile toggle
    } else {
      setSidebarLocked((prev) => !prev); // desktop lock
    }
  };

  // กำหนด style ของ content สำหรับ desktop
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
        overlayMode={isMobile} // overlay เฉพาะ mobile
      />

      {/* Overlay สำหรับมือถือ */}
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
