const express = require('express');
const Timeline = require('../models/Timeline');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Sort by Date (oldest first/birth), then by order as a tie-breaker
    const timelineItems = await Timeline.find().sort({ date: 1, order: 1, createdAt: 1 });
    res.json(timelineItems);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

module.exports = router;
