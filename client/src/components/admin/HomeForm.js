import React from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';

const HomeForm = ({ item, isNew, onChange, onSave, onCancel, validationErrors = {}, loading }) => {
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
              <div className="skill-row">
                <div className="skill-field">
                  <input
                    type="text"
                    placeholder="Skill name (e.g. React)"
                    value={skill.name || ''}
                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="skill-field narrow">
                  <input
                    type="text"
                    placeholder="Icon (e.g. ⚛️)"
                    value={skill.icon || ''}
                    onChange={(e) => handleSkillChange(index, 'icon', e.target.value)}
                  />
                </div>
                <div className="skill-field narrow">
                  <select
                    value={skill.category || 'All'}
                    onChange={(e) => handleSkillChange(index, 'category', e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Tools">Tools</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div className="skill-field narrow">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Level"
                    value={skill.level || 50}
                    onChange={(e) => handleSkillChange(index, 'level', parseInt(e.target.value) || 50)}
                  />
                </div>
              </div>
              
              <div className="skill-details">
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    rows="2"
                    placeholder="What can you do with this skill? Real-world examples..."
                    value={skill.description || ''}
                    onChange={(e) => handleSkillChange(index, 'description', e.target.value)}
                  />
                </div>
                
                <div className="form-group mini">
                  <label>Projects using this skill:</label>
                  {skill.projects?.map((proj, pIdx) => (
                    <div key={pIdx} className="mini-input-group">
                      <input
                        placeholder="Project name"
                        value={proj.name || ''}
                        onChange={(e) => {
                          const newProjects = [...(skill.projects || [])];
                          newProjects[pIdx] = { ...newProjects[pIdx], name: e.target.value };
                          handleSkillChange(index, 'projects', newProjects);
                        }}
                      />
                      <input
                        placeholder="URL"
                        value={proj.url || ''}
                        onChange={(e) => {
                          const newProjects = [...(skill.projects || [])];
                          newProjects[pIdx] = { ...newProjects[pIdx], url: e.target.value };
                          handleSkillChange(index, 'projects', newProjects);
                        }}
                      />
                      <button
                        type="button"
                        className="btn tiny danger"
                        onClick={() => {
                          const newProjects = skill.projects.filter((_, p) => p !== pIdx);
                          handleSkillChange(index, 'projects', newProjects);
                        }}
                      >×</button>
                    </div>
                  )) || null}
                  <button
                    type="button"
                    className="btn tiny"
                    onClick={() => {
                      const newProjects = [...(skill.projects || []), { name: '', url: '' }];
                      handleSkillChange(index, 'projects', newProjects);
                    }}
                  >+ Project</button>
                </div>
                
                <div className="form-group mini">
                  <label>GitHub Repos:</label>
                  {skill.repos?.map((repo, rIdx) => (
                    <div key={rIdx} className="mini-input-group">
                      <input
                        placeholder="Repo name"
                        value={repo.name || ''}
                        onChange={(e) => {
                          const newRepos = [...(skill.repos || [])];
                          newRepos[rIdx] = { ...newRepos[rIdx], name: e.target.value };
                          handleSkillChange(index, 'repos', newRepos);
                        }}
                      />
                      <input
                        placeholder="URL"
                        value={repo.url || ''}
                        onChange={(e) => {
                          const newRepos = [...(skill.repos || [])];
                          newRepos[rIdx] = { ...newRepos[rIdx], url: e.target.value };
                          handleSkillChange(index, 'repos', newRepos);
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Stars"
                        value={repo.stars || 0}
                        onChange={(e) => {
                          const newRepos = [...(skill.repos || [])];
                          newRepos[rIdx] = { ...newRepos[rIdx], stars: parseInt(e.target.value) || 0 };
                          handleSkillChange(index, 'repos', newRepos);
                        }}
                      />
                      <button
                        type="button"
                        className="btn tiny danger"
                        onClick={() => {
                          const newRepos = skill.repos.filter((_, r) => r !== rIdx);
                          handleSkillChange(index, 'repos', newRepos);
                        }}
                      >×</button>
                    </div>
                  )) || null}
                  <button
                    type="button"
                    className="btn tiny"
                    onClick={() => {
                      const newRepos = [...(skill.repos || []), { name: '', url: '', stars: 0 }];
                      handleSkillChange(index, 'repos', newRepos);
                    }}
                  >+ Repo</button>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="btn small danger"
              >
                Remove Skill
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSkill}
            className="btn small"
          >
            + Add Skill
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
