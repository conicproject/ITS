import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../service/client";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarLocked,
  isMobile,
  overlayMode,
}) {
  const [menus, setMenus] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // fetch menu จาก backend
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await apiClient.get("/api/menus");
        setMenus(res.data);
        setLoaded(true);
      } catch (err) {
        console.error("Failed to fetch menus", err);
      }
    };
    fetchMenus();
  }, []);

  // เปิด sidebar เมื่อโหลดครั้งแรกเสร็จ (ถ้าไม่ใช่ mobile)
  useEffect(() => {
    if (loaded && isInitialLoad && !isMobile) {
      setSidebarOpen(true);
      setIsInitialLoad(false);
    }
  }, [loaded, isInitialLoad, isMobile, setSidebarOpen]);

  // showSidebar: แสดงเมื่อ locked หรือ open
  const showSidebar = (sidebarLocked || sidebarOpen) && loaded;

  const renderMenu = (nodes) => (
    <ul style={{ listStyle: "none", paddingLeft: 12, margin: 0 }}>
      {nodes.map((node) => (
        <li key={node.id} style={{ margin: "6px 0" }}>
          {node.path ? (
            <Link
              to={node.path}
              style={{ color: "#fff", textDecoration: "none", display: "block", whiteSpace: "nowrap" }}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              {node.label}
            </Link>
          ) : (
            <span style={{ color: "#fff", display: "block" }}>{node.label}</span>
          )}
          {node.children && node.children.length > 0 && renderMenu(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      style={{
        width: showSidebar ? 200 : 0,
        height: "100vh",
        background: "#24292f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        position: overlayMode ? "fixed" : "relative",
        top: 0,
        left: 0,
        zIndex: overlayMode ? 50 : 10,
        transition: "width 0.3s ease-in-out",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          margin: "1rem 0",
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          opacity: showSidebar ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          whiteSpace: "nowrap",
        }}
      >
        ITS
      </div>

      <div style={{ 
        overflowY: "auto", 
        flex: 1,
        opacity: showSidebar ? 1 : 0,
        transition: "opacity 0.3s ease-in-out 0.1s",
      }}>
        {loaded && renderMenu(menus)}
      </div>
    </aside>
  );
}

export default Sidebar;