// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require dotenv for environment variables
require('dotenv').config();
//const MONGO_DB_URI = "mongodb://localhost:27017/Test";
const MONGO_DB_URI = process.env.CUSTOMCONNSTR_MONGO_DB_URI;

// Require mongoose to connect to the database
const mongoose = require("mongoose");

// Database connection creation function
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB_URI);
    // Update environment variable
    process.env.APPSETTING_DB_CONNECTED = "Y";
    console.log('Connected to MongoDB');
  } catch (err) {
    // Update environment variable
    process.env.APPSETTING_DB_CONNECTED = "N";
    console.log('Failed to connect to MongoDB', err);
  }
}

module.exports = { 
  connectDB
};