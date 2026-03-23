import { Link } from "react-router-dom";
import './NavBar.css';
import profileIcon from '../assets/profile-icon.png';
import settingsIcon from '../assets/settings-icon.webp';

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
          <img src={profileIcon} alt="Account" className="profile-icon" />
        </Link>
        <Link to="/settings" className="settings-icon-container">
          <img src={settingsIcon} alt="Settings" className="settings-icon" />
        </Link>
      </div>
    </div>
  );
}