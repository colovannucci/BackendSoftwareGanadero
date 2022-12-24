// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Create an instance of AccessToken data access layer
const accessTokenDAL = require('../DataAccess/accessTokenDAL');
// Require handler access token
const accessTokenHandler = require('../Helpers/handleAccessToken');

const hasAuthorizationHeader = async (req, res, next) => {
    // Get Authorization header value
    const authHeaderValue = req.get('Authorization');
    // Check if authorization header was provided
    if (!authHeaderValue) {
        let http400 = httpMsgHandler.code400('Authorization Header required');
        return res.status(http400.code).send(http400);
    }
    // Middleware passed successfully
    next();
}

const hasBearerToken = async (req, res, next) => {
    // Get Authorization header value
    const authHeaderValue = req.get('Authorization');
    // Collect token value from authorization header
    const userToken = authHeaderValue.split(' ')[1];
    if (userToken == null) {
        let http400 = httpMsgHandler.code400('Bearer Token required in Authorization Header');
        return res.status(http400.code).send(http400);
    }
    // Middleware passed successfully
    next();
}

const hasAccessToken = async (req, res, next) => {
    // Get Authorization header value
    const authHeaderValue = req.get('Authorization');
    // Collect token value from authorization header
    const userToken = authHeaderValue.split(' ')[1];

    // Verify access token in database, if it exists indicate that the user has an active session
    const accessTokenFound = await accessTokenDAL.getAccessToken(userToken);
    if (accessTokenFound instanceof Error) {
        let http500 = httpMsgHandler.code500('Error getting Access Token', accessTokenFound.message);
        return res.status(http500.code).send(http500);
    }
    
    // Check if the access token was found
    if (!accessTokenFound){
        const http404 = httpMsgHandler.code401('Access Token not found');
        return res.status(http404.code).send(http404);
    }

    // Middleware passed successfully
    next();
}

const isAuthorized = async (req, res, next) => {
    // Get Authorization header value
    const authHeaderValue = req.get('Authorization');
    // Collect token value from authorization header
    const userToken = authHeaderValue.split(' ')[1];

    // Check if access token is valid and does not expired yet
    const isTokenValid = accessTokenHandler.verifyAccessToken(userToken);
    if (isTokenValid instanceof Error) {
        const http401 = httpMsgHandler.code403('You do not have permission to access on this route');
        return res.status(http401.code).send(http401);
    }
    // Middleware passed successfully
    next();
}

module.exports = {
    hasAuthorizationHeader,
    hasBearerToken,
    hasAccessToken,
    isAuthorized
};