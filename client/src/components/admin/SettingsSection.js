import React, { useState, useEffect, useContext } from 'react';
import { FaMoon, FaSun, FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';
import './SettingsSection.css';

const SettingsSection = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [settings, setSettings] = useState({
    siteName: '',
    logoText: '',
    footerCopyright: '',
    navLinks: [],
    socialLinks: []
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSettings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (index, field, value) => {
    const newSocialLinks = [...settings.socialLinks];
    newSocialLinks[index][field] = value;
    setSettings(prev => ({ ...prev, socialLinks: newSocialLinks }));
  };

  const addSocialLink = () => {
    setSettings(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '', icon: '', order: prev.socialLinks.length + 1, isActive: true }]
    }));
  };

  const removeSocialLink = (index) => {
    const newSocialLinks = settings.socialLinks.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, socialLinks: newSocialLinks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Saving...');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving settings.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-section settings-section">
      <div className="admin-section-header">
        <h2>Site Management</h2>
        <p>Configure your portfolio's presence and appearance</p>
      </div>

      {message && <div className={`alert ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="settings-grid">
          <div className="settings-card">
            <h3>General Configuration</h3>
            <div className="form-group">
              <label>Logo Text</label>
              <input
                type="text"
                name="logoText"
                value={settings.logoText}
                onChange={handleInputChange}
                placeholder="Portfolio"
              />
              <small>This appears in the top-left of the navigation bar.</small>
            </div>
            <div className="form-group">
              <label>Footer Copyright Text</label>
              <textarea
                name="footerCopyright"
                value={settings.footerCopyright}
                onChange={handleInputChange}
                placeholder="© 2026 Jinesh Basnet. All rights reserved."
              />
              <small>Use {new Date().getFullYear()} for dynamic year in the future if implemented.</small>
            </div>

            <div className="setting-item theme-setting">
              <div className="setting-info">
                <h3>Admin Dark Mode</h3>
                <p>Personalize your workspace theme</p>
              </div>
              <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === 'light' ? <FaMoon /> : <FaSun />}
                <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
              </button>
            </div>
          </div>

          <div className="settings-card">
            <div className="card-header">
              <h3>Social Media Presence</h3>
              <p>These appear in the footer</p>
              <button type="button" className="btn small success" onClick={addSocialLink}>
                <FaPlus /> Add Link
              </button>
            </div>
            <div className="links-list">
              {settings.socialLinks.map((link, index) => (
                <div key={index} className="link-item">
                  <div className="link-inputs">
                    <input
                      type="text"
                      placeholder="Platform Name"
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Profile URL"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Icon Class (e.g. fab fa-github)"
                      value={link.icon}
                      onChange={(e) => handleSocialLinkChange(index, 'icon', e.target.value)}
                    />
                  </div>
                  <button type="button" className="btn icon danger" onClick={() => removeSocialLink(index)} title="Remove">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary big">
            <FaSave /> Save Site Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsSection;
