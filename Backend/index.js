// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require dotenv for environment variables
require('dotenv').config();

const mongoose = require('mongoose');
const express = require("express");
const v1WorkoutRouter = require("./v1/routes/workoutRoutes");

// NUEVO
const v1ProductRouter = require("./APIv1/Routes/product_Routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/api/v1/workouts", v1WorkoutRouter);

// NUEVO
app.use("/api/v1/products", v1ProductRouter);

// Si ninguna ruta coincide ninguna route manda esto
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