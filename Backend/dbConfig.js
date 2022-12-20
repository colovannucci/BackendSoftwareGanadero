// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require dotenv for environment variables
require('dotenv').config();
//const URI_MONGO = "mongodb://localhost:27017/Test";
const URI_MONGO = process.env.MONGO_DB_URI;

// Require mongoose to connect to the database
const mongoose = require("mongoose");
const connectDB = () => {
    return mongoose.connect(URI_MONGO, (err, res) => {
        if (err) {
          process.env.DB_CONNECTED = "N";
          console.log(`Error connecting to database: ${err}`);
        }
        process.env.DB_CONNECTED = "Y";
        console.log(`Connected to MongoDB`);
    })
};

module.exports = connectDB;