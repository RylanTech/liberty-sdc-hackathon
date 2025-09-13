const express = require('express');
const router = express.Router();
const { searchOpenStreetMap } = require('../services/nominatimService');

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

module.exports = router;
