import React from 'react';
import { FaCheck } from 'react-icons/fa';

const AdminSidebar = ({ sections, activeSection, onSectionChange }) => {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo">
          <FaCheck className="logo-icon" />
          <div>
            <h2>Admin Panel</h2>
            <p>Portfolio Management</p>
          </div>
        </div>
      </div>

      <nav>
        <ul className="admin-nav">
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
    </div>
  );
};

export default AdminSidebar;
