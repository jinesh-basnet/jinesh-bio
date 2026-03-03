import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaHistory, FaSignOutAlt, FaCog } from 'react-icons/fa';
import '../css/ViewerDashboard.css';

const ViewerDashboard = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchMyContacts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/auth/my-contacts', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch your messages');
                }

                const data = await response.json();
                setContacts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyContacts();
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="dashboard-loading">Loading your dashboard...</div>;

    return (
        <div className="viewer-dashboard">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="dashboard-header"
                >
                    <div className="user-profile-brief">
                        <div className="profile-avatar">
                            <FaUser />
                        </div>
                        <div className="profile-info">
                            <h1>Welcome, {user?.username || 'Viewer'}</h1>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                    <div className="dashboard-actions">
                        <button onClick={() => navigate('/settings')} className="btn secondary small">
                            <FaCog /> Settings
                        </button>
                        <button onClick={handleLogout} className="btn danger small">
                            <FaSignOutAlt /> Sign Out
                        </button>
                    </div>
                </motion.div>

                <div className="dashboard-grid">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="dashboard-card profile-card"
                    >
                        <h3><FaUser /> Profile Details</h3>
                        <div className="card-content">
                            <div className="detail-item">
                                <label>Username</label>
                                <span>{user?.username}</span>
                            </div>
                            <div className="detail-item">
                                <label>Email</label>
                                <span>{user?.email}</span>
                            </div>
                            <div className="detail-item">
                                <label>Account Role</label>
                                <span className="role-badge">{user?.role}</span>
                            </div>
                            <div className="detail-item">
                                <label>Member Since</label>
                                <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="dashboard-card message-history-card"
                    >
                        <h3><FaHistory /> Message History</h3>
                        <div className="card-content">
                            {contacts.length === 0 ? (
                                <p className="no-messages">You haven't sent any messages yet.</p>
                            ) : (
                                <div className="message-list">
                                    {contacts.map((contact) => (
                                        <div key={contact._id} className={`message-item ${contact.isRead ? 'read' : 'unread'}`}>
                                            <div className="message-header">
                                                <span className="message-date">{new Date(contact.submittedAt).toLocaleDateString()}</span>
                                                <span className={`status-tag ${contact.isRead ? 'responded' : 'pending'}`}>
                                                    {contact.isRead ? 'Responded' : 'Pending'}
                                                </span>
                                            </div>
                                            <p className="message-body">{contact.message}</p>
                                            {contact.response && (
                                                <div className="admin-response">
                                                    <strong>Response:</strong>
                                                    <p>{contact.response}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ViewerDashboard;
