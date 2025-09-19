import { useLocation } from "react-router-dom";
import routes from "../routes";
import AvatarImage from "../assets/avatar.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar({ onHamburgerClick }) {
  const location = useLocation();
  const currentRoute = routes.find((route) => route.path === location.pathname);
  const title = currentRoute ? currentRoute.name : "My App";

  return (
    <nav className="navbar">
      <button
        className="navbar-hamburger"
        onClick={onHamburgerClick}
        aria-label="Menu"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      <h3 className="navbar-title">{title}</h3>

      <div className="navbar-right">
        <span className="navbar-version">v.1.0.0b</span>
        <div className="navbar-user">
          <span>Hi, User</span>
          <img src={AvatarImage} alt="User Avatar" className="navbar-avatar" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
