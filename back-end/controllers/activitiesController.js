const nominatimService = require('../services/nominatimService');
const DayLocation = require('../models/DayLocation');
const Trip = require('../models/Trip');

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

// Add activity to a specific day of a trip
const addActivityToDay = async (req, res) => {
  try {
    console.log('=== Add Activity to Day Request ===');
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('User:', req.user);
    
    const { tripId, dayNumber } = req.params;
    const { activity } = req.body;
    const userId = req.user.id;

    // Verify trip belongs to user
    const trip = await Trip.findOne({
      where: { id: tripId, userId }
    });

    if (!trip) {
      console.log('Trip not found for user');
      return res.status(404).json({ error: 'Trip not found' });
    }

    console.log('Trip found, looking for day location...');

    // Find or create the day location
    let dayLocation = await DayLocation.findOne({
      where: { tripId, dayNumber }
    });

    if (!dayLocation) {
      console.log('Creating new day location');
      dayLocation = await DayLocation.create({
        tripId,
        dayNumber,
        activities: []
      });
    }

    console.log('Current activities:', dayLocation.activities);

    // Create new activities array to avoid mutation issues
    const currentActivities = Array.isArray(dayLocation.activities) ? [...dayLocation.activities] : [];
    
    // Add the activity with timestamp
    const newActivity = {
      ...activity,
      addedAt: new Date().toISOString(),
      id: Date.now() // Simple ID to avoid duplicates
    };
    
    currentActivities.push(newActivity);

    console.log('Updating with new activities:', currentActivities);

    // Update the day location
    const updatedDayLocation = await dayLocation.update({
      activities: currentActivities
    });

    console.log('Day location updated successfully');

    res.status(200).json({
      message: 'Activity added successfully',
      dayLocation: updatedDayLocation,
      activityCount: currentActivities.length
    });

  } catch (error) {
    console.error('Error adding activity to day:', error);
    res.status(500).json({
      error: 'Failed to add activity',
      details: error.message
    });
  }
};

// Get activities for a specific day of a trip
const getDayActivities = async (req, res) => {
  try {
    console.log('=== Get Day Activities Request ===');
    console.log('Params:', req.params);
    console.log('User:', req.user);
    
    const { tripId, dayNumber } = req.params;
    const userId = req.user.id;

    // Verify trip belongs to user
    const trip = await Trip.findOne({
      where: { id: tripId, userId }
    });

    if (!trip) {
      console.log('Trip not found for user');
      return res.status(404).json({ error: 'Trip not found' });
    }

    console.log('Trip found, looking for day location...');

    const dayLocation = await DayLocation.findOne({
      where: { tripId, dayNumber }
    });

    if (!dayLocation) {
      console.log('No day location found, returning empty activities');
      return res.status(200).json({
        activities: [],
        dayLocation: null
      });
    }

    const activities = Array.isArray(dayLocation.activities) ? dayLocation.activities : [];
    console.log('Found activities:', activities.length);

    res.status(200).json({
      activities,
      dayLocation
    });

  } catch (error) {
    console.error('Error fetching day activities:', error);
    res.status(500).json({
      error: 'Failed to fetch activities',
      details: error.message
    });
  }
};

module.exports = { 
  searchActivities,
  addActivityToDay,
  getDayActivities
};
