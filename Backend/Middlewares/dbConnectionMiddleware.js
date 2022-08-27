// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require dotenv for environment variables
require('dotenv').config();

// Require handler http messages
const httpMessages = require('../Helpers/handleHttpMessage');

function isConnected ( req, res, next){
    const dbConnected = process.env.DB_CONNECTED;
    if (dbConnected === "Y") {
        next();
    } else {
        const http503 = httpMessages.code503('Database is not connected');
        return res.status(http503.code).send(http503);
    }
}

module.exports = isConnected;