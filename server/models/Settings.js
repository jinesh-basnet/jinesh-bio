const mongoose = require('mongoose');

const navLinkSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  path: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Portfolio',
    trim: true
  },
  logoText: {
    type: String,
    default: 'Portfolio',
    trim: true
  },
  footerCopyright: {
    type: String,
    default: '© Stack-Nova @ Jinesh Basnet. All rights reserved.',
    trim: true
  },
  navLinks: [navLinkSchema],
  socialLinks: [socialLinkSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

settingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);
