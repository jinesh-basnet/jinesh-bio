import React from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';

const BlogForm = ({ item, isNew, onChange, onSave, onCancel, validationErrors, loading }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...item, [field]: value });
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(t => t.trim());
    onChange({ ...item, tags });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-form"
    >
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
        <label>Content:</label>
        <textarea
          value={item.content || ''}
          onChange={(e) => handleInputChange('content', e.target.value)}
        />
        {validationErrors.content && <span className="error-text">{validationErrors.content}</span>}
      </div>
      <div className="form-group">
        <label>Excerpt:</label>
        <textarea
          value={item.excerpt || ''}
          onChange={(e) => handleInputChange('excerpt', e.target.value)}
        />
        {validationErrors.excerpt && <span className="error-text">{validationErrors.excerpt}</span>}
      </div>
      <div className="form-group">
        <label>Author:</label>
        <input
          type="text"
          value={item.author || ''}
          onChange={(e) => handleInputChange('author', e.target.value)}
        />
        {validationErrors.author && <span className="error-text">{validationErrors.author}</span>}
      </div>
      <div className="form-group">
        <label>Category:</label>
        <input
          type="text"
          value={item.category || ''}
          onChange={(e) => handleInputChange('category', e.target.value)}
        />
        {validationErrors.category && <span className="error-text">{validationErrors.category}</span>}
      </div>
      <div className="form-group">
        <label>Featured Image URL:</label>
        <input
          type="text"
          value={item.featuredImage || ''}
          onChange={(e) => handleInputChange('featuredImage', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Tags (comma-separated):</label>
        <input
          type="text"
          value={item.tags ? item.tags.join(', ') : ''}
          onChange={(e) => handleTagsChange(e.target.value)}
        />
      </div>
      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={item.published || false}
            onChange={(e) => handleInputChange('published', e.target.checked)}
          />
          Published
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={item.featured || false}
            onChange={(e) => handleInputChange('featured', e.target.checked)}
          />
          Featured Post
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

export default BlogForm;
