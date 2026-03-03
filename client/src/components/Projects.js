import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaTimes, FaSearch, FaStar, FaCode, FaRocket, FaArrowRight } from 'react-icons/fa';
import '../css/projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedLanguage !== 'All') {
      filtered = filtered.filter(p => p.language === selectedLanguage);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedLanguage]);

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const regularProjects = filteredProjects.filter(p => !p.featured);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  if (loading) {
    return (
      <section className="projects-section" id="projects">
        <div className="container">
          <div className="loading-state">
            <div className="loader"></div>
            <p>Gathering masterpieces...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="projects-section" id="projects">
      <div className="container">
        {/* Header Section */}
        <header className="projects-header">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-badge"
          >
            My Portfolio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Selected <span className="highlight">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-subtitle"
          >
            A curated collection of projects where I've pushed the boundaries of web development and design.
          </motion.p>
        </header>

        <div className="projects-controls">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {['All', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'].map(lang => (
              <button
                key={lang}
                className={selectedLanguage === lang ? 'active' : ''}
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {featuredProjects.length > 0 && (
          <div className="featured-grid">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="featured-card"
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-preview">
                  {project.image ? (
                    <img src={project.image} alt={project.name} />
                  ) : (
                    <div className="preview-fallback">
                      <FaCode />
                    </div>
                  )}
                  <div className="card-badge featured">
                    <FaStar /> Featured
                  </div>
                </div>
                <div className="project-info">
                  <div className="info-header">
                    <span className="project-lang">{project.language}</span>
                    <span className="project-stars">⭐ {project.stargazers_count}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="project-links">
                    <a href={project.html_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <FaGithub /> Source
                    </a>
                    {project.homepage && (
                      <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="demo" onClick={(e) => e.stopPropagation()}>
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="projects-grid">
          <AnimatePresence mode='popLayout'>
            {regularProjects.map((project, index) => (
              <motion.div
                layout
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="project-card"
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-card-inner">
                  <div className="project-card-header">
                    <span className="lang-tag">{project.language}</span>
                    <FaCode />
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description?.substring(0, 100)}...</p>
                  <div className="project-card-footer">
                    <span>⭐ {project.stargazers_count}</span>
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="view-all-container"
        >
          <a href="https://github.com/jinesh-basnet" target="_blank" rel="noopener noreferrer" className="btn-vanta">
            Explore More on GitHub <FaArrowRight />
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="project-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="modal-box"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedProject(null)}>
                <FaTimes />
              </button>
              <div className="modal-content-grid">
                <div className="modal-visual">
                  {selectedProject.image ? (
                    <img src={selectedProject.image} alt={selectedProject.name} />
                  ) : (
                    <div className="modal-fallback">
                      <FaRocket />
                    </div>
                  )}
                </div>
                <div className="modal-details">
                  <span className="modal-tag">{selectedProject.language}</span>
                  <h2>{selectedProject.name}</h2>
                  <p>{selectedProject.description}</p>

                  <div className="modal-meta-grid">
                    <div className="meta-item">
                      <span className="label">Stars</span>
                      <span className="value">⭐ {selectedProject.stargazers_count}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Updated</span>
                      <span className="value">{formatDate(selectedProject.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <a href={selectedProject.html_url} target="_blank" rel="noopener noreferrer" className="btn-premium">
                      <FaGithub /> View Source
                    </a>
                    {selectedProject.homepage && (
                      <a href={selectedProject.homepage} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
