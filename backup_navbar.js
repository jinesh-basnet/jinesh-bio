import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [settings, setSettings] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Fetch site settings
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/settings`);
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
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
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">
          <Link to="/">{settings?.logoText || 'Portfolio'}</Link>
        </div>
        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
           <li><Link to="/" onClick={closeMenu}>Home</Link></li>
           <li><Link to="/about" onClick={closeMenu}>About</Link></li>
           <li><Link to="/projects" onClick={closeMenu}>Projects</Link></li>
           <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>
           <li><Link to="/testimonials" onClick={closeMenu}>Testimonials</Link></li>
           <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
        </ul>
        <div className="nav-actions">
          {isAuthenticated ? (
            <button onClick={handleLogout}><FiLogOut /></button>
          ) : (
            <Link to="/login">Login</Link>
          )}
          <button onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
          <div className="hamburger" onClick={toggleMenu}>
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
