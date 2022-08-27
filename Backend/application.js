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


// Check if DB is connected with a middleware.
const dbConnectedMiddleware = require('./Middlewares/dbConnectionMiddleware');
app.use(dbConnectedMiddleware);


// Application routes
const v1ProductRouter = require("./Routes/product_routes");
app.use("/api/v1/products", v1ProductRouter);

const v1UserRouter = require("./Routes/user_routes");
app.use("/api/v1/users", v1UserRouter);

const v1AuthorizationRouter = require("./Routes/authorization_routes");
app.use("/api/v1/auth", v1AuthorizationRouter);

const v1AccessTokenRouter = require("./Routes/access_token_routes");
app.use("/api/v1/accesstokens", v1AccessTokenRouter);



// If any route matches, request fails and send this
app.use('*', (req, res) => {
  res.status(404).send({ status: "ERROR", message: "Are you lost?" });
});

module.exports = app;