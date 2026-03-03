const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['work', 'education', 'certification', 'life', 'achievement'],
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  period: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  featured: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

timelineSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

timelineSchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.model('Timeline', timelineSchema);
