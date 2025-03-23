const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require('bcrypt');
const session = require('express-session');
const mysql = require('mysql2/promise'); // Replace MongoDB with MySQL/MariaDB client

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

// Add at the top with other global variables
let maintenanceMode = {
  enabled: false,
  message: "Die Seite befindet sich aktuell im Wartungsmodus. Bitte versuchen Sie es später erneut.",
  allowAdminAccess: true
};

// Add no-cache middleware to force browsers to always get the latest files
// This ensures that updates to the website are immediately visible to users
app.use((req, res, next) => {
  // Skip cache headers for API routes to improve performance
  if (!req.path.startsWith('/api/')) {
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
  }
  next();
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user.isLoggedIn) {
    return next();
  }
  res.redirect('/login');
};

// Add the isAdmin middleware function - add this with your other middleware functions
function isAdmin(req, res, next) {
  // Check if the user is authenticated
  if (!req.session.user) {
    return res.status(401).json({ message: "Nicht autorisiert." }) || res.redirect('/login');
  }

  // Check if user is admin - using == 1 to handle both boolean and integer values
  if (req.session.user.isAdmin == 1) {
    next();
  } else {
    return res.status(403).json({ message: "Keine Berechtigung für diese Aktion." }) || res.redirect('/');
  }
}



const PORT = process.env.PORT || 5000; // Define port
const DB_HOST = '45.84.196.164';
const DB_USER = 'dbuser';
const DB_PASSWORD = 'Marschmallow123';
const DB_NAME = 'lennardtsquellendb';
const DB_PORT = 3306;

// Tables names
const USERS_TABLE = "users"; // Table for all users
const POSTS_TABLE = "posts"; // Table for all posts

app.use("/api", require("./routes/api")); // Set REST endpoints

app.use(express.static("public"));

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
})

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
})

// New route for creating posts - protected by isAuthenticated middleware
app.get("/create-post", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'create-post.html'));
});

// Admin panel route - protected by isAdmin middleware
app.get("/admin", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Database connection pool
let dbPool;

// Initialize database connection
async function initializeDbConnection() {
  try {
    // Create a connection pool
    dbPool = await mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log("Database connection pool established");
    await createTablesIfNotExist();
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

// Create tables if they don't exist
async function createTablesIfNotExist() {
  try {
    // Create users table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS ${USERS_TABLE} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create posts table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS ${POSTS_TABLE} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author_id INT NOT NULL,
        author_username VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
      )
    `);

    // Create hearts table (many-to-many relationship)
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS post_hearts (
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        PRIMARY KEY (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES ${POSTS_TABLE}(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
      )
    `);

    // Create likes table (many-to-many relationship)
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS post_likes (
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        PRIMARY KEY (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES ${POSTS_TABLE}(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
      )
    `);

    // Create moods table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS post_moods (
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        value INT NOT NULL CHECK (value >= 0 AND value <= 100),
        PRIMARY KEY (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES ${POSTS_TABLE}(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
      )
    `);

    // Create comments table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS post_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        username VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES ${POSTS_TABLE}(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES ${USERS_TABLE}(id) ON DELETE CASCADE
      )
    `);

    console.log("Database tables checked/created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
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
    // First check if database connection pool exists
    if (!dbPool) {
      console.error("Database connection pool not available");
      return res.status(503).json({ message: "Datenbankverbindung nicht verfügbar." });
    }

    const { username, email, password, secret_code } = req.body;

    // Input validation
    if (!username || !email || !password || !secret_code) {
      return res.status(400).json({ message: "Alle Felder müssen ausgefüllt sein." });
    }

    // Validate email format using simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Ungültiges Email-Format." });
    }

    // Validate secret code on server side
    if (secret_code !== process.env.SECRET_CODE) {
      return res.status(403).json({ message: "Ungültiger Geheimcode." });
    }

    if (username.length > 20) {
      return res.status(408).json({ message: "Dein Name ist zu lang." });
    }

    // Sanitize inputs to prevent issues
    const sanitizedUsername = username.trim();
    const sanitizedEmail = email.trim().toLowerCase();

    // Check for existing user
    const [existingUsers] = await dbPool.query(
      `SELECT * FROM ${USERS_TABLE} WHERE username = ? OR email = ?`,
      [sanitizedUsername, sanitizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Benutzername oder Email bereits vergeben." });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and insert new user
    const [result] = await dbPool.query(
      `INSERT INTO ${USERS_TABLE} (username, email, password) VALUES (?, ?, ?)`,
      [sanitizedUsername, sanitizedEmail, hashedPassword]
    );

    res.status(201).json({ message: "Benutzer erfolgreich registriert." });
  } catch (error) {
    console.error(`Registration error details: ${error.message}`);
    console.error(`Error stack: ${error.stack}`);
    res.status(500).json({
      message: "Serverfehler bei der Registrierung.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    if (secret_code !== process.env.SECRET_CODE) {
      return res.status(403).json({ message: "Ungültiger Geheimcode." });
    }

    // Check for user (by username or email)
    const [users] = await dbPool.query(
      `SELECT * FROM ${USERS_TABLE} WHERE username = ? OR email = ?`,
      [usernameoremail, usernameoremail]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Ungültiger Benutzername oder Passwort." });
    }

    const user = users[0];

    // Compare password with hashed password in database
    const passwordValid = await bcrypt.compare(password, user.password);
    console.log(`Login attempt for user: ${usernameoremail}, validation result: ${passwordValid}`);

    if (!passwordValid) {
      return res.status(401).json({ message: "Ungültiger Benutzername oder Passwort." });
    }

    // Store user info in session including admin status
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      isLoggedIn: true,
      isAdmin: user.isAdmin || false
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

app.get("/neue-quelle", (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'neue-quelle.html'));
})

// Create new post endpoint - protected
app.post("/api/posts", isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate post data
    if (!title || !content) {
      return res.status(400).json({ message: "Titel und Inhalt sind erforderlich." });
    }

    // Ensure database is connected
    if (!dbPool) {
      return res.status(503).json({ message: "Datenbankverbindung nicht verfügbar." });
    }

    // Insert post into database
    const [result] = await dbPool.query(
      `INSERT INTO ${POSTS_TABLE} (title, content, author_id, author_username) VALUES (?, ?, ?, ?)`,
      [title, content, req.session.user.id, req.session.user.username]
    );

    if (result.affectedRows > 0) {
      res.status(201).json({
        message: "Beitrag erfolgreich erstellt.",
        post_id: result.insertId
      });
    } else {
      res.status(500).json({ message: "Fehler beim Erstellen des Beitrags." });
    }
  } catch (error) {
    console.error(`Post creation error: ${error}`);
    res.status(500).json({ message: "Serverfehler beim Erstellen des Beitrags." });
  }
});

// Get all posts
app.get("/api/posts", async (req, res) => {
  try {
    // Ensure database is connected
    if (!dbPool) {
      return res.status(503).json({ message: "Datenbankverbindung nicht verfügbar." });
    }

    // Get all posts with join to get mood information
    const [posts] = await dbPool.query(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM post_hearts WHERE post_id = p.id) AS heart_count,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
        (SELECT AVG(value) FROM post_moods WHERE post_id = p.id) AS average_mood,
        (SELECT COUNT(*) FROM post_moods WHERE post_id = p.id) AS mood_count
      FROM ${POSTS_TABLE} p
      ORDER BY p.created_at DESC
    `);

    // If user is logged in, get their mood, heart, and like status for each post
    const userId = req.session.user?.id;
    let enrichedPosts = [];

    if (userId) {
      // Get user's moods for all posts
      const [userMoods] = await dbPool.query(
        `SELECT post_id, value FROM post_moods WHERE user_id = ?`,
        [userId]
      );
      const moodMap = new Map(userMoods.map(m => [m.post_id, m.value]));

      // Get user's hearts
      const [userHearts] = await dbPool.query(
        `SELECT post_id FROM post_hearts WHERE user_id = ?`,
        [userId]
      );
      const heartMap = new Set(userHearts.map(h => h.post_id));

      // Get user's likes
      const [userLikes] = await dbPool.query(
        `SELECT post_id FROM post_likes WHERE user_id = ?`,
        [userId]
      );
      const likeMap = new Set(userLikes.map(l => l.post_id));

      // Enrich posts with user-specific data
      enrichedPosts = posts.map(post => ({
        ...post,
        averageMood: post.average_mood ? Math.round(post.average_mood) : 50,
        userMood: moodMap.get(post.id) || null,
        totalMoodRatings: post.mood_count || 0,
        hearts: [], // This array is not used in the front-end directly 
        likes: [], // This array is not used in the front-end directly
        hearts_count: post.heart_count || 0,
        likes_count: post.like_count || 0,
        user_has_hearted: heartMap.has(post.id),
        user_has_liked: likeMap.has(post.id)
      }));
    } else {
      // For non-logged-in users, just process the average values
      enrichedPosts = posts.map(post => ({
        ...post,
        averageMood: post.average_mood ? Math.round(post.average_mood) : 50,
        userMood: null,
        totalMoodRatings: post.mood_count || 0,
        hearts: [],
        likes: [],
        hearts_count: post.heart_count || 0,
        likes_count: post.like_count || 0
      }));
    }

    // Get comments for all posts
    const [allComments] = await dbPool.query(`
      SELECT pc.id, pc.post_id, pc.user_id, pc.username, pc.content, pc.created_at
      FROM post_comments pc
      ORDER BY pc.created_at DESC
    `);

    // Group comments by post_id
    const commentsByPostId = {};
    allComments.forEach(comment => {
      if (!commentsByPostId[comment.post_id]) {
        commentsByPostId[comment.post_id] = [];
      }
      commentsByPostId[comment.post_id].push({
        id: comment.id,
        username: comment.username,
        content: comment.content,
        createdAt: formatDate(comment.created_at),
        userId: comment.user_id
      });
    });

    // Add comments to each post
    enrichedPosts = enrichedPosts.map(post => ({
      ...post,
      comments: commentsByPostId[post.id] || []
    }));

    res.status(200).json({ posts: enrichedPosts });
  } catch (error) {
    console.error(`Error fetching posts: ${error}`);
    res.status(500).json({ message: "Fehler beim Laden der Beiträge." });
  }
});

// Toggle heart on post
app.post("/api/posts/:id/heart", isAuthenticated, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.session.user.id;

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Ungültige Beitrags-ID." });
    }

    // Check if post exists
    const [posts] = await dbPool.query(
      `SELECT * FROM ${POSTS_TABLE} WHERE id = ?`,
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: "Beitrag nicht gefunden." });
    }

    // Check if user already hearted this post
    const [existingHearts] = await dbPool.query(
      `SELECT * FROM post_hearts WHERE post_id = ? AND user_id = ?`,
      [postId, userId]
    );

    let heartCount;

    if (existingHearts.length === 0) {
      // Add heart
      await dbPool.query(
        `INSERT INTO post_hearts (post_id, user_id) VALUES (?, ?)`,
        [postId, userId]
      );
    } else {
      // Remove heart
      await dbPool.query(
        `DELETE FROM post_hearts WHERE post_id = ? AND user_id = ?`,
        [postId, userId]
      );
    }

    // Get updated heart count
    const [countResult] = await dbPool.query(
      `SELECT COUNT(*) as count FROM post_hearts WHERE post_id = ?`,
      [postId]
    );

    heartCount = countResult[0].count;

    return res.status(200).json({ success: true, heartCount });
  } catch (error) {
    console.error(`Error toggling heart: ${error}`);
    res.status(500).json({ message: "Serverfehler beim Aktualisieren des Beitrags." });
  }
});

// Toggle like on post
app.post("/api/posts/:id/like", isAuthenticated, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.session.user.id;

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Ungültige Beitrags-ID." });
    }

    // Check if post exists
    const [posts] = await dbPool.query(
      `SELECT * FROM ${POSTS_TABLE} WHERE id = ?`,
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: "Beitrag nicht gefunden." });
    }

    // Check if user already liked this post
    const [existingLikes] = await dbPool.query(
      `SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?`,
      [postId, userId]
    );

    let likeCount;

    if (existingLikes.length === 0) {
      // Add like
      await dbPool.query(
        `INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)`,
        [postId, userId]
      );
    } else {
      // Remove like
      await dbPool.query(
        `DELETE FROM post_likes WHERE post_id = ? AND user_id = ?`,
        [postId, userId]
      );
    }

    // Get updated like count
    const [countResult] = await dbPool.query(
      `SELECT COUNT(*) as count FROM post_likes WHERE post_id = ?`,
      [postId]
    );

    likeCount = countResult[0].count;

    return res.status(200).json({ success: true, likeCount });
  } catch (error) {
    console.error(`Error toggling like: ${error}`);
    res.status(500).json({ message: "Serverfehler beim Aktualisieren des Beitrags." });
  }
});

// Submit mood rating for a post
app.post("/api/posts/:id/mood", isAuthenticated, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.session.user.id;
    const { moodValue } = req.body;

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Ungültige Beitrags-ID." });
    }

    // Validate mood value (between 0 and 100)
    if (moodValue < 0 || moodValue > 100 || isNaN(moodValue)) {
      return res.status(400).json({ message: "Ungültiger Stimmungswert." });
    }

    // Check if post exists
    const [posts] = await dbPool.query(
      `SELECT * FROM ${POSTS_TABLE} WHERE id = ?`,
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: "Beitrag nicht gefunden." });
    }

    // First delete existing mood if present (REPLACE would be better but using DELETE+INSERT for clarity)
    await dbPool.query(
      `DELETE FROM post_moods WHERE post_id = ? AND user_id = ?`,
      [postId, userId]
    );

    // Add new mood rating
    await dbPool.query(
      `INSERT INTO post_moods (post_id, user_id, value) VALUES (?, ?, ?)`,
      [postId, userId, moodValue]
    );

    // Calculate average mood
    const [avgResult] = await dbPool.query(
      `SELECT AVG(value) as avg_mood, COUNT(*) as count FROM post_moods WHERE post_id = ?`,
      [postId]
    );

    const avgMood = avgResult[0].avg_mood ? Math.round(avgResult[0].avg_mood) : 50;
    const totalRatings = avgResult[0].count;

    return res.status(200).json({
      success: true,
      averageMood: avgMood,
      userMood: moodValue,
      totalRatings: totalRatings
    });
  } catch (error) {
    console.error(`Error updating mood: ${error}`);
    res.status(500).json({ message: "Serverfehler beim Aktualisieren der Stimmung." });
  }
});

// Add a new endpoint to check maintenance status
app.get('/api/maintenance/status', (req, res) => {
  res.json({
    inMaintenance: maintenanceMode.enabled,
    message: maintenanceMode.message
  });
});

// Add endpoint to toggle maintenance mode - requires admin authentication
app.post('/api/maintenance/toggle', isAdmin, async (req, res) => {
  try {
    const { enabled, message, allowAdminAccess } = req.body;

    maintenanceMode = {
      enabled: enabled !== undefined ? enabled : maintenanceMode.enabled,
      message: message || maintenanceMode.message,
      allowAdminAccess: allowAdminAccess !== undefined ? allowAdminAccess : maintenanceMode.allowAdminAccess
    };

    res.json({ success: true, maintenanceMode });
  } catch (error) {
    console.error('Error updating maintenance mode:', error);
    res.status(500).json({ message: "Fehler beim Aktualisieren des Wartungsmodus." });
  }
});

// Middleware to check maintenance mode for all routes except admin and API routes
app.use((req, res, next) => {
  // Skip maintenance check for maintenance API endpoints and admin users
  if (req.path.startsWith('/api/maintenance') ||
    (maintenanceMode.allowAdminAccess && req.session.user && req.session.user.isAdmin)) {
    return next();
  }

  // Check if maintenance mode is enabled
  if (maintenanceMode.enabled && !req.path.startsWith('/api/')) {
    // For API requests, respond with JSON
    if (req.xhr || req.path.startsWith('/api')) {
      return res.status(503).json({
        error: 'maintenance',
        message: maintenanceMode.message
      });
    }
    // For regular page requests, we just pass through
  }

  next();
});

// Get comments for a post
app.get("/api/posts/:id/comments", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Ungültige Beitrags-ID." });
    }

    // Fetch comments for this post
    const [comments] = await dbPool.query(`
      SELECT id, user_id, username, content, created_at 
      FROM post_comments 
      WHERE post_id = ? 
      ORDER BY created_at DESC
    `, [postId]);

    // Format dates for each comment
    const formattedComments = comments.map(comment => ({
      ...comment,
      createdAt: formatDate(comment.created_at)
    }));

    return res.status(200).json({ comments: formattedComments });
  } catch (error) {
    console.error(`Error fetching comments: ${error}`);
    res.status(500).json({ message: "Fehler beim Laden der Kommentare." });
  }
});

// Add a comment to a post
app.post("/api/posts/:id/comments", isAuthenticated, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.session.user.id;
    const username = req.session.user.username;
    const { content } = req.body;

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Ungültige Beitrags-ID." });
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: "Kommentarinhalt darf nicht leer sein." });
    }

    // Check if post exists
    const [posts] = await dbPool.query(`SELECT * FROM ${POSTS_TABLE} WHERE id = ?`, [postId]);

    if (posts.length === 0) {
      return res.status(404).json({ message: "Beitrag nicht gefunden." });
    }

    // Add comment to database
    const [result] = await dbPool.query(`
      INSERT INTO post_comments (post_id, user_id, username, content)
      VALUES (?, ?, ?, ?)
    `, [postId, userId, username, content]);

    // Get the newly created comment
    const [newComments] = await dbPool.query(`
      SELECT id, user_id, username, content, created_at 
      FROM post_comments 
      WHERE id = ?
    `, [result.insertId]);

    if (newComments.length === 0) {
      return res.status(500).json({ message: "Fehler beim Erstellen des Kommentars." });
    }

    const comment = newComments[0];

    return res.status(201).json({
      message: "Kommentar erfolgreich erstellt.",
      comment: {
        ...comment,
        createdAt: formatDate(comment.created_at)
      }
    });
  } catch (error) {
    console.error(`Error adding comment: ${error}`);
    res.status(500).json({ message: "Serverfehler beim Erstellen des Kommentars." });
  }
});

// Helper function to format dates nicely for comments
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Gerade eben';
  if (diffMins < 60) return `Vor ${diffMins} ${diffMins === 1 ? 'Minute' : 'Minuten'}`;
  if (diffHours < 24) return `Vor ${diffHours} ${diffHours === 1 ? 'Stunde' : 'Stunden'}`;
  if (diffDays < 7) return `Vor ${diffDays} ${diffDays === 1 ? 'Tag' : 'Tagen'}`;

  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}