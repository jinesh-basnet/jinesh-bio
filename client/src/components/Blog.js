import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaArrowRight, FaSearch, FaFeatherAlt, FaBookmark } from 'react-icons/fa';
import '../css/blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (!response.ok) throw new Error('Failed to fetch blog posts');
        const data = await response.json();
        // Filter only published blogs for the public view
        const publishedBlogs = data.filter(blog => blog.published);
        setBlogs(publishedBlogs);
        setFilteredBlogs(publishedBlogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, selectedCategory]);

  const categories = ['All', ...new Set(blogs.map(blog => blog.category).filter(Boolean))];

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const featuredPost = blogs.find(blog => blog.featured) || blogs[0];
  const regularPosts = filteredBlogs.filter(blog => blog._id !== featuredPost?._id);

  if (loading) {
    return (
      <section className="blog-section" id="blog">
        <div className="container">
          <div className="blog-loader">
            <div className="pulse-dot"></div>
            <p>Curating stories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-section" id="blog">
      <div className="container">
        <header className="blog-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-badge"
          >
            Insights & Thoughts
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Blog <span className="highlight">Archive</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-subtitle"
          >
            Exploring the intersection of code, design, and digital innovation through deep dives and quick tips.
          </motion.p>
        </header>

        {/* Featured Post Area */}
        {featuredPost && selectedCategory === 'All' && !searchTerm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="featured-post-container"
          >
            <div className="featured-post-card">
              <div className="featured-image-wrapper">
                {featuredPost.featuredImage ? (
                  <img src={featuredPost.featuredImage} alt={featuredPost.title} />
                ) : (
                  <div className="featured-image-fallback">
                    <FaFeatherAlt />
                  </div>
                )}
                <div className="featured-tag">Featured Insight</div>
              </div>
              <div className="featured-post-info">
                <div className="post-meta-top">
                  <span className="post-category">{featuredPost.category}</span>
                  <span className="post-dot"></span>
                  <span className="post-read-time">{calculateReadTime(featuredPost.content)} min read</span>
                </div>
                <h3>{featuredPost.title}</h3>
                <p>{featuredPost.excerpt || featuredPost.content.substring(0, 150) + '...'}</p>
                <div className="post-meta-bottom">
                  <div className="author-info">
                    <div className="author-avatar">{featuredPost.author?.charAt(0)}</div>
                    <span>{featuredPost.author || 'Admin'}</span>
                  </div>
                  <span className="post-date">{formatDate(featuredPost.publishedAt || featuredPost.createdAt)}</span>
                </div>
                <a href={`/blog/${featuredPost.slug}`} className="read-more-btn">
                  Read Full Story <FaArrowRight />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        <div className="blog-controls">
          <div className="search-wrapper">
            <FaSearch />
            <input
              type="text"
              placeholder="Search articles, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-scroll">
            {categories.map(cat => (
              <button
                key={cat}
                className={selectedCategory === cat ? 'active' : ''}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="blog-grid">
          <AnimatePresence mode='popLayout'>
            {regularPosts.map((post, index) => (
              <motion.article
                layout
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="blog-card"
              >
                <div className="card-image">
                  {post.featuredImage ? (
                    <img src={post.featuredImage} alt={post.title} />
                  ) : (
                    <div className="card-image-fallback">
                      <FaFeatherAlt />
                    </div>
                  )}
                  <button className="bookmark-btn"><FaBookmark /></button>
                </div>
                <div className="card-body">
                  <div className="card-meta">
                    <span className="card-category">{post.category}</span>
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt || post.content.substring(0, 100) + '...'}</p>
                  <div className="card-footer">
                    <span className="read-time"><FaClock /> {calculateReadTime(post.content)} min</span>
                    <a href={`/blog/${post.slug}`} className="card-link">
                      Learn More <FaArrowRight />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredBlogs.length === 0 && (
          <div className="no-blogs">
            <p>No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
