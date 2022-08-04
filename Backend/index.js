// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require dotenv for environment variables
require('dotenv').config();

const mongoose = require('mongoose');
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;

// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
app.use(express.json());

const v1ProductRouter = require("./APIv1/Routes/product_routes");
app.use("/api/v1/products", v1ProductRouter);

const v1UserRouter = require("./APIv1/Routes/user_routes");
app.use("/api/v1/users", v1UserRouter);


// If any route matches, request fails and send this
app.use('*', (req, res) => {
  res.status(404).send("Parece que te has perdido");
});

// MondoDB connection
mongoose.connect('mongodb://localhost:27017/shops', (err, res) => {
    if (err) { return console.log(`Error connecting to database: ${err}`)};
    console.log('Connected to MongoDB');

    // Server connection
    app.listen(PORT, () => {
        console.log(`Web server listening on port ${PORT}`)
    });
    // Web server created
});