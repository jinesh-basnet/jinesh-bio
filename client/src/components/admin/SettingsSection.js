import React, { useContext } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';

const SettingsSection = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Settings & Preferences</h2>
        <p>Manage your admin panel preferences</p>
      </div>

      <div className="settings-content">
        <div className="setting-item">
          <div className="setting-info">
            <h3>Dark Mode</h3>
            <p>Toggle between light and dark themes</p>
          </div>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
            <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsSection;
