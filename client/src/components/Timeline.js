import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaGraduationCap, FaCertificate, FaSpinner, FaHeart, FaTrophy } from 'react-icons/fa';

const Timeline = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await fetch('/api/timeline');
        if (!response.ok) {
          throw new Error('Failed to fetch timeline data');
        }
        const data = await response.json();
        setTimelineData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching timeline:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'work':
        return <FaBriefcase />;
      case 'education':
        return <FaGraduationCap />;
      case 'certification':
        return <FaCertificate />;
      case 'life':
        return <FaHeart />;
      case 'achievement':
        return <FaTrophy />;
      default:
        return <FaBriefcase />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'work':
        return 'var(--primary-color)';
      case 'education':
        return 'var(--secondary-color)';
      case 'certification':
        return 'var(--accent-color)';
      case 'life':
        return '#f94b8e'; // Pinkish for life/personal
      case 'achievement':
        return '#ffb100'; // Golden for achievement
      default:
        return 'var(--primary-color)';
    }
  };

  if (loading) {
    return (
      <section className="timeline-section" id="timeline">
        <div className="container">
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Loading timeline...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="timeline-section" id="timeline">
        <div className="container">
          <div className="error-container">
            <p>Error loading timeline: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="timeline-section" id="timeline">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="timeline-header"
        >
          <h2>My Journey</h2>
          <p>A timeline of my life, professional, and educational milestones</p>
        </motion.div>

        <div className="timeline-container">
          {timelineData.map((item, index) => (
            <motion.div
              key={item._id || item.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            >
              <div className="timeline-content">
                <div
                  className="timeline-icon"
                  style={{ backgroundColor: getTypeColor(item.type) }}
                >
                  {getTypeIcon(item.type)}
                </div>

                <div className="timeline-card">
                  {item.image && (
                    <motion.div
                      className="timeline-image-wrapper"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="timeline-image"
                      />
                    </motion.div>
                  )}
                  <div className="timeline-period">{item.period}</div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <div className="timeline-company">
                    <span className="company-name">{item.company}</span>
                    <span className="company-location">{item.location}</span>
                  </div>

                  <p className="timeline-description">{item.description}</p>

                  <div className="timeline-technologies">
                    {item.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        className="tech-tag"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: (index * 0.2) + (techIndex * 0.1) }}
                        viewport={{ once: true }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="timeline-connector">
                <div
                  className="timeline-dot"
                  style={{ backgroundColor: getTypeColor(item.type) }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
