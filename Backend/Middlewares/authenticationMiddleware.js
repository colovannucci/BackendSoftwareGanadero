// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler jwt library
const jwt = require('jsonwebtoken')

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require handler access token
const accessTokenHandler = require('../Helpers/handleAccessToken');
// Create an instance of AccessToken data access layer
const accessTokenDAL = require('../DataAccess/accessTokenDAL');

async function isAuthenticated( req, res, next){
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

    // Verify access token in database, if it exists indicate that the user has an active session
    const accessTokenFound = await accessTokenDAL.getAccessToken(userToken);
    if (accessTokenFound instanceof Error) {
        let http500 = httpMsgHandler.code500('Error getting Access token', accessTokenFound.message);
        return res.status(http500.code).send(http500);
    }
    if (accessTokenFound) {
        // Check if access token is valid
        const isTokenValid = accessTokenHandler.verifyAccessToken(userToken);
        if (isTokenValid instanceof Error) {
            let http403 = httpMsgHandler.code403('Not authorized to access');
            return res.status(http403.code).send(http403);
        }
        // Middleware passed successfully
        next();
    } else{
        let http404 = httpMsgHandler.code404('Access Token not found');
        return res.status(http404.code).send(http404);
    }
}

module.exports = isAuthenticated;