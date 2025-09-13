const nominatimService = require('../services/nominatimService');

const searchActivities = async (req, res) => {
  const { city, category } = req.query;

  if (!city || !category) {
    return res.status(400).json({ error: "city and category required" });
  }

  try {
    const places = await nominatimService.searchOpenStreetMap(city, category);
    res.json({
      city,
      category,
      places,
      count: places.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch activities', details: error.message });
  }
};


module.exports = { searchActivities };
