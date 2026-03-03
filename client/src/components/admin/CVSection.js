import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaFileDownload, FaPalette } from 'react-icons/fa';
import CVSettingsForm from './CVSettingsForm';
import '../../css/cv-section.css';

const CVSection = ({ about, loading, onSave, validationErrors }) => {
    const [editingCV, setEditingCV] = useState(null);

    const handleEditCV = () => {
        setEditingCV({ ...about, type: 'about' });
    };

    const handleSaveCV = async () => {
        await onSave(editingCV);
        setEditingCV(null);
    };

    const handleDownloadCV = () => {
        window.open('/api/download-cv', '_blank');
    };

    const cvSettings = about?.cvSettings || {};
    const certCount = about?.certifications?.length || 0;
    const langCount = about?.languages?.length || 0;
    const hobbyCount = about?.hobbies?.length || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cv-section"
        >
            <div className="section-header">
                <h3><FaPalette /> CV/Resume Settings</h3>
                <button onClick={handleDownloadCV} className="btn secondary small">
                    <FaFileDownload /> Preview CV
                </button>
            </div>

            {about ? (
                <div className="cv-content">
                    <div className="cv-overview">
                        <div className="cv-theme-preview">
                            <h4>Current Configuration</h4>
                            <div className="theme-display">
                                <div className={`theme-badge theme-${cvSettings.colorTheme || 'blue'}`}>
                                    {(cvSettings.colorTheme || 'blue').toUpperCase()}
                                </div>
                                <p className="theme-description">
                                    {cvSettings.colorTheme === 'blue' && 'Professional & Corporate'}
                                    {cvSettings.colorTheme === 'green' && 'Fresh & Environmental'}
                                    {cvSettings.colorTheme === 'purple' && 'Creative & Innovative'}
                                    {cvSettings.colorTheme === 'red' && 'Bold & Dynamic'}
                                    {cvSettings.colorTheme === 'dark' && 'Elegant & Executive'}
                                    {!cvSettings.colorTheme && 'Professional & Corporate'}
                                </p>
                            </div>
                        </div>

                        <div className="cv-stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📜</div>
                                <div className="stat-info">
                                    <span className="stat-value">{certCount}</span>
                                    <span className="stat-label">Certifications</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">🌍</div>
                                <div className="stat-info">
                                    <span className="stat-value">{langCount}</span>
                                    <span className="stat-label">Languages</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-info">
                                    <span className="stat-value">{hobbyCount}</span>
                                    <span className="stat-label">Hobbies</span>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-info">
                                    <span className="stat-value">{cvSettings.maxProjects || 3}</span>
                                    <span className="stat-label">Max Projects</span>
                                </div>
                            </div>
                        </div>

                        <div className="cv-sections-status">
                            <h5>Included Sections</h5>
                            <div className="sections-list">
                                <div className={`section-item ${cvSettings.includePhoto !== false ? 'active' : 'inactive'}`}>
                                    {cvSettings.includePhoto !== false ? '✅' : '❌'} Profile Photo
                                </div>
                                <div className={`section-item ${cvSettings.includeProjects !== false ? 'active' : 'inactive'}`}>
                                    {cvSettings.includeProjects !== false ? '✅' : '❌'} Projects
                                </div>
                                <div className={`section-item ${cvSettings.includeTestimonials ? 'active' : 'inactive'}`}>
                                    {cvSettings.includeTestimonials ? '✅' : '❌'} Testimonials
                                </div>
                                <div className={`section-item ${cvSettings.includeCertifications !== false ? 'active' : 'inactive'}`}>
                                    {cvSettings.includeCertifications !== false ? '✅' : '❌'} Certifications
                                </div>
                                <div className={`section-item ${cvSettings.includeLanguages !== false ? 'active' : 'inactive'}`}>
                                    {cvSettings.includeLanguages !== false ? '✅' : '❌'} Languages
                                </div>
                                <div className={`section-item ${cvSettings.includeHobbies ? 'active' : 'inactive'}`}>
                                    {cvSettings.includeHobbies ? '✅' : '❌'} Hobbies & Interests
                                </div>
                            </div>
                        </div>

                        {certCount > 0 && (
                            <div className="cv-certifications-preview">
                                <h5>Recent Certifications</h5>
                                <div className="cert-list">
                                    {about.certifications.slice(0, 3).map((cert, index) => (
                                        <div key={index} className="cert-item">
                                            <strong>{cert.name}</strong>
                                            <span>{cert.issuer} - {cert.date}</span>
                                        </div>
                                    ))}
                                    {certCount > 3 && <p className="more-items">+{certCount - 3} more</p>}
                                </div>
                            </div>
                        )}

                        {langCount > 0 && (
                            <div className="cv-languages-preview">
                                <h5>Languages</h5>
                                <div className="lang-list">
                                    {about.languages.map((lang, index) => (
                                        <div key={index} className="lang-item">
                                            <strong>{lang.name}</strong>
                                            <span className="proficiency-badge">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="cv-actions">
                        <button onClick={handleEditCV} className="btn primary" disabled={loading}>
                            <FaEdit /> Configure CV Settings
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading CV settings...</p>
            )}

            {editingCV && editingCV.type === 'about' && (
                <CVSettingsForm
                    about={editingCV}
                    onChange={setEditingCV}
                    onSave={handleSaveCV}
                    onCancel={() => setEditingCV(null)}
                    loading={loading}
                />
            )}
        </motion.div>
    );
};

export default CVSection;
