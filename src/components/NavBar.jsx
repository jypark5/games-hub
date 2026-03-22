import { Link } from "react-router-dom";
import './NavBar.css';

export const NavBar = () => {
  return (
    <div className="nav-bar">
      <div className="left-section">
        <Link to="/" className="games-link">
          All Games
        </Link>
      </div>
      <div className="right-section">
        <Link to="/account" className="profile-icon-container">
          Account
        </Link>
        <div className="settings-icon-container">
          settings
        </div>
      </div>
    </div>
  );
}