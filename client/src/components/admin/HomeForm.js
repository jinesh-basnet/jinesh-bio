import React from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';

const HomeForm = ({ item, isNew, onChange, onSave, onCancel, validationErrors, loading }) => {
  const handleHeroChange = (field, value) => {
    onChange({
      ...item,
      hero: { ...item.hero, [field]: value }
    });
  };

  const handleButtonChange = (index, field, value) => {
    const newButtons = [...(item.hero?.buttons || [])];
    newButtons[index] = { ...newButtons[index], [field]: value };
    onChange({
      ...item,
      hero: { ...item.hero, buttons: newButtons }
    });
  };

  const addButton = () => {
    const newButtons = [...(item.hero?.buttons || []), { text: '', link: '' }];
    onChange({
      ...item,
      hero: { ...item.hero, buttons: newButtons }
    });
  };

  const removeButton = (index) => {
    const newButtons = item.hero.buttons.filter((_, i) => i !== index);
    onChange({
      ...item,
      hero: { ...item.hero, buttons: newButtons }
    });
  };

  const handleSkillsChange = (field, value) => {
    onChange({
      ...item,
      skills: { ...item.skills, [field]: value }
    });
  };

  const handleSkillChange = (index, field, value) => {
    const newSkillsList = [...(item.skills?.skillsList || [])];
    newSkillsList[index] = { ...newSkillsList[index], [field]: value };
    onChange({
      ...item,
      skills: { ...item.skills, skillsList: newSkillsList }
    });
  };

  const addSkill = () => {
    const newSkillsList = [...(item.skills?.skillsList || []), { name: '', level: 50 }];
    onChange({
      ...item,
      skills: { ...item.skills, skillsList: newSkillsList }
    });
  };

  const removeSkill = (index) => {
    const newSkillsList = item.skills.skillsList.filter((_, i) => i !== index);
    onChange({
      ...item,
      skills: { ...item.skills, skillsList: newSkillsList }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-form"
    >
      <div className="form-section">
        <h4>Hero Section</h4>
        <div className="form-group">
          <label>Heading (e.g. Hi, I'm ...):</label>
          <input
            type="text"
            value={item.hero?.heading || ''}
            onChange={(e) => handleHeroChange('heading', e.target.value)}
          />
          {validationErrors.hero_heading && <span className="error-text">{validationErrors.hero_heading}</span>}
        </div>
        <div className="form-group">
          <label>Highlight Text (The text that appears in blue/gradient):</label>
          <input
            type="text"
            value={item.hero?.highlightText || ''}
            onChange={(e) => handleHeroChange('highlightText', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Animated Typing Texts (comma-separated):</label>
          <input
            type="text"
            value={item.hero?.typingTexts ? item.hero.typingTexts.join(', ') : ''}
            onChange={(e) => handleHeroChange('typingTexts', e.target.value.split(',').map(t => t.trim()))}
          />
          <p className="help-text">💡 These texts will cycle through with a typing animation.</p>
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={item.hero?.description || ''}
            onChange={(e) => handleHeroChange('description', e.target.value)}
          />
          {validationErrors.hero_description && <span className="error-text">{validationErrors.hero_description}</span>}
        </div>
        <div className="form-group">
          <label>Profile Image:</label>
          {item.hero?.profileImage && (
            <div className="current-image">
              <img src={item.hero.profileImage} alt="Profile" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }} />
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
          <label>Buttons:</label>
          {item.hero?.buttons?.map((button, index) => (
            <div key={index} className="button-input-group">
              <div className="button-field">
                <input
                  type="text"
                  placeholder="Button text"
                  value={button.text || ''}
                  onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                />
                {validationErrors[`hero_button_${index}_text`] && <span className="error-text">{validationErrors[`hero_button_${index}_text`]}</span>}
              </div>
              <div className="button-field">
                <input
                  type="text"
                  placeholder="Button link"
                  value={button.link || ''}
                  onChange={(e) => handleButtonChange(index, 'link', e.target.value)}
                />
                {validationErrors[`hero_button_${index}_link`] && <span className="error-text">{validationErrors[`hero_button_${index}_link`]}</span>}
              </div>
              <button
                type="button"
                onClick={() => removeButton(index)}
                className="btn small danger"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addButton}
            className="btn small"
          >
            Add Button
          </button>
          {validationErrors.hero_buttons && <span className="error-text">{validationErrors.hero_buttons}</span>}
        </div>
      </div>

      <div className="form-section">
        <h4>Skills Section</h4>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={item.skills?.title || ''}
            onChange={(e) => handleSkillsChange('title', e.target.value)}
          />
          {validationErrors.skills_title && <span className="error-text">{validationErrors.skills_title}</span>}
        </div>
        <div className="form-group">
          <label>Skills:</label>
          {item.skills?.skillsList?.map((skill, index) => (
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
          {validationErrors.skills_list && <span className="error-text">{validationErrors.skills_list}</span>}
        </div>
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

export default HomeForm;
