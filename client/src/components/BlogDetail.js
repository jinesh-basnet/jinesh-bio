import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTag, FaArrowLeft, FaClock, FaShareAlt, FaInstagram, FaFacebook } from 'react-icons/fa';
import '../css/blogDetail.css';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`/api/blogs/${slug}`);
                if (!response.ok) throw new Error('Article not found');
                const data = await response.json();
                setBlog(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="blog-detail-loading">
                <div className="loader"></div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="blog-detail-error">
                <h2>Article not found</h2>
                <Link to="/blog" className="back-btn"><FaArrowLeft /> Back to Blog</Link>
            </div>
        );
    }

    const calculateReadTime = (content) => {
        if (!content) return 1;
        const words = content.trim().split(/\s+/).length;
        return Math.ceil(words / 200);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="blog-detail-page"
        >
            <div className="blog-detail-hero" style={{ backgroundImage: `url(${blog.featuredImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80'})` }}>
                <div className="hero-overlay"></div>
                <div className="container">
                    <Link to="/blog" className="back-link">
                        <FaArrowLeft /> Back to Archive
                    </Link>
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="hero-content"
                    >
                        <span className="blog-category">{blog.category}</span>
                        <h1>{blog.title}</h1>
                        <div className="blog-meta">
                            <span className="meta-item"><FaUser /> {blog.author}</span>
                            <span className="meta-item"><FaCalendarAlt /> {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                            <span className="meta-item"><FaClock /> {calculateReadTime(blog.content)} min read</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container">
                <div className="blog-detail-content-wrapper">
                    <aside className="blog-sidebar">
                        <div className="sticky-sidebar">
                            <h4>Share</h4>
                            <div className="share-links">
                                <a href="https://www.facebook.com/jinesa.basneta" target="_blank" rel="noopener noreferrer" title="Facebook"><FaFacebook /></a>
                                <a href="https://www.instagram.com/jinesh112/?hl=en" target="_blank" rel="noopener noreferrer" title="Instagram"><FaInstagram /></a>
                                <button onClick={() => navigator.clipboard.writeText(window.location.href)} title="Copy Link" className="share-btn"><FaShareAlt /></button>
                            </div>

                            {blog.tags && blog.tags.length > 0 && (
                                <div className="blog-tags">
                                    <h4>Tags</h4>
                                    <div className="tags-list">
                                        {blog.tags.map(tag => (
                                            <span key={tag} className="tag-item"><FaTag /> {tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    <main className="blog-main-content">
                        <article className="blog-article-body">
                            {(blog.content || '').split('\n').map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </article>

                        <section className="author-box">
                            <div className="author-avatar">{blog.author?.charAt(0)}</div>
                            <div className="author-details">
                                <h5>Written by {blog.author}</h5>
                                <p>Full Stack Developer & Technical Writer passionate about explaining complex concepts simply.</p>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogDetail;
