const mysql = require('mysql2/promise');
const dotenv = require("dotenv");

dotenv.config();

// Database connection configuration
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lennardtdatabase',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const createPool = async () => {
  try {
    const pool = mysql.createPool(DB_CONFIG);
    console.log("Database connection pool initialized");
    return pool;
  } catch (error) {
    console.error("Failed to create database connection pool:", error);
    throw error;
  }
};

module.exports = createPool;