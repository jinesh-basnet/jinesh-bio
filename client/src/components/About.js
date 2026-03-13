import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Timeline from './Timeline';
import CircularSkill from './CircularSkill';
import '../css/about.css';
import {
  FaJs,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaHtml5,
  FaCss3,
  FaPython,
  FaGit,
  FaRocket,
  FaCode,
  FaLightbulb,
  FaAward,
  FaArrowRight,
  FaDownload
} from 'react-icons/fa';
import { Tilt } from 'react-tilt';

const About = () => {
  const navigate = useNavigate();
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch('/api/about');
        if (response.ok) {
          const data = await response.json();
          setAboutData(data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
      }
    };

    fetchAbout();
  }, []);

  const defaultSkills = [
    { name: 'JavaScript', level: 90, icon: <FaJs />, category: 'Frontend' },
    { name: 'React', level: 85, icon: <FaReact />, category: 'Frontend' },
    { name: 'Node.js', level: 80, icon: <FaNodeJs />, category: 'Backend' },
    { name: 'MongoDB', level: 70, icon: <FaDatabase />, category: 'Database' },
    { name: 'HTML/CSS', level: 95, icon: <FaHtml5 />, secondaryIcon: <FaCss3 />, category: 'Frontend' },
    { name: 'Python', level: 75, icon: <FaPython />, category: 'Languages' },
    { name: 'Git', level: 85, icon: <FaGit />, category: 'Tools' }
  ];

  const achievements = [
    { icon: <FaRocket />, label: 'Years Experience', value: '3+' },
    { icon: <FaCode />, label: 'Projects Completed', value: '15+' },
    { icon: <FaLightbulb />, label: 'Technologies', value: '8+' },
    { icon: <FaAward />, label: 'Client Satisfaction', value: '100%' }
  ];

  const getSkillIcon = (name) => {
    const icons = {
      'JavaScript': <FaJs />,
      'React': <FaReact />,
      'Node.js': <FaNodeJs />,
      'MongoDB': <FaDatabase />,
      'HTML/CSS': <FaHtml5 />,
      'Python': <FaPython />,
      'Git': <FaGit />,
      'TypeScript': <FaJs />, 
      'Express': <FaNodeJs />, 
    };
    return icons[name] || <FaCode />;
  };

  const skillsToDisplay = aboutData?.skills?.length > 0
    ? aboutData.skills.map(s => ({ ...s, icon: getSkillIcon(s.name) }))
    : defaultSkills;

  return (
    <section className="about-section" id="about">
      <div className="about-background">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="about-wrapper"
        >
          <header className="about-header">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="about-subtitle"
            >
              Get To Know Me
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="about-title"
            >
              Building Digital <span className="highlight">Masterpieces</span>
            </motion.h2>
          </header>

          <div className="about-grid">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="about-left"
            >
              <div className="profile-container">
                <div className="profile-glass">
                  <Tilt options={{ max: 25, scale: 1.05, speed: 1000 }}>
                    <motion.div 
                      className="profile-img-wrapper"
                      initial={{ scale: 0.9 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 1 }}
                    >
                      {aboutData?.profileImage ? (
                        <img src={aboutData.profileImage} alt="Profile" />
                      ) : (
                        <div className="profile-placeholder">
                          <span className="emoji">👨‍💻</span>
                        </div>
                      )}
                    </motion.div>
                  </Tilt>
                </div>
                <motion.div 
                  className="decor-circle"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                ></motion.div>
                <motion.div 
                  className="decor-dots"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                ></motion.div>
              </div>

              <div className="experience-badge">
                <span className="years">{String(aboutData?.experience || 3).padStart(2, '0')}</span>
                <span className="text">Years Of <br /> Experience</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="about-right"
            >
              <div className="about-bio">
                <h3 className="section-subtitle">Who am I?</h3>
                <p className="bio-lead">
                  {aboutData?.description || "I'm a passionate full-stack developer with over 3 years of experience creating innovative web applications."}
                </p>
              </div>

              <div className="achievements-mini-grid">
                {achievements.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="achieve-card"
                  >
                    <div className="achieve-icon">{item.icon}</div>
                    <div className="achieve-info">
                      <span className="achieve-value">{item.value}</span>
                      <span className="achieve-label">{item.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="about-actions">
                <motion.button
                  className="btn-premium"
                  onClick={() => navigate('/contact')}
                >
                  Work With Me <FaArrowRight />
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  className="btn-secondary"
                  href="/api/download-cv"
                  download="Resume.pdf"
                >
                  <FaDownload /> Download CV
                </motion.a>
              </div>
            </motion.div>
          </div>

          <div className="about-skills">
            <div className="skills-header">
              <h3>Technical Arsenal</h3>
              <p>Harnessing the power of modern industry standards</p>
            </div>
            <div className="skills-container">
              {skillsToDisplay.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CircularSkill
                    name={skill.name}
                    level={skill.level}
                    icon={skill.icon}
                    category={skill.category}
                    index={index}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <Timeline />
    </section>
  );
};

export default About;

