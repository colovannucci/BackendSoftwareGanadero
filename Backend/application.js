// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require dotenv for environment variables
require('dotenv').config();
const PORT = process.env.PORT;

// Require express to create a server instance
const express = require("express");
const app = express();

// CORS - Cross-Origin Resource Sharing
const cors = require('cors');
//app.use(cors())
app.use(cors({ origin: '*', methods: ['GET','POST', 'PATCH', 'DELETE']}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Application routes
const v1SystemRouter = require("./Routes/systemRoutes");
app.use("/api/v1/system", v1SystemRouter);

const v1UserRouter = require("./Routes/userRoutes");
app.use("/api/v1/user", v1UserRouter);

// Send a message indicating the server is working properly
app.use('/test', (req, res) => {
  //res.send({ code: 204, status: "No Content", message: "Hello World! Welcome!" });
  res.send('Hello World! Welcome!');
});

// If none route matches the request will fail and sent this message
app.use('*', (req, res) => {
  res.status(404).send({ code: 404, status: "Not Found", message: "Empty Route! Are you lost?" });
});

// Web server connection function
const mainStart = async () => {
  try {
    await app.listen(PORT);
    console.log('Web server listening on port', PORT);
  } catch (err) {
    console.log('Failed to start the web server', err);
  }
}

module.exports = mainStart;