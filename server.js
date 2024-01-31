const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const app = require('./app');

// Load environment variables
dotEnv.config({ path: './config.env' });

// Connecting to MongoDB Database

// Make the Server Listening in Event Loop
const PORT = process.env.PORT || 4000;

const db = require('./models');
db.sequelize.sync().then(8080, () => {
  const server = app.listen(() => {
    console.log(`App Running on Port ${PORT}`);
  });
});
