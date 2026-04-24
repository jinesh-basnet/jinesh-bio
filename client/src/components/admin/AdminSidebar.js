import React from 'react';
import { FaCheck, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ sections, activeSection, onSectionChange }) => {
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin"}');

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <FaCheck className="logo-icon" />
          <div>
            <h2>Admin Panel</h2>
          </div>
        </div>
      </div>

      <nav className="admin-nav">
        <ul>
          {sections.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="admin-nav-item">
                <a
                  href={`#${item.id}`}
                  className={`admin-nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSectionChange(item.id);
                  }}
                >
                  <span className="admin-nav-icon"><Icon /></span>
                  <span className="nav-text">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-mini">
          <FaUserCircle className="user-avatar-icon" />
          <div className="user-meta">
            <span className="user-name">{user.name || 'Jinesh'}</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
        <button className="sidebar-logout-btn" onClick={() => logout()}>
          <FaSignOutAlt />
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
