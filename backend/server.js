const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');

dotenv.config(); // Load environment variables
const app = express(); // Initialize express app
app.use(express.json()); // Middleware
const PORT = process.env.PORT || 5000; // Define port

app.use('/api', require('./routes/api')); // Set REST endpoints

app.use(express.static("public"));

connectDB(); // Connect to database

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});