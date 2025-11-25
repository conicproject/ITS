import { useLocation, useNavigate } from "react-router-dom";
import routes from "../../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Navbar({ onHamburgerClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRoute = routes.find((route) => route.path === location.pathname);
  const title = currentRoute ? currentRoute.name : "My App";

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
          background-color: #02754B;
          color: #fff;
          position: relative;
          z-index: 100;
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
