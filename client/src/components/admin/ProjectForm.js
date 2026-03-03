import React from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';

const ProjectForm = ({ item, isNew, onChange, onSave, onCancel, validationErrors, loading }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...item, [field]: value });
  };

  const handleTopicsChange = (value) => {
    const topics = value.split(',').map(t => t.trim());
    onChange({ ...item, topics });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-form"
    >
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={item.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        {validationErrors.name && <span className="error-text">{validationErrors.name}</span>}
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea
          value={item.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
        <p className="help-text">💡 Tip: Use concise sentences. Good for CV generation.</p>
        {validationErrors.description && <span className="error-text">{validationErrors.description}</span>}
      </div>
      <div className="form-group">
        <label>Language:</label>
        <input
          type="text"
          value={item.language || ''}
          onChange={(e) => handleInputChange('language', e.target.value)}
        />
        {validationErrors.language && <span className="error-text">{validationErrors.language}</span>}
      </div>
      <div className="form-group">
        <label>GitHub URL:</label>
        <input
          type="url"
          value={item.html_url || ''}
          onChange={(e) => handleInputChange('html_url', e.target.value)}
        />
        {validationErrors.html_url && <span className="error-text">{validationErrors.html_url}</span>}
      </div>
      <div className="form-group">
        <label>Demo URL:</label>
        <input
          type="url"
          value={item.homepage || ''}
          onChange={(e) => handleInputChange('homepage', e.target.value)}
        />
        {validationErrors.homepage && <span className="error-text">{validationErrors.homepage}</span>}
      </div>
      <div className="form-group">
        <label>Stars:</label>
        <input
          type="number"
          value={item.stargazers_count || 0}
          onChange={(e) => handleInputChange('stargazers_count', parseInt(e.target.value) || 0)}
        />
        {validationErrors.stargazers_count && <span className="error-text">{validationErrors.stargazers_count}</span>}
      </div>

      <div className="form-group">
        <label>Topics/Technologies (comma-separated):</label>
        <input
          type="text"
          value={item.topics ? item.topics.join(', ') : ''}
          onChange={(e) => handleTopicsChange(e.target.value)}
        />
        <p className="help-text">These will appear as badges on your designated Project cards.</p>
      </div>
      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            checked={item.featured || false}
            onChange={(e) => handleInputChange('featured', e.target.checked)}
          />
          Mark as Featured Project
        </label>
      </div>
      <div className="form-actions">
        <button onClick={onSave} className="btn primary" disabled={loading}>
          <FaSave /> Save
        </button>
        <button onClick={onCancel} className="btn secondary">
          <FaTimes /> Cancel
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectForm;
