const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  icon: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['All', 'Frontend', 'Backend', 'Database', 'Tools', 'DevOps', 'Design'],
    default: 'All'
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  projects: [{
    name: String,
    url: String
  }],
  repos: [{
    name: String,
    url: String,
    stars: Number
  }],
  certifications: [{
    name: String,
    issuer: String,
    url: String
  }]
});

const heroButtonSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['primary', 'secondary'],
    default: 'primary'
  }
});

const homeSchema = new mongoose.Schema({
  hero: {
    heading: {
      type: String,
      default: 'Hi, I\'m Jinesh Basnet'
    },
    highlightText: {
      type: String,
      default: 'Jinesh Basnet'
    },
    description: {
      type: String,
      default: 'I\'m a passionate full-stack developer creating amazing web experiences with modern technologies.'
    },
    typingTexts: [{
      type: String,
      trim: true
    }],
    buttons: [heroButtonSchema],
    profileImage: {
      type: String,
      trim: true
    }
  },
  skills: {
    title: {
      type: String,
      default: 'Technologies I Work With'
    },
    skillsList: [skillSchema]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

homeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Home', homeSchema);
