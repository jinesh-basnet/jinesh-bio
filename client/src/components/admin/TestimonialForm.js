import React from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';

const TestimonialForm = ({ item, isNew, onChange, onSave, onCancel, validationErrors, loading }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...item, [field]: value });
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
        <label>Role:</label>
        <input
          type="text"
          value={item.role || ''}
          onChange={(e) => handleInputChange('role', e.target.value)}
        />
        {validationErrors.role && <span className="error-text">{validationErrors.role}</span>}
      </div>
      <div className="form-group">
        <label>Company:</label>
        <input
          type="text"
          value={item.company || ''}
          onChange={(e) => handleInputChange('company', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Message:</label>
        <textarea
          value={item.message || ''}
          onChange={(e) => handleInputChange('message', e.target.value)}
        />
        {validationErrors.message && <span className="error-text">{validationErrors.message}</span>}
      </div>
      <div className="form-group">
        <label>Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={item.rating || 5}
          onChange={(e) => handleInputChange('rating', parseInt(e.target.value) || 5)}
        />
        {validationErrors.rating && <span className="error-text">{validationErrors.rating}</span>}
      </div>
      <div className="form-group">
        <label>Image URL:</label>
        <input
          type="text"
          value={item.image || ''}
          onChange={(e) => handleInputChange('image', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={item.featured || false}
            onChange={(e) => handleInputChange('featured', e.target.checked)}
          />
          Featured Testimonial
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

export default TestimonialForm;
