import React from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';

const TimelineForm = ({ item, isNew, onChange, onSave, onCancel, validationErrors, loading }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...item, [field]: value });
  };

  const handleTechnologiesChange = (value) => {
    const technologies = value.split(',').map(t => t.trim());
    onChange({ ...item, technologies });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-form"
    >
      <div className="form-group">
        <label>Type:</label>
        <select
          value={item.type || 'work'}
          onChange={(e) => handleInputChange('type', e.target.value)}
        >
          <option value="work">Work</option>
          <option value="education">Education</option>
          <option value="certification">Certification</option>
          <option value="life">Life Milestone</option>
          <option value="achievement">Achievement</option>
        </select>
        {validationErrors.type && <span className="error-text">{validationErrors.type}</span>}
      </div>
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          value={item.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
        {validationErrors.title && <span className="error-text">{validationErrors.title}</span>}
      </div>
      <div className="form-group">
        <label>Company/Organization:</label>
        <input
          type="text"
          value={item.company || ''}
          onChange={(e) => handleInputChange('company', e.target.value)}
        />
        {validationErrors.company && <span className="error-text">{validationErrors.company}</span>}
      </div>
      <div className="form-group">
        <label>Location:</label>
        <input
          type="text"
          value={item.location || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
        />
        {validationErrors.location && <span className="error-text">{validationErrors.location}</span>}
      </div>
      <div className="form-group">
        <label>Period:</label>
        <input
          type="text"
          value={item.period || ''}
          onChange={(e) => handleInputChange('period', e.target.value)}
        />
        {validationErrors.period && <span className="error-text">{validationErrors.period}</span>}
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea
          value={item.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
        <p className="help-text">💡 Tip: Use separate sentences. The CV generator will automatically turn them into bullet points.</p>
        {validationErrors.description && <span className="error-text">{validationErrors.description}</span>}
      </div>
      <div className="form-group">
        <label>Technologies/Skills (comma-separated):</label>
        <input
          type="text"
          value={item.technologies ? item.technologies.join(', ') : ''}
          onChange={(e) => handleTechnologiesChange(e.target.value)}
        />
        {validationErrors.technologies && <span className="error-text">{validationErrors.technologies}</span>}
      </div>
      <div className="form-group">
        <label>Image:</label>
        {item.image && (
          <div className="current-image">
            <img src={item.image} alt="Timeline" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }} />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleInputChange('imageFile', e.target.files[0])}
        />
        <p className="help-text">💡 Tip: Adding a photo makes your journey more visual and personal!</p>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={item.featured !== false}
            onChange={(e) => handleInputChange('featured', e.target.checked)}
          />
          Feature in CV
        </label>
        <p className="help-text">Check to include this experience in your generated CV/Resume.</p>
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

export default TimelineForm;
