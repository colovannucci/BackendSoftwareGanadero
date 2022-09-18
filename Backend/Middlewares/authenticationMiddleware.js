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

const isAuthenticated = async (req, res, next) => {
    // Get Authorization header value
    const authHeader = req.headers['authorization']
    // Check if authorization header was provided
    if (!authHeader) {
        let http400 = httpMsgHandler.code400('Authorization Header required');
        return res.status(http400.code).send(http400);
    }
    
    // Collect access token from authorization header
    const userToken = authHeader.split(' ')[1];
    if (userToken == null) {
        let http400 = httpMsgHandler.code400('Bearer Token required in Header');
        return res.status(http400.code).send(http400);
    }

    // Create http code 403 response when user is not authorized to use it later
    const http403 = httpMsgHandler.code403('Not authorized to access');
    // Verify access token in database, if it exists indicate that the user has an active session
    const accessTokenFound = await accessTokenDAL.getAccessToken(userToken);
    if (accessTokenFound instanceof Error) {
        let http500 = httpMsgHandler.code500('Error getting Access token', accessTokenFound.message);
        return res.status(http500.code).send(http500);
    }
    if (accessTokenFound) {
        // Verify access token provided is the same as we have saved in database
        if (accessTokenFound == userToken) {
            // Check if access token is valid
            const isTokenValid = accessTokenHandler.verifyAccessToken(userToken);
            if (isTokenValid instanceof Error) {
                return res.status(http403.code).send(http403);
            }
            // Middleware passed successfully
            next();
        } else {
            return res.status(http403.code).send(http403);
        }
    } else{
        return res.status(http403.code).send(http403);
    }
}

module.exports = isAuthenticated;