import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaProjectDiagram, FaBlog, FaComments, FaHistory, FaUser, FaQuoteRight, FaHome as FaHomeIcon, FaCog, FaUsers, FaFileAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import '../css/admin.css';

import { useAdminData } from '../hooks/useAdminData';
import { useAdminActions } from '../hooks/useAdminActions';

import AdminSidebar from './admin/AdminSidebar';
import AdminHeader from './admin/AdminHeader';
import AdminDashboard from './admin/AdminDashboard';

import ProjectsSection from './admin/ProjectsSection';
import TestimonialsSection from './admin/TestimonialsSection';
import AboutSection from './admin/AboutSection';
import BlogsSection from './admin/BlogsSection';
import UsersSection from './admin/UsersSection';
import HomeSection from './admin/HomeSection';
import ContactsSection from './admin/ContactsSection';
import TimelineSection from './admin/TimelineSection';
import SettingsSection from './admin/SettingsSection';
import CVSection from './admin/CVSection';

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role !== 'admin') {
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate]);

  const adminData = useAdminData(activeTab);
  const {
    data: { projects, testimonials, about, blogs, home, timeline, users, contacts, stats },
    loading,
    error,
    success,
    fetchData
  } = adminData;

  const {
    handleSave,
    handleDelete,
    handleSaveNew,
    handleApproveAdmin,
    handleRejectAdmin
  } = useAdminActions(adminData);

  const [validationErrors] = useState({});

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'home', label: 'Home', icon: FaHomeIcon },
    { id: 'about', label: 'About', icon: FaUser },
    { id: 'cv', label: 'CV Settings', icon: FaFileAlt },
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
    { id: 'blogs', label: 'Blogs', icon: FaBlog },
    { id: 'testimonials', label: 'Testimonials', icon: FaQuoteRight },
    { id: 'timeline', label: 'Timeline', icon: FaHistory },
    { id: 'contacts', label: 'Contacts', icon: FaComments },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard stats={stats} />;
      case 'projects':
        return (
          <ProjectsSection
            projects={projects}
            validationErrors={validationErrors}
            loading={loading}
            onSave={handleSave}
            onDelete={handleDelete}
            onSaveNew={handleSaveNew}
          />
        );
      case 'testimonials':
        return (
          <TestimonialsSection
            testimonials={testimonials}
            validationErrors={validationErrors}
            loading={loading}
            onSave={handleSave}
            onDelete={handleDelete}
            onSaveNew={handleSaveNew}
          />
        );
      case 'about':
        return (
          <AboutSection
            about={about}
            validationErrors={validationErrors}
            loading={loading}
            onSave={handleSave}
          />
        );
      case 'cv':
        return (
          <CVSection
            about={about}
            validationErrors={validationErrors}
            loading={loading}
            onSave={handleSave}
          />
        );
      case 'blogs':
        return (
          <BlogsSection
            blogs={blogs}
            validationErrors={validationErrors}
            loading={loading}
            onSave={handleSave}
            onDelete={handleDelete}
            onSaveNew={handleSaveNew}
          />
        );
      case 'users':
        return (
          <UsersSection
            users={users}
            validationErrors={validationErrors}
            loading={loading}
            onSave={handleSave}
            onDelete={handleDelete}
            onApproveAdmin={handleApproveAdmin}
            onRejectAdmin={handleRejectAdmin}
            fetchUsers={() => fetchData('users')}
          />
        );
      case 'home':
        return (
          <HomeSection
            home={home}
            validationErrors={validationErrors}
            loading={loading}
            onSave={handleSave}
          />
        );
      case 'contacts':
        return (
          <ContactsSection
            contacts={contacts}
            loading={loading}
            onDelete={handleDelete}
            fetchContacts={() => fetchData('contacts')}
          />
        );
      case 'timeline':
        return (
          <TimelineSection
            timelines={timeline}
            validationErrors={validationErrors}
            loading={loading}
            onSave={handleSave}
            onDelete={handleDelete}
            onSaveNew={handleSaveNew}
          />
        );
      case 'settings':
        return <SettingsSection />;
      default:
        return <AdminDashboard stats={stats} />;
    }
  };

  return (
    <ErrorBoundary>
      <section className="admin" id="admin">
        <AdminSidebar
          sections={sections}
          activeSection={activeTab}
          onSectionChange={setActiveTab}
          sidebarOpen={sidebarOpen}
        />

        <div className="admin-main">
          <AdminHeader
            activeTab={activeTab}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="status-message error"
            >
              <span>❌</span>
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="status-message success"
            >
              <span>✅</span>
              {success}
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="loading-overlay"
            >
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </motion.div>
          )}

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="admin-section"
          >
            {renderActiveSection()}
          </motion.div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default Admin;
