import React from 'react';
import { motion } from 'framer-motion';

const CircularSkill = ({ name, level, icon, category, index }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (level / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.05,
        y: -10,
        boxShadow: "var(--shadow-lg)",
      }}
      whileTap={{ scale: 0.95 }}
      className="circular-skill-item"
    >
      <div className="circular-skill-container">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="var(--glass-border)"
            strokeWidth="6"
            fill="transparent"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke="var(--primary-color)"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: strokeDasharray }}
            whileInView={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + index * 0.1 }}
            viewport={{ once: true }}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="skill-icon">
          <motion.span
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 5 + index,
            }}
          >
            {icon}
          </motion.span>
        </div>
        <div className="skill-percentage">{level}%</div>
      </div>
      <div className="skill-info">
        <span className="skill-name">{name}</span>
        {category && <span className="skill-category">{category}</span>}
      </div>
    </motion.div>
  );
};

export default CircularSkill;
