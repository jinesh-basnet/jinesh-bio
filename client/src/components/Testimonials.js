import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaStar, FaQuoteLeft, FaBuilding, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../css/testimonials.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    message: '',
    rating: 5,
    image: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setShowForm(false);
        setFormData({
          name: '',
          role: '',
          company: '',
          message: '',
          rating: 5,
          image: ''
        });
      } else {
        toast.error(data.error || 'Failed to submit testimonial');
      }
    } catch (error) {
      toast.error('Connection error. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return null;

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="testimonials-header"
        >
          <span className="section-badge">Client Trust</span>
          <h2>Professional <span className="highlight">Endorsements</span></h2>
          <p>Collaborating with industry leaders to build meaningful digital experiences.</p>
        </motion.div>

        {testimonials.length > 0 && (
          <div className="testimonials-main">
            <div className="testimonials-visual">
              <div className="quote-icon-bg">
                <FaQuoteLeft />
              </div>
              <div className="client-display">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="avatar-wrapper"
                  >
                    {testimonials[currentIndex].image ? (
                      <img src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {testimonials[currentIndex].name?.charAt(0)}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="testimonials-content-box">
              <div className="nav-controls top">
                <button className="nav-arrow prev" onClick={prevTestimonial}><FaChevronLeft /></button>
                <button className="nav-arrow next" onClick={nextTestimonial}><FaChevronRight /></button>
              </div>

              <div className="testimonial-body">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < testimonials[currentIndex].rating ? "star active" : "star"} />
                      ))}
                    </div>

                    <blockquote className="message">
                      "{testimonials[currentIndex].message}"
                    </blockquote>

                    <div className="client-meta">
                      <h4>{testimonials[currentIndex].name}</h4>
                      <div className="client-role">
                        <span className="role">{testimonials[currentIndex].role}</span>
                        {testimonials[currentIndex].company && (
                          <>
                            <span className="sep">•</span>
                            <span className="company"><FaBuilding /> {testimonials[currentIndex].company}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="testimonials-footer">
                <div className="pagination-dots">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentIndex ? 'active' : ''}`}
                      onClick={() => goToTestimonial(index)}
                    />
                  ))}
                </div>

                <button
                  className={`autoplay-btn ${isAutoPlaying ? 'active' : ''}`}
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                >
                  {isAutoPlaying ? 'PAUSED' : 'AUTO-PLAY'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="testimonial-cta">
          <p>Worked with me before?</p>
          <button className="btn outline" onClick={() => setShowForm(true)}>
            <FaPaperPlane /> Share Your Experience
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <div className="modal-overlay">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="testimonial-modal"
              >
                <button className="close-modal" onClick={() => setShowForm(false)}>
                  <FaTimes />
                </button>
                <h3>Share Your <span className="highlight">Feedback</span></h3>
                <p>Your endorsement helps me grow and motivates me to deliver excellence.</p>

                <form onSubmit={handleSubmit} className="testimonial-submission-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="jinesh basnet"
                      />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <input
                        type="text"
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleInputChange}
                        placeholder=" CTO / Product Manager"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Company (Optional)</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder=" Tech Solutions"
                      />
                    </div>
                    <div className="form-group">
                      <label>Profile Image URL (Optional)</label>
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Rating</label>
                    <div className="rating-input">
                      {[1, 2, 3, 4, 5].map(star => (
                        <FaStar
                          key={star}
                          className={star <= formData.rating ? 'star active' : 'star'}
                          onClick={() => handleRatingChange(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Your Message *</label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="What was it like working with me?"
                      rows="4"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn primary submit-btn" disabled={submitLoading}>
                    {submitLoading ? 'Submitting...' : <><FaPaperPlane /> Submit Feedback</>}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Testimonials;
