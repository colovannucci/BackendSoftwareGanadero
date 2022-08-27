// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require dotenv for environment variables
require('dotenv').config();


// MondoDB connection
const mongoose = require('mongoose');
//const URI_MONGO = "mongodb://localhost:27017/Test";
const URI_MONGO = process.env.MONGO_DB_URI;
mongoose.connect(URI_MONGO, (err, res) => {
    if (err) {
        return console.log(`Error connecting to database: ${err}`);
    }
    return console.log(`Connected to MongoDB`);
});


const express = require("express");
const app = express();

// CORS - Cross-Origin Resource Sharing
const cors = require('cors');
//app.use(cors())
app.use(cors({ origin: '*', methods: ['GET','POST', 'PATCH', 'DELETE']}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userTestRouter = require("./userTest");
app.use("/test/users", userTestRouter)

const systemTestRouter = require("./systemControlTest");
app.use("/test/system", systemTestRouter)

const refreshTokenTestRouter = require("./refreshTokenTest");
app.use("/test/refreshtokens", refreshTokenTestRouter)

// If any route matches, request fails and send this
app.use('*', (req, res) => {
    res.status(404).send({ status: "ERROR", message: "Are you lost?" });
});
  
;

const PORT = 4001;
// Web server connection
app.listen(PORT, () => { console.log(`Web server listening on port ${PORT}`) });



