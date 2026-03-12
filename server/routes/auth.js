const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const About = require('../models/About');
const Timeline = require('../models/Timeline');
const Home = require('../models/Home');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const seedDefaultAdmin = async () => {
  try {
    const defaultAdminEmail = 'jinesh@admin.com';
    const defaultAdminPassword = 'admin123';

    const existingAdmin = await User.findOne({ email: defaultAdminEmail });
    if (!existingAdmin) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(defaultAdminPassword, saltRounds);

      const defaultAdmin = new User({
        username: 'jinesh',
        email: defaultAdminEmail,
        password: hashedPassword,
        role: 'admin',
        isApproved: true,
        isActive: true
      });

      await defaultAdmin.save();
      console.log('Default admin account created successfully');
    }
  } catch (error) {
    console.error('Error seeding default admin:', error);
  }
};

const seedInitialData = async () => {
  try {
    const homeCount = await Home.countDocuments();
    if (homeCount === 0) {
      const defaultHome = new Home({
        hero: {
          heading: "Hi, I'm Jinesh Basnet",
          highlightText: "Jinesh Basnet",
          description: "I build robust, scalable, and visually stunning web applications that solve real-world problems.",
          typingTexts: ["Full Stack Developer", "MERN Expert", "UI/UX Designer", "Problem Solver"],
          buttons: [
            { text: "View Projects", link: "/projects", type: "primary" },
            { text: "Contact Me", link: "/contact", type: "secondary" }
          ]
        },
        skills: {
          title: "Technical Expertise",
          skillsList: [
            { name: "React", icon: "⚛️", level: 90, category: "Frontend" },
            { name: "Node.js", icon: "🟢", level: 85, category: "Backend" },
            { name: "MongoDB", icon: "🍃", level: 80, category: "Database" },
            { name: "JavaScript", icon: "🟨", level: 95, category: "Languages" }
          ]
        }
      });
      await defaultHome.save();
      console.log('Default home content seeded');
    }

    const aboutCount = await About.countDocuments();
    if (aboutCount === 0) {
      const defaultAbout = new About({
        title: "About Me",
        bio: [
          "I am a passionate developer with a strong foundation in modern web technologies.",
          "My journey in tech started with curiosity, and now I build enterprise-level applications.",
          "I believe in writing clean, maintainable code and delivering exceptional user experiences."
        ]
      });
      await defaultAbout.save();
      console.log('Default about content seeded');
    }

    const timelineCount = await Timeline.countDocuments();
    if (timelineCount === 0) {
      const initialTimeline = [
        {
          type: 'work',
          title: 'Senior Full Stack Developer',
          company: 'Tech Solutions Inc.',
          location: 'Kathmandu, Nepal',
          period: '2021 - Present',
          description: 'Leading the development of complex web applications using React and Node.js.',
          technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
          date: new Date('2021-01-01'),
          order: 1
        },
        {
          type: 'education',
          title: 'B.Sc. in Computer Science',
          company: 'Tribhuvan University',
          location: 'Kathmandu, Nepal',
          period: '2017 - 2021',
          description: 'Graduated with honors, specializing in Software Engineering.',
          technologies: ['C++', 'Data Structures', 'Algorithms', 'DBMS'],
          date: new Date('2017-01-01'),
          order: 2
        }
      ];
      await Timeline.insertMany(initialTimeline);
      console.log('Initial timeline data seeded');
    }

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const initialProjects = [
        {
          name: "Portfolio Project",
          description: "A premium, modern portfolio template built with MERN stack.",
          language: "JavaScript",
          html_url: "https://github.com/jinesh-basnet/portfolio",
          homepage: "https://portfolio-demo.com",
          stargazers_count: 10,
         topics: ["React", "MERN", "Framer Motion"],
          order: 1
        }
      ];
      await Project.insertMany(initialProjects);
      console.log('Initial projects seeded');
    }

    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      const initialBlogs = [
        {
          title: "Mastering the MERN Stack in 2026",
          slug: "mastering-mern-stack-2026",
          content: "The MERN stack (MongoDB, Express, React, Node.js) remains a powerful choice for building modern web applications. In 2026, we see more integration of AI and serverless patterns...",
          excerpt: "A deep dive into the latest trends and best practices for MERN stack development in the modern era.",
          category: "Technology",
          author: "Jinesh Basnet",
          tags: ["MERN", "React", "Node.js", "MongoDB"],
          published: true,
          publishedAt: new Date(),
          featured: true
        },
        {
          title: "The Art of Clean Code",
          slug: "art-of-clean-code",
          content: "Clean code is not just about making things look pretty. It's about maintainability, readability, and reducing technical debt. As developers, we spend most of our time reading code...",
          excerpt: "Learn the essential principles of writing clean, professional code that your future self will thank you for.",
          category: "Development",
          author: "Jinesh Basnet",
          tags: ["Clean Code", "Software Engineering", "Best Practices"],
          published: true,
          publishedAt: new Date(),
          featured: false
        }
      ];
      await Blog.insertMany(initialBlogs);
      console.log('Initial blogs seeded');
    }

    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      const initialTestimonials = [
        {
          name: "Sarah Johnson",
          role: "Product Manager",
          company: "TechCorp",
          message: "Jinesh delivered exceptional work on our e-commerce platform. His attention to detail and technical expertise helped us achieve a 40% increase in user engagement.",
          rating: 5,
          featured: true,
          order: 1
        },
        {
          name: "Michael Chen",
          role: "Startup Founder",
          company: "InnovateLab",
          message: "Working with Jinesh was a game-changer for our startup. He not only built a robust MERN stack application but also provided valuable insights on scalability.",
          rating: 5,
          featured: true,
          order: 2
        }
      ];
      await Testimonial.insertMany(initialTestimonials);
      console.log('Initial testimonials seeded');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const isAdminEmail = email.toLowerCase().includes('@admin.com');
    const role = isAdminEmail ? 'admin' : 'user';

    let isApproved = false;
    if (role === 'user') {
      isApproved = true; 
    } else if (role === 'admin') {
      const approvedAdminsCount = await User.countDocuments({ role: 'admin', isApproved: true });
      isApproved = approvedAdminsCount === 0; 
    }

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      isApproved
    });

    await user.save();

    const message = isAdminEmail
      ? (isApproved ? 'First admin account created successfully. You can now access the admin panel.' : 'Admin registration request submitted. Please wait for approval from an existing admin.')
      : 'User account created successfully';

    res.status(201).json({ message });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    if (user.role === 'admin' && !user.isApproved) {
      return res.status(401).json({ error: 'Admin account pending approval' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.get('/my-contacts', authenticateToken, async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const contacts = await Contact.find({ email: req.user.email }).sort({ submittedAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('User contacts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch your messages' });
  }
});

router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

router.get('/pending-admins', authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== 'admin' || !currentUser.isApproved) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const pendingAdmins = await User.find({
      role: 'admin',
      isApproved: false,
      isActive: true
    }).select('username email createdAt');

    res.json(pendingAdmins);
  } catch (error) {
    console.error('Pending admins fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch pending admins' });
  }
});

router.put('/approve-admin/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== 'admin' || !currentUser.isApproved) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const userToApprove = await User.findById(req.params.userId);
    if (!userToApprove) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userToApprove.role !== 'admin' || userToApprove.isApproved) {
      return res.status(400).json({ error: 'User is not a pending admin' });
    }

    userToApprove.isApproved = true;
    await userToApprove.save();

    res.json({ message: 'Admin user approved successfully' });
  } catch (error) {
    console.error('Admin approval error:', error);
    res.status(500).json({ error: 'Failed to approve admin' });
  }
});

router.put('/reject-admin/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== 'admin' || !currentUser.isApproved) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const userToReject = await User.findById(req.params.userId);
    if (!userToReject) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userToReject.role !== 'admin' || userToReject.isApproved) {
      return res.status(400).json({ error: 'User is not a pending admin' });
    }

    userToReject.isActive = false;
    await userToReject.save();

    res.json({ message: 'Admin user rejected and deactivated' });
  } catch (error) {
    console.error('Admin rejection error:', error);
    res.status(500).json({ error: 'Failed to reject admin' });
  }
});

module.exports = { router, seedDefaultAdmin, seedInitialData };
