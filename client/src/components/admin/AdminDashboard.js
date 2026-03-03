import React from 'react';
import { FaUsers, FaProjectDiagram, FaBlog, FaComments, FaHistory } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = ({ stats }) => {
  const statCards = [
    {
      id: 'projects',
      label: 'Projects',
      value: stats?.projects || 0,
      icon: FaProjectDiagram,
      color: '#4e73df'
    },
    {
      id: 'blogs',
      label: 'Blogs',
      value: stats?.blogs || 0,
      icon: FaBlog,
      color: '#1cc88a'
    },
    {
      id: 'contacts',
      label: 'Contacts',
      value: stats?.contacts || 0,
      icon: FaComments,
      color: '#36b9cc'
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      value: stats?.testimonials || 0,
      icon: FaQuoteRight,
      color: '#f6c23e'
    },
    {
      id: 'timeline',
      label: 'Timeline Items',
      value: stats?.timeline || 0,
      icon: FaHistory,
      color: '#e74a3b'
    },
    {
      id: 'users',
      label: 'Total Users',
      value: stats?.users || 0,
      icon: FaUsers,
      color: '#858796'
    }
  ];

  return (
    <div className="admin-dashboard-stats">
      <div className="stats-grid">
        {statCards.map((stat) => (
          <div key={stat.id} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
            <div className="stat-icon" style={{ color: stat.color }}>
              <stat.icon />
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-welcome">
        <h2>Welcome to Admin Panel</h2>
        <p>Use the sidebar to manage different sections of your portfolio website.</p>
      </div>
    </div>
  );
};

const FaQuoteRight = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M464 256h-80v-48c0-26.51 21.49-48 48-48h16c8.837 0 16-7.163 16-16V48c0-8.837-7.163-16-16-16h-16c-70.692 0-128 57.308-128 128v256c0 35.346 28.654 64 64 64h96c35.346 0 64-28.654 64-64V320c0-35.346-28.654-64-64-64zM176 256H96v-48c0-26.51 21.49-48 48-48h16c8.837 0 16-7.163 16-16V48c0-8.837-7.163-16-16-16h-16c-70.692 0-128 57.308-128 128v256c0 35.346 28.654 64 64 64h96c35.346 0 64-28.654 64-64V320c0-35.346-28.654-64-64-64z"></path>
  </svg>
);

export default AdminDashboard;
