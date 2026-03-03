import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit } from 'react-icons/fa';
import HomeForm from './HomeForm';

const HomeSection = ({ home, loading, onSave, validationErrors }) => {
  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = () => {
    setEditingItem({ ...home, type: 'home' });
  };

  const handleSave = async () => {
    await onSave(editingItem);
    setEditingItem(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="home-section"
    >
      <h3>Home Section</h3>
      {home ? (
        <div className="home-content">
          <div className="home-preview">
            <h4>Hero Section</h4>
            {home.hero?.profileImage && (
              <div className="preview-image-container">
                <img src={home.hero.profileImage} alt="Hero Profile" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '15px', marginBottom: '1.5rem', border: '3px solid var(--primary-color)' }} />
              </div>
            )}
            <p><strong>Heading:</strong> {home.hero?.heading}</p>
            <p><strong>Description:</strong> {home.hero?.description}</p>
            <div className="buttons-preview">
              <h5>Buttons:</h5>
              <div className="buttons-list">
                {home.hero?.buttons?.map((button, index) => (
                  <span key={index} className="button-tag">
                    {button.text} → {button.link}
                  </span>
                ))}
              </div>
            </div>
            <h4>Skills Section</h4>
            <p><strong>Title:</strong> {home.skills?.title}</p>
            <div className="skills-preview">
              <h5>Skills:</h5>
              <div className="skills-list">
                {home.skills?.skillsList?.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill.name} ({skill.level}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="home-actions">
            <button onClick={handleEdit} className="btn primary" disabled={loading}>
              <FaEdit /> Edit Home
            </button>
          </div>
        </div>
      ) : (
        <p>Loading home content...</p>
      )}

      {editingItem && editingItem.type === 'home' && (
        <HomeForm
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

export default HomeSection;
