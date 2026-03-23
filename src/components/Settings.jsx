import { useEffect, useState } from 'react';
import './Settings.css';

const THEME_KEY = 'games-hub:theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';

  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;

  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function Settings() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-section">
        <div className="settings-row">
          <div className="settings-label">Dark mode</div>

          <label className="settings-switch">
            <input
              type="checkbox"
              checked={isDark}
              onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            />
            <span className="settings-slider" />
          </label>
        </div>
      </div>
    </div>
  );
}
