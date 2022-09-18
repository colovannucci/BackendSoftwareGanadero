// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require dotenv for environment variables
require('dotenv').config();

const mongoose = require('mongoose');
//const URI_MONGO = "mongodb://localhost:27017/Test";
const URI_MONGO = process.env.MONGO_DB_URI;
// MondoDB connection
mongoose.connect(URI_MONGO, (err, res) => {
  if (err) {
    process.env.DB_CONNECTED = "N";
    return console.log(`Error connecting to database: ${err}`);
  }
  process.env.DB_CONNECTED = "Y";
  return console.log(`Connected to MongoDB`);
});

const app = require('./application');
const PORT = process.env.PORT;// || 3001;
// Web server connection
app.listen(PORT, () => { console.log(`Web server listening on port ${PORT}`) });