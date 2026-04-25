import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit } from 'react-icons/fa';
import HomeForm from './HomeForm';
import AboutForm from './AboutForm';
import QuantumProfile3D from '../common/QuantumProfile3D';

const HomeSection = ({ home, about, loading, onSave, validationErrors }) => {
  const [editingItem, setEditingItem] = useState(null);

  const handleEditHome = () => {
    setEditingItem({ ...home, type: 'home' });
  };

  const handleEditAbout = () => {
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
      className="home-section"
    >
      <h3>Main Landing Sections</h3>
      {home ? (
        <div className="home-content">
          <div className="home-preview glass-card">
            <h4>1. Hero & Header Section</h4>
            <div className="preview-split">
              {home.hero?.profileImage && (
                <div className="preview-image-container">
                  <img src={home.hero.profileImage} alt="Hero Profile" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '15px', marginBottom: '1.5rem', border: '3px solid var(--primary-color)' }} />
                </div>
              )}
              <div className="preview-details">
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
              </div>
            </div>
            <div className="home-actions" style={{ marginTop: '1.5rem' }}>
              <button onClick={handleEditHome} className="btn primary" disabled={loading}>
                <FaEdit /> Edit Hero & Header
              </button>
            </div>
          </div>

          {about && (
            <div className="about-preview glass-card" style={{ marginTop: '2rem' }}>
              <h4>2. About & Profile Section</h4>
              <div className="preview-split">
                <div className="preview-image" style={{ width: '150px' }}>
                   {about.profile3D?.enabled ? (
                    <div style={{ height: '150px' }}>
                       <QuantumProfile3D 
                        profileImage={about.profileImage}
                        profile3D={about.profile3D}
                        skills={about.skills || []}
                      />
                    </div>
                  ) : (
                    <img src={about.profileImage} alt="About Profile" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '15px' }} />
                  )}
                </div>
                <div className="preview-details">
                   <p><strong>Bio Lead:</strong> {about.description?.substring(0, 150)}...</p>
                   <p><strong>Professional Experience:</strong> {about.experience} Years</p>
                </div>
              </div>
              <div className="about-actions" style={{ marginTop: '1.5rem' }}>
                <button onClick={handleEditAbout} className="btn primary" disabled={loading}>
                  <FaEdit /> Edit About & Bio
                </button>
              </div>
            </div>
          )}

          <div className="skills-preview glass-card" style={{ marginTop: '2rem' }}>
            <h4>3. Technical Arsenal (Skills)</h4>
            <p><strong>Main Title:</strong> {home.skills?.title}</p>
            <div className="skills-grid-preview" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
              {home.skills?.skillsList?.map((skill, index) => (
                <span key={index} className="skill-tag" style={{ background: 'var(--primary-color)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                  {skill.name} ({skill.level}%)
                </span>
              ))}
            </div>
            <div className="skills-actions" style={{ marginTop: '1.5rem' }}>
               <button onClick={handleEditHome} className="btn primary" disabled={loading}>
                <FaEdit /> Manage Skills List
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading landing page content...</p>
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

export default HomeSection;
