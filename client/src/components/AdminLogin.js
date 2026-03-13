import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaShieldAlt, FaSignInAlt, FaLock, FaEnvelope } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/auth.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const { token, user } = await response.json();

      if (user.role !== 'admin') {
        throw new Error('Access denied. This login is for administrators only.');
      }

      if (!user.isApproved) {
        throw new Error('Your admin account is pending approval. Please contact an existing administrator.');
      }

      login(user, token);

      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.message || 'Admin login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section" onMouseMove={handleMouseMove}>
      <div className="nepal-bg">
        <div className="dhaka-pattern"></div>
        <div className="sun" style={{ transform: `translate(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px)` }}></div>
        <div className="moon" style={{ transform: `translate(${mousePos.x * -1.2}px, ${mousePos.y * -1.2}px) rotate(-25deg)` }}></div>
        <div className="stars"></div>
        
        <div className="cloud-container">
          <div className="cloud" style={{ top: '15%', left: '10%', width: '200px', height: '60px', animation: 'cloudMove 40s linear infinite' }}></div>
          <div className="cloud" style={{ top: '40%', left: '60%', width: '300px', height: '80px', animation: 'cloudMove 60s linear infinite' }}></div>
          <div className="cloud" style={{ top: '70%', left: '20%', width: '250px', height: '70px', animation: 'cloudMove 50s linear infinite' }}></div>
        </div>

        <div className="mountain-layer" style={{ transform: `translateX(${mousePos.x * 0.5}px)` }}></div>
        <div className="hill-layer" style={{ transform: `translateX(${mousePos.x * 0.8}px)` }}></div>
        
        <div className="prayer-flags">
          <div className="flag flag-blue"></div>
          <div className="flag flag-white"></div>
          <div className="flag flag-red"></div>
          <div className="flag flag-green"></div>
          <div className="flag flag-yellow"></div>
        </div>
      </div>

      <div className="auth-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="auth-card"
        >
          <div className="mandala-watermark"></div>
          <div className="auth-header">
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
              className="auth-icon-container"
              style={{ background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)' }}
            >
              <FaShieldAlt />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Admin Portal
            </motion.h2>
            <span className="auth-subtitle-nepali">प्रशासक लगइन</span>
            <p>Secure access for administrators</p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="admin-badge"
            >
              Secure Access
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="form-group"
            >
              <label htmlFor="email">Admin Email</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@example.com"
                  disabled={loading}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="form-group"
            >
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your security key"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              type="submit"
              className="auth-button"
              style={{ background: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)' }}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <FaSignInAlt />
                  Access Dashboard
                </>
              )}
            </motion.button>
          </form>

          <footer className="auth-footer">
            <p><Link to="/login">← Back to Portfolio Login</Link></p>
          </footer>
        </motion.div>
      </div>
    </section>
  );
};

export default AdminLogin;

