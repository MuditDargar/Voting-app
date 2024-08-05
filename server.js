const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

// Middleware to handle CORS
app.use(cors({
    origin: 'http://localhost:3001', // Replace with your frontend URL if different
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json()); // Middleware to parse JSON request bodies

const port = process.env.PORT || 3000; // Ensure process.env.PORT is used correctly

const { jwtAuthMiddleware } = require('./jwt');

// Import the routes files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
