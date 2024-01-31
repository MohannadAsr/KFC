const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const app = require('./app');

// Load environment variables
dotEnv.config({ path: './config.env' });

// Connecting to MongoDB Database

// Make the Server Listening in Event Loop
const PORT = process.env.PORT || 4000;

const db = require('./models');
db.sequelize.sync().then(() => {
  const server = app.listen(3001, () => {
    console.log(`App Running on Port ${PORT}`);
  });
});
