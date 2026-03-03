import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';

const TimelineForm = ({ item, isNew = false, onSave, onCancel, validationErrors }) => {
  const [formData, setFormData] = useState({
    type: item?.type || 'work',
    title: item?.title || '',
    company: item?.company || '',
    location: item?.location || '',
    period: item?.period || '',
    description: item?.description || '',
    technologies: item?.technologies || []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleTechnologiesChange = (value) => {
    const technologies = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, technologies });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-form"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type:</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="work">Work Experience</option>
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
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Senior Full-Stack Developer"
          />
          {validationErrors.title && <span className="error-text">{validationErrors.title}</span>}
        </div>

        <div className="form-group">
          <label>Company/Organization:</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g., TechCorp Solutions"
          />
          {validationErrors.company && <span className="error-text">{validationErrors.company}</span>}
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., New York, NY"
          />
          {validationErrors.location && <span className="error-text">{validationErrors.location}</span>}
        </div>

        <div className="form-group">
          <label>Period:</label>
          <input
            type="text"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            placeholder="e.g., 2022 - Present"
          />
          {validationErrors.period && <span className="error-text">{validationErrors.period}</span>}
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your experience, achievements, or details..."
            rows="4"
          />
          {validationErrors.description && <span className="error-text">{validationErrors.description}</span>}
        </div>

        <div className="form-group">
          <label>Technologies/Skills (comma-separated):</label>
          <input
            type="text"
            value={formData.technologies.join(', ')}
            onChange={(e) => handleTechnologiesChange(e.target.value)}
            placeholder="e.g., React, Node.js, MongoDB, AWS"
          />
          {validationErrors.technologies && <span className="error-text">{validationErrors.technologies}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary">
            <FaSave /> Save
          </button>
          <button type="button" onClick={onCancel} className="btn secondary">
            <FaTimes /> Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TimelineForm;
