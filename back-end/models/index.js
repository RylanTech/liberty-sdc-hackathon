const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('connected to mysql');
  } catch (error) {
    console.error('unable to connect', error);
  }
}

testConnection();

module.exports = sequelize;
