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
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'tools', 'other'],
    default: 'other'
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  }
});

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'About Me'
  },
  description: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    trim: true
  },
  resumeUrl: {
    type: String,
    trim: true
  },
  skills: [skillSchema],
  experience: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    website: String
  },
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    url: String
  }],
  languages: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'],
      default: 'Professional'
    }
  }],
  hobbies: [String],
  cvSettings: {
    includePhoto: {
      type: Boolean,
      default: true
    },
    includeProjects: {
      type: Boolean,
      default: true
    },
    includeTestimonials: {
      type: Boolean,
      default: false
    },
    includeCertifications: {
      type: Boolean,
      default: true
    },
    includeLanguages: {
      type: Boolean,
      default: true
    },
    includeHobbies: {
      type: Boolean,
      default: false
    },
    colorTheme: {
      type: String,
      enum: ['blue', 'green', 'purple', 'red', 'dark'],
      default: 'blue'
    },
    maxProjects: {
      type: Number,
      default: 3
    },
    maxExperience: {
      type: Number,
      default: 5
    }
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

aboutSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('About', aboutSchema);
