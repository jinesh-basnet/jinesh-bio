import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };





  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <motion.div
          className="logo"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" aria-label="Go to home page">Portfolio</Link>
        </motion.div>

        <motion.ul
          className={`nav-links ${isOpen ? 'active' : ''}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          role="menubar"
        >
          <li role="none">
            <Link
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
              onClick={closeMenu}
              role="menuitem"
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
          </li>
          <li role="none">
            <Link
              to="/about"
              className={location.pathname === '/about' ? 'active' : ''}
              onClick={closeMenu}
              role="menuitem"
              aria-current={location.pathname === '/about' ? 'page' : undefined}
            >
              About
            </Link>
          </li>
          <li role="none">
            <Link
              to="/projects"
              className={location.pathname === '/projects' ? 'active' : ''}
              onClick={closeMenu}
              role="menuitem"
              aria-current={location.pathname === '/projects' ? 'page' : undefined}
            >
              Projects
            </Link>
          </li>
          <li role="none">
            <Link
              to="/blog"
              className={location.pathname === '/blog' ? 'active' : ''}
              onClick={closeMenu}
              role="menuitem"
              aria-current={location.pathname === '/blog' ? 'page' : undefined}
            >
              Blog
            </Link>
          </li>
          <li role="none">
            <Link
              to="/testimonials"
              className={location.pathname === '/testimonials' ? 'active' : ''}
              onClick={closeMenu}
              role="menuitem"
              aria-current={location.pathname === '/testimonials' ? 'page' : undefined}
            >
              Testimonials
            </Link>
          </li>
          <li role="none">
            <Link
              to="/contact"
              className={location.pathname === '/contact' ? 'active' : ''}
              onClick={closeMenu}
              role="menuitem"
              aria-current={location.pathname === '/contact' ? 'page' : undefined}
            >
              Contact
            </Link>
          </li>
        </motion.ul>

        <motion.div
          className="nav-actions"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isAuthenticated ? (
            <>
              {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' ? (
                <Link
                  to="/admin"
                  className="btn small"
                  onClick={closeMenu}
                >
                  Admin
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="btn small"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              )}
              <button
                className="btn small danger"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <FiLogOut />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn small"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn small outline"
                onClick={closeMenu}
              >
                <FiUserPlus />
                Sign Up
              </Link>
            </>
          )}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            className="hamburger"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </motion.div>
      </div>
    </nav>
  );
};

export default NavBar;
