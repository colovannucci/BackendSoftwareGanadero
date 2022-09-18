// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const express = require("express");
const app = express();

// CORS - Cross-Origin Resource Sharing
const cors = require('cors');
//app.use(cors())
app.use(cors({ origin: '*', methods: ['GET','POST', 'PATCH', 'DELETE']}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Protect the routes with an db connection middleware.
const dbConnectionMiddleware = require('./Middlewares/dbConnectionMiddleware');
app.use(dbConnectionMiddleware);

// Application routes
const v1UserRouter = require("./Routes/userRoutes");
app.use("/api/v1/user", v1UserRouter);

const v1SystemRouter = require("./Routes/systemRoutes");
app.use("/api/v1/system", v1SystemRouter);

// If any route matches, request fails and send this
app.use('*', (req, res) => {
  res.status(404).send({ status: "ERROR", message: "Are you lost?" });
});

module.exports = app;