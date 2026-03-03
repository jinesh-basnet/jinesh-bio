import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit } from 'react-icons/fa';
import AboutForm from './AboutForm';

const AboutSection = ({ about, loading, onSave, validationErrors }) => {
  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = () => {
    setEditingItem({ ...about, type: 'about' });
  };

  const handleSave = async () => {
    await onSave(editingItem);
    setEditingItem(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="about-section"
    >
      <h3>About Section</h3>
      {about ? (
        <div className="about-content">
          <div className="about-preview">
            {about.profileImage && (
              <div className="preview-image-container">
                <img
                  src={about.profileImage}
                  alt="Profile"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '15px',
                    marginBottom: '1.5rem',
                    border: '3px solid var(--primary-color)'
                  }}
                />
              </div>
            )}
            <h4>{about.title}</h4>
            <p>{about.description}</p>

            {about.email && <p><strong>Email:</strong> {about.email}</p>}
            {about.phone && <p><strong>Phone:</strong> {about.phone}</p>}
            {about.location && <p><strong>Location:</strong> {about.location}</p>}

            <div className="skills-preview">
              <h5>Skills:</h5>
              <div className="skills-list">
                {about.skills?.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill.name} ({skill.level}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="about-actions">
            <button onClick={handleEdit} className="btn primary" disabled={loading}>
              <FaEdit /> Edit About
            </button>
          </div>
        </div>
      ) : (
        <p>Loading about content...</p>
      )}

      {editingItem && editingItem.type === 'about' && (
        <AboutForm
          item={editingItem}
          isNew={false}
          onChange={setEditingItem}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
          validationErrors={validationErrors}
          loading={loading}
        />
      )}
    </motion.div>
  );
};

export default AboutSection;

