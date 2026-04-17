import React, { useMemo } from 'react';
import { 
  FaUsers, FaProjectDiagram, FaBlog, FaComments, FaHistory, 
  FaPlus, FaRegBell, FaUserEdit, FaExternalLinkAlt, 
  FaQuoteLeft as FaQuoteIcon
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = ({ stats, onTabChange }) => {
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

  const [activities, setActivities] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const notificationRef = React.useRef(null);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        
        const [activityRes, contactsRes] = await Promise.all([
          fetch(`${baseUrl}/api/admin/activity`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${baseUrl}/api/admin/contacts`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setActivities(activityData);
        }

        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          const unread = contactsData.filter(c => !c.isRead).map(c => ({
            id: c._id,
            type: 'contact',
            title: `New Message from ${c.name}`,
            time: c.submittedAt,
            link: '/admin#contacts'
          }));
          setNotifications(unread);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const getActivityColor = (action) => {
    switch (action) {
      case 'CREATE': return 'green';
      case 'UPDATE': return 'blue';
      case 'DELETE': return 'red';
      case 'APPROVE': return 'yellow';
      default: return 'blue';
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header-modern">
        <div className="welcome-text">
          <h1>{getTimeGreeting()}, Admin! 👋</h1>
          <p>Here's what's happening with your portfolio today.</p>
        </div>
        <div className="header-actions-quick" ref={notificationRef}>
          <div className="notification-wrapper">
            <button 
              className={`btn-icon-modern ${showNotifications ? 'active' : ''}`} 
              title="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
               <FaRegBell />
               {notifications.length > 0 && <span className="dot pulse"></span>}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown glass-card">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                  {notifications.length > 0 && <span className="badge">{notifications.length} New</span>}
                </div>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div key={notif.id} className="notification-item">
                        <div className="notif-icon"><FaComments /></div>
                        <div className="notif-content">
                          <p>{notif.title}</p>
                          <span>{formatTime(notif.time)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-notif">
                      <p>All caught up! 🎉</p>
                    </div>
                  )}
                </div>
                <div className="dropdown-footer">
                   <button className="btn-text">View all notifications</button>
                </div>
              </div>
            )}
          </div>
          
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
                <span className="stat-value" onClick={() => onTabChange(stat.id)} style={{ cursor: 'pointer' }}>{displayValue}</span>
                <span className="stat-label" onClick={() => onTabChange(stat.id)} style={{ cursor: 'pointer' }}>{stat.label}</span>
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
            <button className="action-item" onClick={() => onTabChange('projects')}>
              <div className="action-icon" style={{ background: '#6366f1' }}><FaPlus /></div>
              <span>New Project</span>
            </button>
            <button className="action-item" onClick={() => onTabChange('blogs')}>
              <div className="action-icon" style={{ background: '#10b981' }}><FaPlus /></div>
              <span>New Blog</span>
            </button>
            <button className="action-item" onClick={() => onTabChange('home')}>
              <div className="action-icon" style={{ background: '#f59e0b' }}><FaUserEdit /></div>
              <span>Edit Profile</span>
            </button>
            <button className="action-item" onClick={() => onTabChange('timeline')}>
              <div className="action-icon" style={{ background: '#ef4444' }}><FaPlus /></div>
              <span>Timeline</span>
            </button>
          </div>
        </div>

        <div className="recent-activity glass-card">
          <h3>Recent Updates</h3>
          <div className="activity-list">
            {loading ? (
              <p>Loading activity...</p>
            ) : activities.length > 0 ? (
              activities.map((log) => (
                <div key={log._id} className="activity-item">
                  <div className={`activity-dot ${getActivityColor(log.action)}`}></div>
                  <div className="activity-content">
                    <p>
                      <strong>{log.action}:</strong> {log.resource} 
                      {log.details?.title || log.details?.name ? ` "${log.details.title || log.details.name}"` : ''}
                    </p>
                    <span>{formatTime(log.timestamp)} by {log.userId?.username || 'Unknown'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-activity">No recent activity found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
