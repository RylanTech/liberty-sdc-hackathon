const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip
} = require('../controllers/tripsController');

// All trip routes require authentication
router.use(authMiddleware);

// Create a new trip
router.post('/', createTrip);

// Get all trips for the authenticated user
router.get('/', getUserTrips);

// Get a specific trip by ID
router.get('/:id', getTripById);

// Update a trip
router.put('/:id', updateTrip);

// Delete a trip
router.delete('/:id', deleteTrip);

module.exports = router;
