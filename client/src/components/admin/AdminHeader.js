import React, { useContext } from 'react';
import { FaBars, FaSignOutAlt, FaUser, FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';

const AdminHeader = ({ sidebarOpen, setSidebarOpen, onLogout }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaBars className="toggle-icon" />
        </button>
        <h1 className="admin-title">Admin Dashboard</h1>
      </div>
      <div className="admin-header-right">
        <div className="admin-user-info">
          <FaUser className="user-icon" />
          <span className="user-name">Admin</span>
        </div>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
