/*const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB verbunden');
    } catch (error) {
      console.error('Datenbankfehler:', error);
      process.exit(1);
    }
  };

module.exports = connectDB;
*/