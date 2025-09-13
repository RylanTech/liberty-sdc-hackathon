const Trip = require('../models/Trip');
const DayLocation = require('../models/DayLocation');
const User = require('../models/User');

// Create a new trip
const createTrip = async (req, res) => {
  try {
    const { destination, placeId, startDate, endDate, numberOfTravelers, backgroundImage } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!destination || !startDate || !endDate || !numberOfTravelers) {
      return res.status(400).json({
        error: 'Missing required fields: destination, startDate, endDate, numberOfTravelers'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        error: 'Start date must be today or in the future'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        error: 'End date must be after start date'
      });
    }

    // Create the trip
    const trip = await Trip.create({
      userId,
      destination,
      placeId,
      startDate,
      endDate,
      numberOfTravelers: parseInt(numberOfTravelers),
      backgroundImage,
      status: 'planning'
    });

    // Calculate the number of days and create empty day locations
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days

    console.log(`Creating day locations for trip ${trip.id}, days: ${diffDays}`);

    const dayLocations = [];
    for (let day = 1; day <= diffDays; day++) {
      try {
        console.log(`Attempting to create day location ${day} for trip ${trip.id}`);
        
        // Check if day location already exists to avoid duplicates
        const existingDayLocation = await DayLocation.findOne({
          where: {
            tripId: trip.id,
            dayNumber: day
          }
        });

        if (!existingDayLocation) {
          const dayLocation = await DayLocation.create({
            tripId: trip.id,
            dayNumber: day,
            location: day === 1 ? destination : null, // First day defaults to main destination
            placeId: day === 1 ? placeId : null,
            activities: [],
            order: day
          });
          console.log(`Successfully created day location ${day} for trip ${trip.id}`);
          dayLocations.push(dayLocation);
        } else {
          console.log(`Day location ${day} already exists for trip ${trip.id}`);
          dayLocations.push(existingDayLocation);
        }
      } catch (dayError) {
        console.error(`Error creating day location ${day} for trip ${trip.id}:`, dayError);
        // Continue with other days instead of failing completely
      }
    }

    // Fetch the complete trip with day locations
    const completeTrip = await Trip.findByPk(trip.id, {
      include: [
        {
          model: DayLocation,
          as: 'dayLocations',
          order: [['dayNumber', 'ASC']]
        }
      ]
    });

    res.status(201).json({
      message: 'Trip created successfully',
      trip: completeTrip
    });

  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({
      error: 'Failed to create trip',
      details: error.message
    });
  }
};

// Get all trips for a user
const getUserTrips = async (req, res) => {
  try {
    const userId = req.user.id;

    const trips = await Trip.findAll({
      where: { userId },
      include: [
        {
          model: DayLocation,
          as: 'dayLocations',
          order: [['dayNumber', 'ASC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      trips
    });

  } catch (error) {
    console.error('Error fetching user trips:', error);
    res.status(500).json({
      error: 'Failed to fetch trips',
      details: error.message
    });
  }
};

// Get a specific trip by ID
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findOne({
      where: { 
        id,
        userId // Ensure user can only access their own trips
      },
      include: [
        {
          model: DayLocation,
          as: 'dayLocations',
          order: [['dayNumber', 'ASC']]
        }
      ]
    });

    if (!trip) {
      return res.status(404).json({
        error: 'Trip not found'
      });
    }

    res.json({
      trip
    });

  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({
      error: 'Failed to fetch trip',
      details: error.message
    });
  }
};

// Update a trip
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const trip = await Trip.findOne({
      where: { 
        id,
        userId
      }
    });

    if (!trip) {
      return res.status(404).json({
        error: 'Trip not found'
      });
    }

    await trip.update(updates);

    // Fetch updated trip with day locations
    const updatedTrip = await Trip.findByPk(trip.id, {
      include: [
        {
          model: DayLocation,
          as: 'dayLocations',
          order: [['dayNumber', 'ASC']]
        }
      ]
    });

    res.json({
      message: 'Trip updated successfully',
      trip: updatedTrip
    });

  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({
      error: 'Failed to update trip',
      details: error.message
    });
  }
};

// Delete a trip
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findOne({
      where: { 
        id,
        userId
      }
    });

    if (!trip) {
      return res.status(404).json({
        error: 'Trip not found'
      });
    }

    // Delete associated day locations first (cascade delete)
    await DayLocation.destroy({
      where: { tripId: trip.id }
    });

    await trip.destroy();

    res.json({
      message: 'Trip deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({
      error: 'Failed to delete trip',
      details: error.message
    });
  }
};

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip
};
