// frontend/src/components/Sidebar.jsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import apiClient from "../../service/client";
import {
  BiChevronDown,
  BiGridAlt,
  BiServer,
  BiShieldAlt2,
  BiCar,
  BiError,
  BiSolidCube,
} from "react-icons/bi";

const ICON_MAP_BY_ID = {
  1: BiGridAlt,
  2: BiServer,
  3: BiShieldAlt2,
  4: BiCar,
  5: BiError,
};

const getMenuIcon = (node) => ICON_MAP_BY_ID[node.id] || BiSolidCube;

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
  const location = useLocation();

  // Fetch menus from backend
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

  // Auto-expand sidebar on initial load (desktop only)
  useEffect(() => {
    if (loaded && isInitialLoad && !isMobile) {
      setSidebarOpen(true);
      setIsInitialLoad(false);
    }
  }, [loaded, isInitialLoad, isMobile, setSidebarOpen]);

  // Auto-expand menu path based on current location
  useEffect(() => {
    if (!loaded || !menus.length) return;

    const findPathToExpand = (nodes, targetPath, ancestors = []) => {
      for (const node of nodes) {
        const currentPath = [...ancestors, node.id];
        if (
          node.path === targetPath ||
          (node.path && targetPath.startsWith(node.path + "/"))
        ) {
          return currentPath;
        }
        if (node.children?.length) {
          const found = findPathToExpand(node.children, targetPath, currentPath);
          if (found) return found;
        }
      }
      return null;
    };

    const pathToExpand = findPathToExpand(menus, location.pathname);
    if (pathToExpand) {
      setExpandedMenus((prev) => ({
        ...prev,
        ...Object.fromEntries(pathToExpand.map((id) => [id, true])),
      }));
    }
  }, [location.pathname, menus, loaded]);

  // Find the closest (most specific) matching path
  const closestMatchPath = useMemo(() => {
    const findClosestMatch = (nodes, targetPath) => {
      let closest = null;
      let maxDepth = -1;

      const search = (nodes, depth = 0) => {
        for (const node of nodes) {
          if (
            node.path &&
            (targetPath === node.path || targetPath.startsWith(node.path + "/"))
          ) {
            if (depth > maxDepth) {
              maxDepth = depth;
              closest = node.path;
            }
          }
          if (node.children?.length) {
            search(node.children, depth + 1);
          }
        }
      };

      search(nodes);
      return closest;
    };

    return findClosestMatch(menus, location.pathname);
  }, [menus, location.pathname]);

  // Pre-compute which nodes have active descendants
  const nodesWithActiveDescendants = useMemo(() => {
    const activeSet = new Set();

    const checkDescendants = (node) => {
      if (node.path === closestMatchPath) {
        activeSet.add(node.id);
        return true;
      }
      if (node.children?.length) {
        const hasActive = node.children.some((child) => checkDescendants(child));
        if (hasActive) {
          activeSet.add(node.id);
          return true;
        }
      }
      return false;
    };

    const traverse = (nodes) => {
      nodes.forEach((node) => checkDescendants(node));
    };

    traverse(menus);
    return activeSet;
  }, [menus, closestMatchPath]);

  const toggleMenu = useCallback((nodeId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  }, []);

  const showSidebar = (sidebarLocked || sidebarOpen) && loaded;

  const renderMenuItem = useCallback(
    (node, level) => {
      const isActive = node.path === closestMatchPath;
      const hasChildren = node.children?.length > 0;
      const isExpanded = expandedMenus[node.id];
      const isSubmenu = level > 0;
      const hasActiveDescendant = nodesWithActiveDescendants.has(node.id);

      const baseStyle = {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: isSubmenu ? "6px 12px" : "10px 12px",
        borderRadius: "6px",
        fontSize: isSubmenu ? "0.875rem" : "0.95rem",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      };

      // Leaf node with path -> rendered as a small dot + label
      if (node.path && !hasChildren) {
        return (
          <Link
            to={node.path}
            style={{
              ...baseStyle,
              color: isActive ? "rgb(56, 189, 248)" : "#9CA3AF",
              backgroundColor: isActive ? "rgba(56, 189, 248, 0.12)" : "transparent",
              textDecoration: "none",
              fontWeight: isActive ? "600" : "500",
            }}
            onMouseEnter={(e) =>
              !isActive && (e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.08)")
            }
            onMouseLeave={(e) =>
              !isActive && (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: isActive ? "rgb(56, 189, 248)" : "#6B7280",
                flexShrink: 0,
              }}
            />
            <span>{node.label}</span>
          </Link>
        );
      }

      // Parent node with children -> icon + left accent bar
      if (hasChildren) {
        const Icon = getMenuIcon(node);
        return (
          <div>
            <div
              style={{
                ...baseStyle,
                position: "relative",
                justifyContent: "space-between",
                paddingLeft: "18px",
                color: hasActiveDescendant ? "#fff" : "#E5E7EB",
                fontWeight: hasActiveDescendant ? "600" : "500",
                cursor: "pointer",
                backgroundColor: hasActiveDescendant ? "rgba(255, 255, 255, 0.09)" : "transparent",
              }}
              onClick={() => toggleMenu(node.id)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)")
              }
              onMouseLeave={(e) => {
                if (!hasActiveDescendant) {
                  e.currentTarget.style.backgroundColor = "transparent";
                } else {
                  e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
                }
              }}
            >
              {/* Left accent bar */}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "4px",
                  height: "60%",
                  borderRadius: "4px",
                  backgroundColor: "rgb(56, 189, 248)",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Icon style={{ fontSize: "1.15rem", color: "rgb(125, 211, 252)" }} />
                <span>{node.label}</span>
              </div>
              <BiChevronDown
                style={{
                  fontSize: "1.1rem",
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  color: "#9CA3AF",
                }}
              />
            </div>
            {isExpanded && (
              <div style={{ marginTop: "4px" }}>
                {renderMenu(node.children, level + 1)}
              </div>
            )}
          </div>
        );
      }

      return null;
    },
    [closestMatchPath, expandedMenus, nodesWithActiveDescendants, isMobile, setSidebarOpen, toggleMenu]
  );

  const renderMenu = useCallback(
    (nodes, level = 0) => {
      const paddingLeft = 12 + level * 16;
      return (
        <ul style={{ listStyle: "none", paddingLeft, paddingRight: 12, margin: 0 }}>
          {nodes.map((node) => (
            <li key={node.id} style={{ margin: level > 0 ? "4px 0" : "8px 0" }}>
              {renderMenuItem(node, level)}
            </li>
          ))}
        </ul>
      );
    },
    [renderMenuItem]
  );

  return (
    <>
      <style>
        {`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <aside
        style={{
          width: showSidebar ? 270 : 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          top: 0,
          left: 0,
          zIndex: 50,
          transition: "width 0.3s ease-in-out",
          overflow: "hidden",
          borderRight: "1px solid rgba(255, 255, 255, 0.07)",
          background: "linear-gradient(rgba(10, 17, 35, 0.85), rgba(8, 13, 28, 0.92))",
          backdropFilter: "blur(150px)",
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            margin: "1.25rem 0",
            textAlign: "center",
            opacity: showSidebar ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
            {/* Icon */}
            <div
              style={{
                background: "linear-gradient(135deg, #7C93F5 0%, #4F6DE0 50%, #3B5BDB 100%)",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 10px rgba(59, 91, 219, 0.35)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 18L9 8L13 15L16 10L20 18"
                  stroke="#fff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Text */}
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "1.15rem", fontWeight: "800", lineHeight: 1.1 }}>
                <span style={{ color: "#fff" }}>ITS</span>{" "}
                <span style={{ color: "rgb(56, 189, 248)" }}>Command</span>
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "#9CA3AF",
                  fontWeight: "600",
                  marginTop: "2px",
                  display: "flex",
                  gap: "2px",
                }}
              >
                <span>SMART TRAFFIC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            opacity: showSidebar ? 1 : 0,
            transition: "opacity 0.3s ease-in-out 0.1s",
            borderTop: "1px solid rgba(255, 255, 255, 0.07)",
          }}
        >
          {loaded && renderMenu(menus)}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;