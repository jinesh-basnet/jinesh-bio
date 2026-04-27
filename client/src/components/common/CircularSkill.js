import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SkillModal from './SkillModal';
import './../../css/skill-radar.css';
const CircularSkill = ({ 
  name, 
  level, 
  icon, 
  category, 
  index, 
  description = '', 
  projects = [], 
  repos = [], 
  certifications = [],
  skills = [] // Pass all skills for radar context
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (level / 100) * circumference;
  const hasRichData = description || projects.length > 0 || repos.length > 0 || certifications.length > 0;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const tooltipContent = (
    <div className="skill-tooltip">
      <h4>{name}</h4>
      {description && <p>{description.substring(0, 100)}...</p>}
      <div className="tooltip-meta">
        <span>{level}% Proficiency</span>
        <span>{category}</span>
        {repos.length > 0 && <span>{repos.reduce((sum, r) => sum + (r.stars || 0), 0)}⭐ Total Stars</span>}
        {hasRichData && <span className="rich-indicator">📊 Details</span>}
      </div>
    </div>
  );

  return (
    <motion.div
      className="circular-skill-wrapper"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      viewport={{ once: true }}
      style={{ position: 'relative' }}
    >
      {/* Radar Chart (commented for optional advanced visual - works without) */}
      {/* 
      {skills && skills.length > 1 && (
        <div className="radar-container">
          <RadarChart 
            skills={skills} 
            activeCategory={category} 
            hoveredSkillIndex={index}
            chartSize={300}
          />
        </div>
      )}
      */}

      <motion.div
        className={`circular-skill-item ${isHovered ? 'hovered' : ''}`}
        whileHover={{
          scale: 1.15,
          y: -15,
          boxShadow: "0 25px 50px rgba(0, 123, 255, 0.4)",
          zIndex: 10
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={hasRichData ? openModal : undefined}
      >
        <div className="circular-skill-container">
          <svg width="140" height="140" viewBox="0 0 140 140" className="skill-svg">
            <defs>
              <radialGradient id={`glow-${index}`} cx="50%" cy="50%">
                <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.6">
                  <animate attributeName="stopOpacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
                </stop>
                <stop offset="70%" stopColor="var(--primary-color)" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0"/>
              </radialGradient>
            </defs>
            
            {isHovered && (
              <motion.circle
                cx="70"
                cy="70"
                r="65"
                fill="url(#glow-{index})"
                opacity={0.5}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="var(--glass-border)"
              strokeWidth="5"
              fill="transparent"
              opacity={isHovered ? 0.5 : 1}
            />
            
            <motion.circle
              cx="70"
              cy="70"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="5"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              fill="transparent"
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
              initial={{ strokeDashoffset: strokeDasharray }}
              whileInView={{ strokeDashoffset }}
              transition={{ duration: 1.8, ease: "easeOut", delay: index * 0.1 }}
              viewport={{ once: true }}
              animate={isHovered ? { strokeWidth: 6 } : { strokeWidth: 5 }}
            />
          </svg>
          
          <div className="skill-icon">
            <motion.span
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 20, repeat: Infinity }
              }}
            >
              {icon}
            </motion.span>
          </div>
          
          <motion.div 
            className="skill-percentage"
            animate={{ scale: isHovered ? 1.2 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {level}%
          </motion.div>
        </div>
        
        <div className="skill-info">
          <motion.span 
            className="skill-name"
            animate={{ color: isHovered ? 'var(--accent-color)' : 'inherit' }}
          >
            {name}
          </motion.span>
          <span className="skill-category">{category}</span>
        </div>

        {/* Hover Tooltip */}
        {isHovered && tooltipContent}
      </motion.div>

      {/* Click Modal */}
      <SkillModal 
        skill={{ 
          name, level, icon, category, description, 
          projects, repos, certifications 
        }}
        isOpen={showModal}
        onClose={closeModal}
      />
    </motion.div>
  );
};

export default CircularSkill;

