const path = require('path');

// Load environment variables from .env file
// Required env variables:
// - PORT: Server port (default: 5000)
// - EMAIL_USER: Gmail address for sending emails
// - EMAIL_PASS: Gmail app password
// - RECIPIENT_EMAIL: Email address to receive contact form submissions
// - JWT_SECRET: Secret key for JWT token generation
const dotenvResult = require('dotenv').config({
  path: path.join(__dirname, '.env'),
  encoding: 'utf8',
  debug: process.env.NODE_ENV !== 'production',
  quiet: true
});

if (dotenvResult.error) {
  console.warn('⚠️  Warning: Failed to load .env file. Using default values or environment variables.');
  console.warn('⚠️  Error details:', dotenvResult.error.message);
} else {
  console.log('✅ Environment variables loaded successfully from .env');
  console.log('   Loaded variables:', Object.keys(dotenvResult.parsed || {}).join(', ') || 'none');
}

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const Contact = require('./models/Contact');
const User = require('./models/User');
const { router: authRoutes, seedDefaultAdmin, seedInitialData } = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/portfolio_db')
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedDefaultAdmin();
    await seedInitialData();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Seed default admin user (removed duplicate function, using the one from auth.js)

// Route to fetch GitHub repos
app.get('/api/github/repos/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const response = await axios.get(`https://api.github.com/users/${username}/repos`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    res.status(500).json({ error: 'Failed to fetch repos' });
  }
});

// Route to fetch GitHub user profile
app.get('/api/github/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const response = await axios.get(`https://api.github.com/users/${username}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Public routes for client-side
app.get('/api/projects', async (req, res) => {
  try {
    const Project = require('./models/Project');
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/home', async (req, res) => {
  try {
    const Home = require('./models/Home');
    const home = await Home.findOne();
    res.json(home);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch home data' });
  }
});

app.get('/api/about', async (req, res) => {
  try {
    const About = require('./models/About');
    const about = await About.findOne();
    res.json(about);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch about data' });
  }
});

app.get('/api/timeline', async (req, res) => {
  try {
    const Timeline = require('./models/Timeline');
    const timeline = await Timeline.find().sort({ order: 1, createdAt: -1 });
    res.json(timeline);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const Blog = require('./models/Blog');
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const Blog = require('./models/Blog');
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const Testimonial = require('./models/Testimonial');
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Download CV/Resume as PDF
app.get('/api/download-cv', async (req, res) => {
  try {
    const About = require('./models/About');
    const Timeline = require('./models/Timeline');
    const Project = require('./models/Project');
    const Testimonial = require('./models/Testimonial');
    const { generateCV } = require('./utils/cvGenerator');

    // Fetch all necessary data
    const about = await About.findOne();
    const timeline = await Timeline.find().sort({ order: 1, createdAt: -1 });
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    const testimonials = await Testimonial.find({ isActive: true, featured: true }).sort({ order: 1 });

    // Prepare data for CV generation
    const cvData = {
      about,
      timeline,
      projects,
      testimonials
    };

    // Generate CV
    const cvPath = path.join(__dirname, 'uploads', `cv-${Date.now()}.pdf`);
    await generateCV(cvData, cvPath);

    // Send file for download
    res.download(cvPath, 'Resume.pdf', (err) => {
      // Delete the file after sending
      if (fs.existsSync(cvPath)) {
        fs.unlinkSync(cvPath);
      }
      if (err) {
        console.error('Error sending CV:', err);
      }
    });

  } catch (error) {
    console.error('Error generating CV:', error);
    res.status(500).json({ error: 'Failed to generate CV' });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const Testimonial = require('./models/Testimonial');
    const { name, role, company, message, rating, image } = req.body;

    if (!name || !role || !message || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newTestimonial = new Testimonial({
      name,
      role,
      company,
      message,
      rating,
      image,
      isActive: false // Explicitly set to false (moderation)
    });

    await newTestimonial.save();
    res.status(201).json({ message: 'Testimonial submitted successfully! It will be visible after moderation.' });
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate environment variables
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const recipientEmail = process.env.RECIPIENT_EMAIL;

  if (!emailUser || !emailPass || !recipientEmail) {
    console.error('Missing required environment variables for email configuration');
    return res.status(500).json({ error: 'Email service not configured properly' });
  }

  try {
    // Save to database
    const newContact = new Contact({
      name,
      email,
      message
    });
    await newContact.save();

    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: emailUser,
        pass: emailPass
      },
      secure: true, // Use TLS
    });

    // Email options
    const mailOptions = {
      from: email,
      to: recipientEmail,
      subject: `Portfolio Contact Form - Message from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
