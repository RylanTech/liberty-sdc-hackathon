const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const DayLocation = sequelize.define('DayLocation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'trips',
      key: 'id',
    },
  },
  dayNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true, // Can be empty initially
  },
  placeId: {
    type: DataTypes.STRING,
    allowNull: true, // Google Places API place_id
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
  activities: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'day_locations',
  indexes: [
    {
      unique: true,
      fields: ['tripId', 'dayNumber'],
    },
  ],
});

module.exports = DayLocation;
