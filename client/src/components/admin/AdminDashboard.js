import React, { useMemo } from 'react';
import { 
  FaUsers, FaProjectDiagram, FaBlog, FaComments, FaHistory, 
  FaPlus, FaRegBell, FaUserEdit, FaExternalLinkAlt, 
  FaQuoteLeft as FaQuoteIcon
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = ({ stats }) => {
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const statCards = useMemo(() => [
    { id: 'projects', label: 'Projects', value: stats?.projects || 0, icon: FaProjectDiagram, color: '#6366f1' },
    { id: 'blogs', label: 'Blogs', value: stats?.blogs || 0, icon: FaBlog, color: '#10b981' },
    { id: 'contacts', label: 'Contacts', value: stats?.contacts || 0, icon: FaComments, color: '#06b6d4' },
    { id: 'testimonials', label: 'Testimonials', value: stats?.testimonials || 0, icon: FaQuoteIcon, color: '#f59e0b' },
    { id: 'timeline', label: 'Timeline', value: stats?.timeline || 0, icon: FaHistory, color: '#ef4444' },
    { id: 'users', label: 'Users', value: stats?.users || 0, icon: FaUsers, color: '#8b5cf6' }
  ], [stats]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header-modern">
        <div className="welcome-text">
          <h1>{getTimeGreeting()}, Admin! 👋</h1>
          <p>Here's what's happening with your portfolio today.</p>
        </div>
        <div className="header-actions-quick">
          <button className="btn-icon-modern" title="Notifications">
             <FaRegBell />
             <span className="dot"></span>
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-modern-outline">
            <FaExternalLinkAlt /> View Site
          </a>
        </div>
      </div>

      <div className="stats-grid-modern">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const displayValue = typeof stat.value === 'object' ? '0' : (stat.value || 0);
          
          return (
            <div key={stat.id} className="stat-card-modern" style={{ '--accent': stat.color }}>
              <div className="stat-icon-wrap">
                {Icon ? <Icon /> : <FaPlus />}
              </div>
              <div className="stat-info">
                <span className="stat-value">{displayValue}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
              <div className="stat-progress">
                <div className="progress-bar" style={{ width: '70%' }}></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-lower-row">
        <div className="quick-actions-section glass-card">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-item">
              <div className="action-icon" style={{ background: '#6366f1' }}><FaPlus /></div>
              <span>New Project</span>
            </button>
            <button className="action-item">
              <div className="action-icon" style={{ background: '#10b981' }}><FaPlus /></div>
              <span>New Blog</span>
            </button>
            <button className="action-item">
              <div className="action-icon" style={{ background: '#f59e0b' }}><FaUserEdit /></div>
              <span>Edit About</span>
            </button>
            <button className="action-item">
              <div className="action-icon" style={{ background: '#ef4444' }}><FaPlus /></div>
              <span>Timeline</span>
            </button>
          </div>
        </div>

        <div className="recent-activity glass-card">
          <h3>Recent Updates</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot blue"></div>
              <div className="activity-content">
                <p><strong>New Contact:</strong> Message from John Doe</p>
                <span>2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot green"></div>
              <div className="activity-content">
                <p><strong>Blog Published:</strong> "My React Journey"</p>
                <span>Yesterday at 4:30 PM</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot yellow"></div>
              <div className="activity-content">
                <p><strong>Project Updated:</strong> "Portfolio V2"</p>
                <span>3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
