const express = require('express');
const router = express.Router();
const { searchOpenStreetMap } = require('../services/nominatimService');
const authMiddleware = require('../middleware/auth');
const {
  addActivityToDay,
  getDayActivities
} = require('../controllers/activitiesController');

router.get('/search', async (req, res) => {
  try {
    const { city, category, state = '', country = 'us', limit = 10 } = req.query;

    if (!city || !category) {
      return res.status(400).json({ error: 'City and category are required' });
    }

    const numericLimit = parseInt(limit) || 10;
    const places = await searchOpenStreetMap(city, category, state, country, numericLimit);

    res.json({
      city,
      state,
      category,
      count: places.length,
      places
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Protected routes - require authentication
router.use(authMiddleware);

// Add activity to a specific day of a trip
router.post('/trips/:tripId/days/:dayNumber', addActivityToDay);

// Get activities for a specific day of a trip
router.get('/trips/:tripId/days/:dayNumber', getDayActivities);

module.exports = router;
