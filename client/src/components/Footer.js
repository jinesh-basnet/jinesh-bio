import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
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

  return (
    <footer className="footer">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p>{settings?.footerCopyright || `© ${new Date().getFullYear()} Jinesh Basnet. All rights reserved.`}</p>
        </motion.div>

        <motion.div
          className="social-links"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {settings?.socialLinks?.length > 0 ? (
            settings.socialLinks
              .filter(link => link.isActive !== false && link.platform.toLowerCase() !== 'twitter')
              .sort((a, b) => a.order - b.order)
              .map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" title={link.platform}>
                  <i className={link.icon}></i>
                </a>
              ))
          ) : (
            <>
              <a href="https://github.com/jinesh-basnet" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.facebook.com/jinesa.basneta" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://www.instagram.com/jinesh112/?hl=en" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </>
          )}
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
