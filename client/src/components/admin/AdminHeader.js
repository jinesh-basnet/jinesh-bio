import React, { useContext } from 'react';
import { FaBars, FaMoon, FaSun, FaSearch } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="admin-header-modern">
      <div className="header-left">
        <button className="sidebar-btn-modern" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaBars />
        </button>
        <div className="breadcrumb-modern">
          <span className="root">Admin</span>
          <span className="separator">/</span>
          <span className="current">Dashboard</span>
        </div>
      </div>
      
      <div className="header-center">
        <div className="search-box-modern">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Quick search..." />
          <span className="search-kb-hint">⌘K</span>
        </div>
      </div>

      <div className="header-right">
        <button className="theme-toggle-modern" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
        <div className="admin-profile-pill">
          <div className="avatar-mini">JB</div>
          <span className="admin-name-text">Jinesh</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
