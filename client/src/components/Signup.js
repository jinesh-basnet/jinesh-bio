import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../css/auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(data.message);

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
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
          transition={{ duration: 0.8, ease: "backOut" }}
          className="auth-card"
        >
          <div className="mandala-watermark"></div>
          <div className="auth-header">
            <motion.div 
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
              className="auth-icon-container"
            >
              <FaUserPlus />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            > Join Us </motion.h2>
            <span className="auth-subtitle-nepali">नयाँ खाता बनाउनुहोस्</span>
            <p>Create your account and get started</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="form-group"
            >
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Choose a username"
                  disabled={loading}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="form-group"
            >
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  disabled={loading}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
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
                  placeholder="Create a password"
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

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="form-group"
            >
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Repeat your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="success-message"
              >
                {success}
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              type="submit"
              className="auth-button"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <FaUserPlus />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          <footer className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </footer>
        </motion.div>
      </div>
    </section>
  );
};

export default Signup;

