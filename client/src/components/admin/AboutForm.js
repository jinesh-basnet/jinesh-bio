import React from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';

const AboutForm = ({ item, isNew, onChange, onSave, onCancel, validationErrors, loading }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...item, [field]: value });
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...(item.skills || [])];
    newSkills[index] = { ...newSkills[index], [field]: value };
    onChange({ ...item, skills: newSkills });
  };

  const addSkill = () => {
    const newSkills = [...(item.skills || []), { name: '', level: 50 }];
    onChange({ ...item, skills: newSkills });
  };

  const removeSkill = (index) => {
    const newSkills = item.skills.filter((_, i) => i !== index);
    onChange({ ...item, skills: newSkills });
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
        <label>Description:</label>
        <textarea
          value={item.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
        {validationErrors.description && <span className="error-text">{validationErrors.description}</span>}
      </div>
      <div className="form-group">
        <label>Years of Experience:</label>
        <input
          type="number"
          min="0"
          value={item.experience || 0}
          onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
        />
        <p className="help-text">📊 This value is used for the stats on the home page hero section.</p>
      </div>
      <div className="form-group">
        <label>Profile Image:</label>
        {item.profileImage && (
          <div className="current-image">
            <img src={item.profileImage} alt="Profile" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }} />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange({ ...item, profileImageFile: e.target.files[0] })}
        />
        <p className="help-text">💡 For best results, use a PNG image with transparent background. You can remove backgrounds at <a href="https://www.remove.bg" target="_blank" rel="noopener noreferrer">remove.bg</a></p>
      </div>
      <div className="form-group">
        <label>Skills:</label>
        {item.skills?.map((skill, index) => (
          <div key={index} className="skill-input-group">
            <div className="skill-field">
              <input
                type="text"
                placeholder="Skill name"
                value={skill.name || ''}
                onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
              />
              {validationErrors[`skill_${index}_name`] && <span className="error-text">{validationErrors[`skill_${index}_name`]}</span>}
            </div>
            <div className="skill-field">
              <input
                type="number"
                placeholder="Level"
                min="1"
                max="100"
                value={skill.level || 50}
                onChange={(e) => handleSkillChange(index, 'level', parseInt(e.target.value) || 50)}
              />
              {validationErrors[`skill_${index}_level`] && <span className="error-text">{validationErrors[`skill_${index}_level`]}</span>}
            </div>
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="btn small danger"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSkill}
          className="btn small"
        >
          Add Skill
        </button>
        {validationErrors.skills && <span className="error-text">{validationErrors.skills}</span>}
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

export default AboutForm;
