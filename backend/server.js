const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const path = require("path");


dotenv.config(); // Load environment variables
const app = express(); // Initialize express app
app.use(express.json()); // Middleware
const PORT = process.env.PORT || 5000; // Define port

app.use("/api", require("./routes/api")); // Set REST endpoints

app.use(express.static("public"));

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
})

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
})

connectDB(); // Connect to database

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
