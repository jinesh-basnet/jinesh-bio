const express = require('express');
const Timeline = require('../models/Timeline');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const timelineItems = await Timeline.find().sort({ order: 1, createdAt: -1 });
    res.json(timelineItems);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

module.exports = router;
