const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_DIALECT === 'sqlite' ? './database.sqlite' : undefined,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hackathon_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  logging: false,
});

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
