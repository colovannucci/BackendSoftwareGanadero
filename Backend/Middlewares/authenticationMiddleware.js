// Use restrictive JS mode to avoid silence errors of the project
'use strict'

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
        let http400 = httpMsgHandler.code400('Bearer Token required in Authorization Header');
        return res.status(http400.code).send(http400);
    }

    // Create http code 401 response when user is not authorized to use it later
    const http401 = httpMsgHandler.code401('Not authorized to access this route');
    // Verify access token in database, if it exists indicate that the user has an active session
    const accessTokenFound = await accessTokenDAL.getAccessToken(userToken);
    if (accessTokenFound instanceof Error) {
        let http500 = httpMsgHandler.code500('Error getting Access Token', accessTokenFound.message);
        return res.status(http500.code).send(http500);
    }
    if (accessTokenFound) {
        // Check if access token is valid and does not expired yet
        const isTokenValid = accessTokenHandler.verifyAccessToken(userToken);
        if (isTokenValid instanceof Error) {
            return res.status(http401.code).send(http401);
        }
        // Middleware passed successfully
        next();
    } else{
        // 401 Access Token not found
        return res.status(http401.code).send(http401);
    }
}

module.exports = isAuthenticated;