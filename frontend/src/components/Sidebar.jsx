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
  const [expandedMenus, setExpandedMenus] = useState({});

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

  const toggleMenu = (nodeId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const renderMenu = (nodes, isSubmenu = false) => (
    <ul style={{ listStyle: "none", paddingLeft: isSubmenu ? 24 : 12, paddingRight: 12, margin: 0 }}>
      {nodes.map((node) => {
        const isActive = window.location.pathname === node.path;
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedMenus[node.id];
        
        return (
          <li key={node.id} style={{ margin: isSubmenu ? "4px 0" : "8px 0" }}>
            {node.path && !hasChildren ? (
              <Link
                to={node.path}
                style={{
                  color: isActive ? "#fff" : "#9CA3AF",
                  backgroundColor: isActive ? "#02754B" : "transparent",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: isSubmenu ? "6px 12px" : "10px 12px",
                  borderRadius: "6px",
                  fontSize: isSubmenu ? "0.9rem" : "1rem",
                  fontWeight: isActive ? "600" : "500",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap"
                }}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                {!isSubmenu && (
                  <span style={{ fontSize: "1.2rem", opacity: 0.7 }}>
                    {node.icon || "📋"}
                  </span>
                )}
                {node.label}
              </Link>
            ) : (
              <div
                style={{
                  color: "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  padding: "10px 12px",
                  fontSize: isSubmenu ? "0.9rem" : "1rem",
                  fontWeight: "500",
                  cursor: hasChildren ? "pointer" : "default",
                  borderRadius: "6px",
                  transition: "all 0.2s ease"
                }}
                onClick={() => hasChildren && toggleMenu(node.id)}
                onMouseEnter={(e) => hasChildren && (e.currentTarget.style.backgroundColor = "#E5E7EB")}
                onMouseLeave={(e) => hasChildren && (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {!isSubmenu && (
                    <span style={{ fontSize: "1.2rem", opacity: 0.7 }}>
                      {node.icon || "📋"}
                    </span>
                  )}
                  {node.label}
                </div>
                {hasChildren && (
                  <span style={{ 
                    fontSize: "0.8rem", 
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease"
                  }}>
                    ▼
                  </span>
                )}
              </div>
            )}
            {hasChildren && isExpanded && renderMenu(node.children, true)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      style={{
        width: showSidebar ? 250 : 0,
        height: "100vh",
        background: "#F5F6FA",
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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
          <div className="w-15 h-11 rounded flex items-center justify-center align-center" style={{ background: "green" }}>
            <span className="text-white-600 font-bold text-3xl" style={{marginTop: "-0.25rem"}}>★</span>
          </div>
          <div style={{
            fontSize: "2.5rem", color: "#02754B", fontWeight: "bold",
          }}>LOGO</div>
        </div>
      </div>

      <div style={{
        overflowY: "auto",
        flex: 1,
        opacity: showSidebar ? 1 : 0,
        transition: "opacity 0.3s ease-in-out 0.1s",
      }}>
        {loaded && renderMenu(menus, false)}
      </div>
    </aside>
  );
}

export default Sidebar;