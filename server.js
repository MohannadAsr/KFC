const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const app = require('./app');

// Load environment variables
dotEnv.config({ path: './config.env' });

// Connecting to MongoDB Database

// Make the Server Listening in Event Loop
const PORT = process.env.NODE_ENV == 'production' ? 8080 : 3000;
console.log(PORT);

const db = require('./models');
db.sequelize.sync().then(() => {
  const server = app.listen(
    PORT,

    () => {
      console.log(`App Running on Port ${PORT}`);
    }
  );
});
