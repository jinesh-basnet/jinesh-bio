import React from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';

const UserForm = ({ item, isNew, onChange, onSave, onCancel, validationErrors, loading }) => {
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
        <label>Username:</label>
        <input
          type="text"
          value={item.username || ''}
          onChange={(e) => handleInputChange('username', e.target.value)}
        />
        {validationErrors.username && <span className="error-text">{validationErrors.username}</span>}
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={item.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
      </div>
      <div className="form-group">
        <label>Role:</label>
        <select
          value={item.role || 'user'}
          onChange={(e) => handleInputChange('role', e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {validationErrors.role && <span className="error-text">{validationErrors.role}</span>}
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={item.isApproved || false}
            onChange={(e) => handleInputChange('isApproved', e.target.checked)}
          />
          Approved
        </label>
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={item.isActive || false}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
          />
          Active
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

export default UserForm;
