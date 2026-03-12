import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { Tilt } from 'react-tilt';
import CircularSkill from './CircularSkill';
import BIRDS from 'vanta/dist/vanta.birds.min';
import { FaRocket, FaCode, FaChartLine, FaArrowRight } from 'react-icons/fa';
import '../css/home.css';

if (typeof window !== 'undefined' && !window.THREE) {
  window.THREE = require('three');
}

const Home = () => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch('/api/home');
        if (response.ok) {
          const data = await response.json();
          setHomeData(data);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    try {
      if (!vantaEffect.current && window.THREE && vantaRef.current) {
        vantaEffect.current = BIRDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          backgroundColor: 0x0a0a0b,
          color1: 0x007bff,
          color2: 0x6c757d,
          birdSize: 1.50,
          wingSpan: 20.00,
          speedLimit: 4.00,
          separation: 50.00,
          alignment: 50.00,
          cohesion: 50.00,
          quantity: 3.00
        });
      }
    } catch (error) {
      console.warn('VANTA effect failed to initialize:', error);
    }

    return () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (error) {
          console.warn('Error destroying VANTA effect:', error);
        }
        vantaEffect.current = null;
      }
    };
  }, []);

  const hero = homeData?.hero || {
    heading: "Hi, I'm Jinesh Basnet",
    highlightText: "Jinesh Basnet",
    description: "I build robust, scalable, and visually stunning web applications that solve real-world problems.",
    typingTexts: ["Full Stack Developer", "MERN Expert", "UI/UX Designer", "Problem Solver"],
    buttons: [
      { text: "View Projects", link: "/projects", type: "primary" },
      { text: "Contact Me", link: "/contact", type: "secondary" }
    ]
  };

  const skills = homeData?.skills?.skillsList || [
    { name: 'React', icon: '⚛️', level: 90, category: 'Frontend' },
    { name: 'Node.js', icon: '🟢', level: 85, category: 'Backend' },
    { name: 'MongoDB', icon: '🍃', level: 80, category: 'Database' },
    { name: 'Express', icon: '🚀', level: 85, category: 'Backend' },
    { name: 'JavaScript', icon: '🟨', level: 95, category: 'Frontend' },
    { name: 'Python', icon: '🐍', level: 75, category: 'Backend' },
    { name: 'TypeScript', icon: '🔷', level: 80, category: 'Frontend' },
    { name: 'Git', icon: '📚', level: 85, category: 'Tools' },
  ];

  const categories = ['All', ...new Set(skills.map(s => s.category))];

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loader-orbit"></div>
        <p>Initializing Environment...</p>
      </div>
    );
  }

  const heroHeading = hero.heading || "Hi, I'm Jinesh Basnet";
  const highlightText = hero.highlightText || "Jinesh Basnet";
  
  // Cleanly split heading based on highlight text if possible
  let titleStart = heroHeading;
  let titleEnd = highlightText;
  
  if (heroHeading.includes(highlightText)) {
    titleStart = heroHeading.replace(highlightText, "").trim();
  } else {
    // Fallback to old behavior if highlight text isn't in heading
    const titleParts = heroHeading.split(" ");
    titleStart = titleParts.slice(0, -2).join(" ");
    titleEnd = titleParts.slice(-2).join(" ");
  }

  return (
    <main id="main-content">
      <section className="home-section" id="home" ref={vantaRef}>
        <div className="home-container">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="hero-content"
          >
            <div className="hero-badge">
              <span className="dot"></span>
              Available For New Projects
            </div>

            <h1 className="hero-title">
              {titleStart} <br />
              <span className="highlight">{titleEnd}</span>
            </h1>

            <div className="hero-subtitle">
              <TypeAnimation
                sequence={(hero.typingTexts || []).flatMap(text => [text, 2000])}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="typing-text"
              />
              <p>{hero.description}</p>
            </div>

            <div className="hero-buttons">
              {(hero.buttons || []).map((btn, idx) => (
                <Link
                  key={idx}
                  to={btn.link}
                  className={`btn-hero ${btn.type}`}
                >
                  {btn.text} {btn.type === 'primary' ? <FaArrowRight /> : <FaCode />}
                </Link>
              ))}
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">03+</span>
                <span className="stat-label">Years of Dev</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">15+</span>
                <span className="stat-label">Projects Done</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">10+</span>
                <span className="stat-label">Tech Stack</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hero-visual"
          >
            <Tilt options={{ max: 15, scale: 1.02, speed: 1000 }}>
              <div className="visual-main">
                <div className="main-circle">
                  {hero.profileImage ? (
                    <img src={hero.profileImage} alt="Profile" className="visual-img" />
                  ) : (
                    <span className="visual-emoji">👨‍💻</span>
                  )}
                </div>

                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="floating-card card-1"
                >
                  <div className="card-icon"><FaRocket /></div>
                  <div className="card-text">
                    <b>Fast Delivery</b>
                    <span>Optimized Code</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  className="floating-card card-2"
                >
                  <div className="card-icon"><FaCode /></div>
                  <div className="card-text">
                    <b>Clean Code</b>
                    <span>Scalable Arch</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ x: [0, 20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                  className="floating-card card-3"
                >
                  <div className="card-icon"><FaChartLine /></div>
                  <div className="card-text">
                    <b>High Perf</b>
                    <span>SEO Ready</span>
                  </div>
                </motion.div>
              </div>
            </Tilt>
          </motion.div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span>Scroll To Explore</span>
        </div>
      </section>

      <section className="skills-preview-home" id="skills">
        <div className="container">
          <header className="skills-header-home">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Mastered <span className="highlight">Technologies</span>
            </motion.h2>
            <p>A comprehensive overview of my technical expertise and tools</p>
          </header>

          <div className="skill-categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`skill-category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="skills-grid-home">
            <AnimatePresence mode='popLayout'>
              {skills
                .filter(skill => activeCategory === 'All' || skill.category === activeCategory)
                .map((skill, index) => (
                  <motion.div
                    layout
                    key={skill._id || skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
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
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
