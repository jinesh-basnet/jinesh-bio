import React from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaTimes, FaEye } from 'react-icons/fa';

const CVSettingsForm = ({ about, onChange, onSave, onCancel, loading }) => {

    const handleCVSettingChange = (field, value) => {
        onChange({
            ...about,
            cvSettings: { ...about.cvSettings, [field]: value }
        });
    };

    const handleCertificationChange = (index, field, value) => {
        const newCerts = [...(about.certifications || [])];
        newCerts[index] = { ...newCerts[index], [field]: value };
        onChange({ ...about, certifications: newCerts });
    };

    const addCertification = () => {
        const newCerts = [...(about.certifications || []), { name: '', issuer: '', date: '', url: '' }];
        onChange({ ...about, certifications: newCerts });
    };

    const removeCertification = (index) => {
        const newCerts = about.certifications.filter((_, i) => i !== index);
        onChange({ ...about, certifications: newCerts });
    };

    const handleLanguageChange = (index, field, value) => {
        const newLangs = [...(about.languages || [])];
        newLangs[index] = { ...newLangs[index], [field]: value };
        onChange({ ...about, languages: newLangs });
    };

    const addLanguage = () => {
        const newLangs = [...(about.languages || []), { name: '', proficiency: 'Professional' }];
        onChange({ ...about, languages: newLangs });
    };

    const removeLanguage = (index) => {
        const newLangs = about.languages.filter((_, i) => i !== index);
        onChange({ ...about, languages: newLangs });
    };

    const handleHobbyChange = (index, value) => {
        const newHobbies = [...(about.hobbies || [])];
        newHobbies[index] = value;
        onChange({ ...about, hobbies: newHobbies });
    };

    const addHobby = () => {
        const newHobbies = [...(about.hobbies || []), ''];
        onChange({ ...about, hobbies: newHobbies });
    };

    const removeHobby = (index) => {
        const newHobbies = about.hobbies.filter((_, i) => i !== index);
        onChange({ ...about, hobbies: newHobbies });
    };

    const handlePreviewCV = () => {
        window.open('/api/download-cv', '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="admin-form cv-settings-form"
        >
            <h3>CV/Resume Settings</h3>

            <div className="form-section">
                <h4>CV Customization</h4>

                <div className="form-group">
                    <label>Color Theme:</label>
                    <select
                        value={about.cvSettings?.colorTheme || 'blue'}
                        onChange={(e) => handleCVSettingChange('colorTheme', e.target.value)}
                    >
                        <option value="blue">Blue (Professional)</option>
                        <option value="green">Green (Fresh)</option>
                        <option value="purple">Purple (Creative)</option>
                        <option value="red">Red (Bold)</option>
                        <option value="dark">Dark (Elegant)</option>
                    </select>
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={about.cvSettings?.includePhoto !== false}
                            onChange={(e) => handleCVSettingChange('includePhoto', e.target.checked)}
                        />
                        Include Profile Photo
                    </label>
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={about.cvSettings?.includeProjects !== false}
                            onChange={(e) => handleCVSettingChange('includeProjects', e.target.checked)}
                        />
                        Include Projects
                    </label>
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={about.cvSettings?.includeTestimonials || false}
                            onChange={(e) => handleCVSettingChange('includeTestimonials', e.target.checked)}
                        />
                        Include Testimonials
                    </label>
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={about.cvSettings?.includeCertifications !== false}
                            onChange={(e) => handleCVSettingChange('includeCertifications', e.target.checked)}
                        />
                        Include Certifications
                    </label>
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={about.cvSettings?.includeLanguages !== false}
                            onChange={(e) => handleCVSettingChange('includeLanguages', e.target.checked)}
                        />
                        Include Languages
                    </label>
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={about.cvSettings?.includeHobbies || false}
                            onChange={(e) => handleCVSettingChange('includeHobbies', e.target.checked)}
                        />
                        Include Hobbies & Interests
                    </label>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Max Projects to Show:</label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={about.cvSettings?.maxProjects || 3}
                            onChange={(e) => handleCVSettingChange('maxProjects', parseInt(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label>Max Experience Entries:</label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={about.cvSettings?.maxExperience || 5}
                            onChange={(e) => handleCVSettingChange('maxExperience', parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h4>Certifications</h4>
                {about.certifications?.map((cert, index) => (
                    <div key={index} className="cert-input-group">
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Certification Name"
                                    value={cert.name || ''}
                                    onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Issuer"
                                    value={cert.issuer || ''}
                                    onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Date (e.g., Jan 2024)"
                                    value={cert.date || ''}
                                    onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="url"
                                    placeholder="Certificate URL (optional)"
                                    value={cert.url || ''}
                                    onChange={(e) => handleCertificationChange(index, 'url', e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="btn small danger"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addCertification} className="btn small">
                    Add Certification
                </button>
            </div>

            <div className="form-section">
                <h4>Languages</h4>
                {about.languages?.map((lang, index) => (
                    <div key={index} className="lang-input-group">
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Language"
                                    value={lang.name || ''}
                                    onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <select
                                    value={lang.proficiency || 'Professional'}
                                    onChange={(e) => handleLanguageChange(index, 'proficiency', e.target.value)}
                                >
                                    <option value="Native">Native</option>
                                    <option value="Fluent">Fluent</option>
                                    <option value="Professional">Professional</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Basic">Basic</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeLanguage(index)}
                                className="btn small danger"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addLanguage} className="btn small">
                    Add Language
                </button>
            </div>

            <div className="form-section">
                <h4>Hobbies & Interests</h4>
                {about.hobbies?.map((hobby, index) => (
                    <div key={index} className="hobby-input-group">
                        <input
                            type="text"
                            placeholder="Hobby or Interest"
                            value={hobby || ''}
                            onChange={(e) => handleHobbyChange(index, e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => removeHobby(index)}
                            className="btn small danger"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addHobby} className="btn small">
                    Add Hobby
                </button>
            </div>

            <div className="form-actions">
                <button onClick={handlePreviewCV} className="btn secondary" type="button">
                    <FaEye /> Preview CV
                </button>
                <button onClick={onSave} className="btn primary" disabled={loading}>
                    <FaSave /> Save Settings
                </button>
                <button onClick={onCancel} className="btn secondary">
                    <FaTimes /> Cancel
                </button>
            </div>
        </motion.div>
    );
};

export default CVSettingsForm;
