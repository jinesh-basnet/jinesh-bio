const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const About = require('../models/About');
const Blog = require('../models/Blog');
const Home = require('../models/Home');
const Timeline = require('../models/Timeline');
const User = require('../models/User');
const Contact = require('../models/Contact');
const Settings = require('../models/Settings');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { removeBackground } = require('../utils/removeBackground');

const logAudit = (action, resource, resourceId, userId, details = {}, ip = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    resource,
    resourceId,
    userId,
    details,
    ip,
  };

  console.log(`[AUDIT] ${JSON.stringify(logEntry)}`);
};

const auditMiddleware = (req, res, next) => {
  req.auditIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  next();
};

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

router.use(authenticateToken);
router.use(requireAdmin);
router.use(auditMiddleware);


router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/projects', upload.single('image'), async (req, res) => {
  try {
    const projectData = { ...req.body };

    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
    }

    if (typeof projectData.topics === 'string') {
      projectData.topics = projectData.topics.split(',').map(t => t.trim());
    }

    // Check for duplicates
    const existingProject = await Project.findOne({ html_url: projectData.html_url });
    if (existingProject) {
      return res.status(200).json(existingProject); // Or return conflict, but 200 is safer for sync
    }

    const project = new Project(projectData);
    await project.save();

    logAudit('CREATE', 'project', project._id, req.user?.id || 'unknown', { title: project.title }, req.auditIP);

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/projects/:id', upload.single('image'), async (req, res) => {
  try {
    const projectData = { ...req.body };

    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
    }

    if (typeof projectData.topics === 'string') {
      projectData.topics = projectData.topics.split(',').map(t => t.trim());
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    logAudit('UPDATE', 'project', project._id, req.user?.id || 'unknown', { title: project.title }, req.auditIP);

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});


router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.post('/testimonials', upload.single('image'), async (req, res) => {
  try {
    const testimonialData = { ...req.body };

    if (req.file) {
      testimonialData.image = `/uploads/${req.file.filename}`;
    }

    const testimonial = new Testimonial(testimonialData);
    await testimonial.save();

    logAudit('CREATE', 'testimonial', testimonial._id, req.user?.id || 'unknown', { name: testimonial.name }, req.auditIP);

    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

router.put('/testimonials/:id', upload.single('image'), async (req, res) => {
  try {
    const testimonialData = { ...req.body };

    if (req.file) {
      testimonialData.image = `/uploads/${req.file.filename}`;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      testimonialData,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});


router.get('/about', async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About({
        description: 'I am a passionate full-stack developer with experience in modern web technologies.',
        skills: [
          { name: 'JavaScript', level: 90, category: 'frontend' },
          { name: 'React', level: 85, category: 'frontend' },
          { name: 'Node.js', level: 80, category: 'backend' }
        ]
      });
      await about.save();
    }
    res.json(about);
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ error: 'Failed to fetch about content' });
  }
});

router.put('/about', upload.single('profileImage'), async (req, res) => {
  try {
    const aboutData = { ...req.body };

    if (typeof aboutData.bio === 'string') {
      try {
        aboutData.bio = JSON.parse(aboutData.bio);
      } catch (e) {
        console.error('Error parsing bio string:', e);
      }
    }

    if (typeof aboutData.socialLinks === 'string') {
      try {
        aboutData.socialLinks = JSON.parse(aboutData.socialLinks);
      } catch (e) {
        console.error('Error parsing socialLinks string:', e);
      }
    }

    if (req.file) {
      const originalPath = req.file.path;
      const ext = path.extname(req.file.filename);
      const baseName = path.basename(req.file.filename, ext);
      const processedPath = path.join(path.dirname(originalPath), `${baseName}-nobg.png`);

      const apiKey = process.env.REMOVE_BG_API_KEY;
      const finalPath = await removeBackground(originalPath, processedPath, apiKey);

      const finalFilename = path.basename(finalPath);
      aboutData.profileImage = `/uploads/${finalFilename}`;
    }

    if (typeof aboutData.skills === 'string') {
      try {
        aboutData.skills = JSON.parse(aboutData.skills);
      } catch (e) {
        console.error('Error parsing skills string:', e);
        return res.status(400).json({ error: 'Invalid skills format' });
      }
    }

    if (typeof aboutData.certifications === 'string') {
      try {
        aboutData.certifications = JSON.parse(aboutData.certifications);
      } catch (e) {
        console.error('Error parsing certifications string:', e);
      }
    }

    if (typeof aboutData.languages === 'string') {
      try {
        aboutData.languages = JSON.parse(aboutData.languages);
      } catch (e) {
        console.error('Error parsing languages string:', e);
      }
    }

    if (typeof aboutData.hobbies === 'string') {
      try {
        aboutData.hobbies = JSON.parse(aboutData.hobbies);
      } catch (e) {
        console.error('Error parsing hobbies string:', e);
      }
    }

    if (typeof aboutData.cvSettings === 'string') {
      try {
        aboutData.cvSettings = JSON.parse(aboutData.cvSettings);
      } catch (e) {
        console.error('Error parsing cvSettings string:', e);
      }
    }

    let about = await About.findOne();
    if (!about) {
      about = new About(aboutData);
    } else {
      Object.assign(about, aboutData);
    }

    await about.save();
    res.json(about);
  } catch (error) {
    console.error('Error updating about content:', error);
    res.status(500).json({ error: 'Failed to update about content' });
  }
});


router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ order: 1, createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

router.post('/blogs', upload.single('featuredImage'), async (req, res) => {
  try {
    const blogData = { ...req.body };

    if (req.file) {
      blogData.featuredImage = `/uploads/${req.file.filename}`;
    }

    if (typeof blogData.tags === 'string') {
      blogData.tags = blogData.tags.split(',').map(t => t.trim());
    }

    if (!blogData.slug) {
      blogData.slug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    const blog = new Blog(blogData);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

router.put('/blogs/:id', upload.single('featuredImage'), async (req, res) => {
  try {
    const blogData = { ...req.body };

    if (req.file) {
      blogData.featuredImage = `/uploads/${req.file.filename}`;
    }

    if (typeof blogData.tags === 'string') {
      blogData.tags = blogData.tags.split(',').map(t => t.trim());
    }

    if (!blogData.slug && blogData.title) {
      blogData.slug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      blogData,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

router.delete('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});


router.get('/home', async (req, res) => {
  try {
    let home = await Home.findOne();
    if (!home) {
      home = new Home({
        hero: {
          heading: 'Hi, I\'m Jinesh Basnet',
          highlightText: 'Jinesh Basnet',
          description: 'I\'m a passionate full-stack developer creating amazing web experiences with modern technologies.',
          typingTexts: [
            "I'm a passionate full-stack developer creating amazing web experiences with modern technologies.",
            "I love turning ideas into reality through code.",
            "Specializing in MERN stack and innovative solutions."
          ],
          buttons: [
            { text: 'View My Work', link: '/projects', type: 'primary' },
            { text: 'Get In Touch', link: '/contact', type: 'secondary' }
          ]
        },
        skills: {
          title: 'Technologies I Work With',
          skillsList: [
            { name: 'React', icon: '⚛️', level: 90, category: 'Frontend' },
            { name: 'Node.js', icon: '🟢', level: 85, category: 'Backend' },
            { name: 'MongoDB', icon: '🍃', level: 80, category: 'Database' },
            { name: 'Express', icon: '🚀', level: 85, category: 'Backend' },
            { name: 'JavaScript', icon: '🟨', level: 95, category: 'Frontend' },
            { name: 'Python', icon: '🐍', level: 75, category: 'Backend' },
            { name: 'TypeScript', icon: '🔷', level: 80, category: 'Frontend' },
            { name: 'Git', icon: '📚', level: 85, category: 'Tools' }
          ]
        }
      });
      await home.save();
    }
    res.json(home);
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({ error: 'Failed to fetch home content' });
  }
});

router.put('/home', upload.single('profileImage'), async (req, res) => {
  try {
    const homeData = { ...req.body };

    if (typeof homeData.hero === 'string') {
      try {
        homeData.hero = JSON.parse(homeData.hero);
      } catch (e) {
        console.error('Error parsing hero string:', e);
        homeData.hero = {}; // Initialize as object to prevent crash
      }
    }

    if (typeof homeData.skills === 'string') {
      try {
        homeData.skills = JSON.parse(homeData.skills);
      } catch (e) {
        console.error('Error parsing skills string:', e);
        homeData.skills = { skillsList: [] }; // Provide fallback structure
      }
    }

    if (req.file) {
      if (!homeData.hero) homeData.hero = {};

      const originalPath = req.file.path;
      const ext = path.extname(req.file.filename);
      const baseName = path.basename(req.file.filename, ext);
      const processedPath = path.join(path.dirname(originalPath), `${baseName}-nobg.png`);

      const apiKey = process.env.REMOVE_BG_API_KEY;
      const finalPath = await removeBackground(originalPath, processedPath, apiKey);

      const finalFilename = path.basename(finalPath);
      homeData.hero.profileImage = `/uploads/${finalFilename}`;
    }

    if (typeof homeData.hero?.buttons === 'string') {
      try {
        homeData.hero.buttons = JSON.parse(homeData.hero.buttons);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid buttons format' });
      }
    }

    if (typeof homeData.hero?.typingTexts === 'string') {
      try {
        homeData.hero.typingTexts = JSON.parse(homeData.hero.typingTexts);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid typing texts format' });
      }
    }

    if (typeof homeData.skills?.skillsList === 'string') {
      try {
        homeData.skills.skillsList = JSON.parse(homeData.skills.skillsList);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid skills format' });
      }
    }

    let home = await Home.findOne();
    if (!home) {
      home = new Home(homeData);
    } else {
      Object.assign(home, homeData);
    }

    await home.save();
    res.json(home);
  } catch (error) {
    console.error('Error updating home content:', error);
    res.status(500).json({ error: 'Failed to update home content' });
  }
});


router.get('/timeline', async (req, res) => {
  try {
    const timelineItems = await Timeline.find().sort({ date: 1, order: 1 });
    res.json(timelineItems);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

router.post('/timeline', upload.single('image'), async (req, res) => {
  try {
    const timelineData = { ...req.body };

    if (req.file) {
      timelineData.image = `/uploads/${req.file.filename}`;
    }

    if (typeof timelineData.technologies === 'string') {
      try {
        timelineData.technologies = JSON.parse(timelineData.technologies);
      } catch (e) {
        timelineData.technologies = timelineData.technologies.split(',').map(t => t.trim());
      }
    }

    const timelineItem = new Timeline(timelineData);
    await timelineItem.save();

    logAudit('CREATE', 'timeline', timelineItem._id, req.user?.id || 'unknown', { title: timelineItem.title }, req.auditIP);

    res.status(201).json(timelineItem);
  } catch (error) {
    console.error('Error creating timeline item:', error);
    res.status(500).json({ error: 'Failed to create timeline item' });
  }
});

router.put('/timeline/:id', upload.single('image'), async (req, res) => {
  try {
    const timelineData = { ...req.body };

    if (req.file) {
      timelineData.image = `/uploads/${req.file.filename}`;
    }

    if (typeof timelineData.technologies === 'string') {
      try {
        timelineData.technologies = JSON.parse(timelineData.technologies);
      } catch (e) {
        timelineData.technologies = timelineData.technologies.split(',').map(t => t.trim());
      }
    }

    const timelineItem = await Timeline.findByIdAndUpdate(
      req.params.id,
      timelineData,
      { new: true, runValidators: true }
    );

    if (!timelineItem) {
      return res.status(404).json({ error: 'Timeline item not found' });
    }

    res.json(timelineItem);
  } catch (error) {
    console.error('Error updating timeline item:', error);
    res.status(500).json({ error: 'Failed to update timeline item' });
  }
});

router.delete('/timeline/:id', async (req, res) => {
  try {
    const timelineItem = await Timeline.findByIdAndDelete(req.params.id);
    if (!timelineItem) {
      return res.status(404).json({ error: 'Timeline item not found' });
    }
    res.json({ message: 'Timeline item deleted successfully' });
  } catch (error) {
    console.error('Error deleting timeline item:', error);
    res.status(500).json({ error: 'Failed to delete timeline item' });
  }
});

router.get('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const settingsData = { ...req.body };
    
    // Ensure nested arrays are handled if they come as strings (though UI should send JSON)
    if (typeof settingsData.navLinks === 'string') {
      settingsData.navLinks = JSON.parse(settingsData.navLinks);
    }
    if (typeof settingsData.socialLinks === 'string') {
      settingsData.socialLinks = JSON.parse(settingsData.socialLinks);
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(settingsData);
    } else {
      Object.assign(settings, settingsData);
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [projectCount, testimonialCount, aboutCount, blogCount, contactCount, timelineCount] = await Promise.all([
      Project.countDocuments(),
      Testimonial.countDocuments(),
      About.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments(),
      Timeline.countDocuments()
    ]);

    res.json({
      projects: projectCount,
      testimonials: testimonialCount,
      about: aboutCount,
      blogs: blogCount,
      contacts: contactCount,
      timeline: timelineCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});


router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

router.put('/contacts/:id', async (req, res) => {
  try {
    const { isRead, response } = req.body;

    const updateData = {};
    if (isRead !== undefined) updateData.isRead = isRead;
    if (response !== undefined) updateData.response = response;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

router.delete('/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('username email role isApproved createdAt lastLogin')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id/approve', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(400).json({ error: 'User is not an admin' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: 'Admin user approved successfully' });
  } catch (error) {
    console.error('Error approving admin user:', error);
    res.status(500).json({ error: 'Failed to approve admin user' });
  }
});

router.put('/users/:id/reject', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(400).json({ error: 'User is not an admin' });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: 'Admin user rejected and deactivated' });
  } catch (error) {
    console.error('Error rejecting admin user:', error);
    res.status(500).json({ error: 'Failed to reject admin user' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { username, email, role, isApproved, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role, isApproved, isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
