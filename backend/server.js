const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const path = require("path");

const { MongoClient } = require("mongodb");

dotenv.config(); // Load environment variables
const app = express(); // Initialize express app
app.use(express.json()); // Middleware
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

app.get("/register-submit", (req, res) => {

})

async function CheckIfCollectionsExist() {
  const client = new MongoClient(DBURL);
  try {
    // Connect to Database
    await client.connect();

    const db = client.db(DBNAME);

    // Check if collection exists => If not create one
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some(
      (collection) => collection.name === user_collection_name
    );

    if (!collectionExists) {
      console.log(`Collection ${user_collection_name} existiert nicht, wird erstellt...`);
      await db.createCollection(user_collection_name);
    }
  } catch (error) {
    console.error("Fehler beim Überprüfen der Collections:", error);
  } finally {
    console.log("Initialisierungsritus der Datenbank erfolgreich ausgeführt!")
    await client.close();
  }
}

//connectDB(); // Connect to database

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  CheckIfCollectionsExist();
});
