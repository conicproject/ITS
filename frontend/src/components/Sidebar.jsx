import { Link } from "react-router-dom";

function Sidebar({
  sidebarOpen,
  sidebarLocked,
  sidebarHover,
  setSidebarHover,
  isMobile,
  setSidebarOpen,
  overlayMode,
}) {
  const showSidebar = sidebarLocked || sidebarOpen || sidebarHover;
  const width = showSidebar ? "200px" : "0";

  return (
    <aside
      style={{
        width,
        overflow: "hidden",
        transition: "width 0.3s",
        position: overlayMode || sidebarHover ? "fixed" : "relative",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: overlayMode || sidebarHover ? 50 : 10,
        background: "#24292f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => !isMobile && !sidebarLocked && setSidebarHover(true)}
      onMouseLeave={() => !isMobile && !sidebarLocked && setSidebarHover(false)}
    >
      <div
        style={{
          margin: "1rem 0",
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        My App
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li style={{ marginBottom: "1rem" }}>
          <Link
            to="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              paddingLeft: "1rem",
              display: "block",
            }}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/create-user"
            style={{
              color: "#fff",
              textDecoration: "none",
              paddingLeft: "1rem",
              display: "block",
            }}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            Create User
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
