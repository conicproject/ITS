import { Link } from "react-router-dom";

function Sidebar({
  sidebarOpen,
  sidebarLocked,
  isMobile,
  setSidebarOpen,
  overlayMode,
}) {
  const showSidebar = sidebarLocked || sidebarOpen;
  const width = showSidebar ? "200px" : "0";

  return (
    <aside
      style={{
        width: showSidebar ? "200px" : "0",
        overflow: "hidden",
        transition: "width 0.3s",
        position: overlayMode ? "fixed" : "relative",
        top: overlayMode ? 0 : 0,
        left: 0,
        height: "100vh",
        zIndex: overlayMode ? 50 : "auto",
        background: "#24292f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ margin: "1rem", fontSize: "1.5rem", fontWeight: "bold" }}>
        {showSidebar ? "My App" : "MA"}
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "1rem" }}>
          <Link
            to="/"
            style={{ color: "#fff", textDecoration: "none" }}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            {showSidebar ? "Home" : "H"}
          </Link>
        </li>
        <li>
          <Link
            to="/create-user"
            style={{ color: "#fff", textDecoration: "none" }}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            {showSidebar ? "Create User" : "CU"}
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
