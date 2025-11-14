import { useLocation, useNavigate } from "react-router-dom";
import routes from "../routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../css/Navbar.css";

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
        <div className="navbar-user" onClick={handleLogout} style={{cursor: "pointer"}}>
          <img src="/assets/avatar.jpg" alt="User Avatar" className="navbar-avatar" />
          <p>LOGOUT</p>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;