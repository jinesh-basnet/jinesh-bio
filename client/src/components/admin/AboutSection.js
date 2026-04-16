import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit } from 'react-icons/fa';
import AboutForm from './AboutForm';
import QuantumProfile3D from '../common/QuantumProfile3D';

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
            {about.profileImage || about.profile3D?.enabled ? (
              <div className="preview-image-container" style={{ 
                width: '200px', 
                height: '200px', 
                borderRadius: '15px', 
                border: '3px solid var(--primary-color)', 
                overflow: 'hidden',
                background: 'var(--dark-bg)',
                position: 'relative'
              }}>
                {about.profile3D?.enabled ? (
                  <QuantumProfile3D 
                    profileImage={about.profileImage}
                    profile3D={about.profile3D}
                    skills={about.skills || []}
                    className="admin-preview-3d"
                  />
                ) : (
                  <img
                    src={about.profileImage}
                    alt="Profile"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
                {about.profile3D?.enabled && (
                  <div style={{ position: 'absolute', top: 5, right: 5, background: 'var(--primary-color)', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem', zIndex: 10 }}>
                    3D Active
                  </div>
                )}
              </div>
            ) : null}
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

