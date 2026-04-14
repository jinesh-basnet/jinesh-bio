import React from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes } from 'react-icons/fa';

const AboutForm = ({ item, isNew, onChange, onSave, onCancel, validationErrors = {}, loading }) => {
const handleInputChange = (field, value) => {
    if (field === 'profile3D') {
      onChange({ 
        ...item, 
        profile3D: value 
      });
    } else {
      onChange({ ...item, [field]: value });
    }
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

      {/* 3D Profile Settings */}
      <div className="form-group">
        <label>🌐 3D Profile Orb Settings</label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={item.profile3D?.enabled || false}
            onChange={(e) => handleInputChange('profile3D', { ...item.profile3D, enabled: e.target.checked })}
          />
          Enable 3D Quantum Profile Orb
        </label>
        <div className="form-row">
          <div>
            <label>Orb Color:</label>
            <input
              type="color"
              value={item.profile3D?.orbColor || '#007BFF'}
              onChange={(e) => handleInputChange('profile3D', { ...item.profile3D, orbColor: e.target.value })}
            />
          </div>
          <div>
            <label>Ring Color:</label>
            <input
              type="color"
              value={item.profile3D?.ringColor || '#00F2FF'}
              onChange={(e) => handleInputChange('profile3D', { ...item.profile3D, ringColor: e.target.value })}
            />
          </div>
          <div>
            <label>Gender:</label>
            <select
              value={item.profile3D?.gender || 'male'}
              onChange={(e) => handleInputChange('profile3D', { ...item.profile3D, gender: e.target.value })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label className="checkbox-label" style={{ margin: 0 }}>
              <input
                type="checkbox"
                checked={item.profile3D?.showRings !== false}
                onChange={(e) => handleInputChange('profile3D', { ...item.profile3D, showRings: e.target.checked })}
              />
              Show Skill Rings
            </label>
          </div>
          <div style={{ flex: 2 }}>
            <label>Particle Count (500-5000):</label>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={item.profile3D?.particleCount || 2000}
              onChange={(e) => handleInputChange('profile3D', { ...item.profile3D, particleCount: parseInt(e.target.value) })}
            />
            <span>{item.profile3D?.particleCount || 2000}</span>
          </div>
        </div>
        <div className="form-row">
          <div>
            <label>Particle Intensity (0-1):</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={item.profile3D?.particleIntensity || 0.8}
              onChange={(e) => handleInputChange('profile3D', { ...item.profile3D, particleIntensity: parseFloat(e.target.value) })}
            />
            <span>{(item.profile3D?.particleIntensity || 0.8).toFixed(1)}</span>
          </div>
          <div>
            <label>Distortion Strength (0-2):</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={item.profile3D?.distortionStrength || 1.0}
              onChange={(e) => handleInputChange('profile3D', { ...item.profile3D, distortionStrength: parseFloat(e.target.value) })}
            />
            <span>{(item.profile3D?.distortionStrength || 1.0).toFixed(1)}</span>
          </div>
        </div>
        <div className="form-row">
          <div>
            <label>Spin Speed (0-5):</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={item.profile3D?.spinSpeed || 1.0}
              onChange={(e) => handleInputChange('profile3D', { ...item.profile3D, spinSpeed: parseFloat(e.target.value) })}
            />
            <span>{(item.profile3D?.spinSpeed || 1.0).toFixed(1)}</span>
          </div>
          <div>
            <label>Bloom Intensity (0-2):</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={item.profile3D?.bloomIntensity || 1.0}
              onChange={(e) => handleInputChange('profile3D', { ...item.profile3D, bloomIntensity: parseFloat(e.target.value) })}
            />
            <span>{(item.profile3D?.bloomIntensity || 1.0).toFixed(1)}</span>
          </div>
        </div>
        <div className="form-row">
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label className="checkbox-label" style={{ margin: 0 }}>
              <input
                type="checkbox"
                checked={item.profile3D?.showTechOrbitals !== false}
                onChange={(e) => handleInputChange('profile3D', { ...item.profile3D, showTechOrbitals: e.target.checked })}
              />
              Show Tech Logos
            </label>
          </div>
          <div style={{ flex: 2 }}>
            <label>Tech Orbital Speed (0-3):</label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={item.profile3D?.techOrbitalSpeed || 1.0}
              onChange={(e) => handleInputChange('profile3D', { ...item.profile3D, techOrbitalSpeed: parseFloat(e.target.value) })}
            />
            <span>{(item.profile3D?.techOrbitalSpeed || 1.0).toFixed(1)}</span>
          </div>
        </div>
        <p className="help-text">✨ Customize the interactive 3D profile orb - glowing sphere with particles, mouse distortion, skill rings, and tech logos!</p>
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
