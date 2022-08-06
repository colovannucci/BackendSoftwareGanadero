// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require dotenv for environment variables
require('dotenv').config();

var cors = require('cors')

const mongoose = require('mongoose');
const express = require("express");



const app = express();
const PORT = process.env.PORT || 3001;


// CORS
app.use(cors({ origin: '*' }));

// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
app.use(express.json());

const v1ProductRouter = require("./Routes/product_routes");
app.use("/api/v1/products", v1ProductRouter);

const v1UserRouter = require("./Routes/user_routes");
app.use("/api/v1/users", v1UserRouter);

const v1AuthorizationRouter = require("./Routes/authorization_routes");
app.use("/api/v1/auth", v1AuthorizationRouter);

const v1AccessTokenRouter = require("./Routes/access_token_routes");
app.use("/api/v1/accesstokens", v1AccessTokenRouter);

/*
const v1TestRouter = require(".//Routes/test_routes");
app.use("/api/v1/test", v1TestRouter);
*/

// If any route matches, request fails and send this
app.use('*', (req, res) => {
  res.status(404).send({ status: "ERROR", message: "Are you lost?" });
});


// MondoDB connection
mongoose.connect(process.env.MONGO_DB_URI, (err, res) => {
    if (err) { return console.log(`Error connecting to database: ${err}`)};
    console.log('Connected to MongoDB');

    // Server connection
    app.listen(PORT, () => {
        console.log(`Web server listening on port ${PORT}`)
    });
    // Web server created
});