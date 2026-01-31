import './NavBar.css';

export const NavBar = () => {
  return (
    <div className="nav-bar">
      <div className="left-section">
        Games
      </div>
      <div className="right-section">
        <div className="profile-icon-container">
          profile
        </div>
        <div className="settings-icon-container">
          settings
        </div>
      </div>
    </div>
  );
}