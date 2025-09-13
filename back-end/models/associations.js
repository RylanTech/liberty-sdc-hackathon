const User = require('./User');
const Trip = require('./Trip');
const DayLocation = require('./DayLocation');

// Define associations
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Trip.hasMany(DayLocation, { foreignKey: 'tripId', as: 'dayLocations' });
DayLocation.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

module.exports = {
  User,
  Trip,
  DayLocation
};
