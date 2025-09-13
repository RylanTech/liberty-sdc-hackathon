const express = require('express');
const cors = require('cors');
const activitiesRoutes = require('./routes/activities');
const authRoutes = require('./routes/auth');
const sequelize = require('./models/index');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

app.use('/activities', activitiesRoutes);
app.use('/auth', authRoutes);

// Database sync and server start
const startServer = async () => {
  try {
    // Sync database
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();