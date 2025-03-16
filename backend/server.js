const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const path = require("path");
const bcrypt = require('bcrypt');
const session = require('express-session');

const { MongoClient } = require("mongodb");

dotenv.config(); // Load environment variables
const app = express(); // Initialize express app
app.use(express.json()); // Middleware

app.use(session({
  secret: "AihjaiAi49a894nainAUnguNUAdaizu833620Ajgnai",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "process",
    maxAge: 86400000 // 24 Hours in milliseconds
  }
}));

const PORT = process.env.PORT || 5000; // Define port
const DBURL = process.env.DATABASE_URL;
const DBNAME = process.env.DATABASE_NAME;
const user_collection_name = "users"; // Dataset of all users

app.use("/api", require("./routes/api")); // Set REST endpoints

app.use(express.static("public"));

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
})

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
})

let db;
async function initializeDbConnection() {
  try {
    const client = new MongoClient(DBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
    db = client.db(DBNAME);
    console.log("Database connection established");
    await CheckIfCollectionsExist(db);
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

// Start server after DB connection
initializeDbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password, secret_code } = req.body;

    // Input validation
    if (!username || !email || !password || !secret_code) {
      return res.status(400).json({ message: "Alle Felder müssen ausgefüllt sein." });
    }

    // Validate secret code on server side
    if (secret_code !== "FleischloverSecret") {
      return res.status(403).json({ message: "Ungültiger Geheimcode." });
    }

    // Use 'db' instead of creating a new connection
    const collection = db.collection(user_collection_name);

    // Check for existing user
    const existingUser = await collection.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({ message: "Benutzername oder Email bereits vergeben." });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and insert new user with timestamp
    const newUser = {
      username,
      email,
      password: hashedPassword,
      created_at: new Date()
    };
    await collection.insertOne(newUser);

    res.status(201).json({ message: "Benutzer erfolgreich registriert." });
  } catch (error) {
    console.error(`Registration error: ${error}`);
    res.status(500).json({ message: "Serverfehler bei der Registrierung." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { usernameoremail, password, secret_code } = req.body;

    // Input validation
    if (!usernameoremail || !password || !secret_code) {
      return res.status(400).json({ message: "Alle Felder müssen ausgefüllt sein." });
    }

    // Validate secret code on server side
    if (secret_code !== "FleischloverSecret") {
      return res.status(403).json({ message: "Ungültiger Geheimcode." });
    }

    const collection = db.collection(user_collection_name);

    // Check for user (by username or email)
    const user = await collection.findOne({
      $or: [{ username: usernameoremail }, { email: usernameoremail }]
    });

    if (!user) {
      return res.status(401).json({ message: "Ungültiger Benutzername oder Passwort." });
    }

    // Compare password with hashed password in database
    const passwordValid = await bcrypt.compare(password, user.password);
    console.log(`Login attempt for user: ${usernameoremail}, validation result: ${passwordValid}`);

    if (!passwordValid) {
      return res.status(401).json({ message: "Ungültiger Benutzername oder Passwort." });
    }

    // Store user info in session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      isLoggedIn: true
    };

    // Success - send back user info (except password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: "Login erfolgreich.",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error(`Login error: ${error}`);
    res.status(500).json({ message: "Serverfehler beim Login." });
  }
});

// Check if user is logged in
app.get("/api/user", (req, res) => {
  if (req.session.user && req.session.user.isLoggedIn) {
    return res.status(200).json({
      isLoggedIn: true,
      user: req.session.user
    });
  }
  res.status(200).json({ isLoggedIn: false });
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Fehler beim Ausloggen." });
    }
    res.redirect('/');
  });
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user.isLoggedIn) {
    return next();
  }
  res.redirect('/login');
};

// Example of protected route
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

async function CheckIfCollectionsExist(database) {
  try {
    // Check if collection exists => If not create one
    const collections = await database.listCollections().toArray();
    const collectionExists = collections.some(
      (collection) => collection.name === user_collection_name
    );

    if (!collectionExists) {
      console.log(`Collection ${user_collection_name} existiert nicht, wird erstellt...`);
      await database.createCollection(user_collection_name);
    }
  } catch (error) {
    console.error("Fehler beim Überprüfen der Collections:", error);
  } finally {
    console.log("Initialisierungsritus der Datenbank erfolgreich ausgeführt!")
  }
}