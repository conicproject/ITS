import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClock } from "@fortawesome/free-solid-svg-icons";

// decode JWT payload โดยไม่ต้องพึ่ง library เพิ่ม
function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function Navbar({ onHamburgerClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRoute = routes.find((route) => route.path === location.pathname);
  const title = currentRoute ? currentRoute.name : "My App";
  const [timeLeft, setTimeLeft] = useState(null); // วินาทีที่เหลือ

  // นับถอยหลังจาก exp ใน token, อ่าน token ใหม่ทุกครั้งเผื่อถูก refresh (sliding session)
  useEffect(() => {
    const tick = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setTimeLeft(null);
        return;
      }
      const payload = decodeToken(token);
      if (!payload?.exp) {
        setTimeLeft(null);
        return;
      }
      const remaining = payload.exp - Math.floor(Date.now() / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
    };

    tick(); // เช็คทันทีตอน mount
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLowTime = timeLeft !== null && timeLeft <= 300; // เหลือน้อยกว่า 5 นาที

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleHamburgerClick = () => {
    console.log("Hamburger clicked!");
    if (onHamburgerClick) {
      onHamburgerClick();
    } else {
      console.warn("onHamburgerClick is not defined");
    }
  };

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
          color: #fff;
          position: relative;
          background: rgba(9, 16, 34, 0.55);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .navbar-hamburger {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          color: #fff;
          position: relative;
          z-index: 200;
          outline: unset !important;
          padding: 0;
        }

        .navbar-hamburger:focus-visible {
          outline: unset;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .navbar-timer {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.08);
          color: #9CA3AF;
          font-variant-numeric: tabular-nums;
        }

        .navbar-timer.low {
          color: #f87171;
          background: rgba(248, 113, 113, 0.12);
        }

        .navbar-user {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .navbar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
      `}</style>

      <nav className="navbar">
        <button
          className="navbar-hamburger"
          onClick={handleHamburgerClick}
          aria-label="Menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* <h3 className="navbar-title">{title}</h3> */}

        <div className="navbar-right">
          <div className={`navbar-timer ${isLowTime ? "low" : ""}`}>
            <FontAwesomeIcon icon={faClock} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <div className="navbar-user" onClick={handleLogout}>
            <img
              src="/assets/avatar.jpg"
              alt="User Avatar"
              className="navbar-avatar"
            />
            <p>LOGOUT</p>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;