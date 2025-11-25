// frontend/src/components/Sidebar.jsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiSolidCube } from "react-icons/bi";

import apiClient from "../../service/client";

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
        
        if (node.path === targetPath || 
            (node.path && targetPath.startsWith(node.path + '/'))) {
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
      setExpandedMenus(prev => ({
        ...prev,
        ...Object.fromEntries(pathToExpand.map(id => [id, true]))
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
          if (node.path && 
              (targetPath === node.path || targetPath.startsWith(node.path + '/'))) {
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
        const hasActive = node.children.some(child => checkDescendants(child));
        if (hasActive) {
          activeSet.add(node.id);
          return true;
        }
      }
      
      return false;
    };

    const traverse = (nodes) => {
      nodes.forEach(node => checkDescendants(node));
    };

    traverse(menus);
    return activeSet;
  }, [menus, closestMatchPath]);

  const toggleMenu = useCallback((nodeId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  }, []);

  const showSidebar = (sidebarLocked || sidebarOpen) && loaded;

  const renderMenuItem = useCallback((node, level) => {
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
      whiteSpace: "nowrap"
    };

    // Leaf node with path
    if (node.path && !hasChildren) {
      return (
        <Link
          to={node.path}
          style={{
            ...baseStyle,
            color: isActive ? "#fff" : "#374151",
            backgroundColor: isActive ? "#02754B" : "transparent",
            textDecoration: "none",
            fontWeight: isActive ? "600" : "500",
          }}
          onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = "#F3F4F6")}
          onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = "transparent")}
          onClick={() => isMobile && setSidebarOpen(false)}
        >
          <BiSolidCube />
          <span>{node.label}</span>
        </Link>
      );
    }

    // Parent node with children
    if (hasChildren) {
      return (
        <div>
          <div
            style={{
              ...baseStyle,
              justifyContent: "space-between",
              color: hasActiveDescendant ? "#02754B" : "#374151",
              fontWeight: hasActiveDescendant ? "600" : "500",
              cursor: "pointer",
              backgroundColor: "transparent",
            }}
            onClick={() => toggleMenu(node.id)}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <BiSolidCube />
              <span>{node.label}</span>
            </div>
            <span style={{ 
              fontSize: "0.7rem", 
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
              color: hasActiveDescendant ? "#02754B" : "#9CA3AF"
            }}>
              ▼
            </span>
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
  }, [closestMatchPath, expandedMenus, nodesWithActiveDescendants, isMobile, setSidebarOpen, toggleMenu]);

  const renderMenu = useCallback((nodes, level = 0) => {
    const paddingLeft = 12 + (level * 16);

    return (
      <ul style={{ 
        listStyle: "none", 
        paddingLeft, 
        paddingRight: 12, 
        margin: 0 
      }}>
        {nodes.map((node) => (
          <li key={node.id} style={{ margin: level > 0 ? "4px 0" : "8px 0" }}>
            {renderMenuItem(node, level)}
          </li>
        ))}
      </ul>
    );
  }, [renderMenuItem]);

  return (
    <>
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <aside
        style={{
          width: showSidebar ? 250 : 0,
          height: "100vh",
          background: "#F5F6FA",
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
        {/* Logo Section */}
        <div
          style={{
            margin: "1rem 0",
            textAlign: "center",
            opacity: showSidebar ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
            <div 
              style={{ 
                background: "#02754B", 
                width: "44px", 
                height: "44px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <span style={{ color: "#fff", fontSize: "1.5rem", marginTop: "-0.25rem" }}>★</span>
            </div>
            <div style={{ fontSize: "1.5rem", color: "#02754B", fontWeight: "bold" }}>
              LOGO
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div style={{
          overflowY: "auto",
          flex: 1,
          opacity: showSidebar ? 1 : 0,
          transition: "opacity 0.3s ease-in-out 0.1s",
        }}>
          {loaded && renderMenu(menus)}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;