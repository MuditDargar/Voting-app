const mongoose = require('mongoose');
require('dotenv').config();

// Define the MongoDB connection URL
// const mongoURL = process.env.mongoURL_local;
const mongoURL= process.env.DB_URL ;
// Setup MongoDB connection
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
    socketTimeoutMS: 45000 // Increase socket timeout to 45 seconds
});

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection
const db = mongoose.connection;

// Define event listeners for database connection
db.on('connected', () => {
  console.log(`connected to MongoDB server`);
});

db.on('error', (err) => {
  console.log(`MongoDB connection error: ${err}`);
});

db.on('disconnected', () => {
  console.log(`MongoDB disconnected`);
});

// Export the database connection
module.exports = db;
