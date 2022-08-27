// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler jwt library
const jwt = require('jsonwebtoken')

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require handler access token
const accessTokenHandler = require('../Helpers/handleAccessToken');

function isAuthenticated( req, res, next){
    const authHeader = req.headers['authorization']
    
    if (!authHeader) {
        let http400 = httpMsgHandler.code400('Authorization Header required');
        return res.status(http400.code).send(http400);
    }
    
    // Collect access token from header
    const userToken = authHeader.split(' ')[1];
    if (userToken == null) {
        let http400 = httpMsgHandler.code400('Bearer Token required in Header');
        return res.status(http400.code).send(http400);
    }

    const isTokenValid = accessTokenHandler.verifyAccessToken(userToken);
    if (isTokenValid instanceof Error) {
        let http403 = httpMsgHandler.code403('Not authorized to access');
        return res.status(http403.code).send(http403);
        //let http500 = httpMsgHandler.code500('Error verifying access token', isTokenValid.message);
        //return res.status(http500.code).send(http500);
    }
    
    next();
}

module.exports = isAuthenticated;