const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255],
    },
  },
  placeId: {
    type: DataTypes.STRING,
    allowNull: true, // Google Places API place_id
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterOrToday(value) {
        const today = new Date().toISOString().split('T')[0];
        if (value < today) {
          throw new Error('Start date must be today or in the future');
        }
      },
    },
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterStartDate(value) {
        if (value <= this.startDate) {
          throw new Error('End date must be after start date');
        }
      },
    },
  },
  numberOfTravelers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 50,
    },
  },
  status: {
    type: DataTypes.ENUM('planning', 'booked', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'planning',
  },
  backgroundImage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'trips',
});

module.exports = Trip;
