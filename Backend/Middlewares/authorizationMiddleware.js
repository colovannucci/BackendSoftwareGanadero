// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require handler access token
const accessTokenHandler = require('../Helpers/handleAccessToken');
// Create an instance of accessTokenDAL (data access layer)
const accessTokenDAL = require('../DataAccess/accessTokenDAL');

const hasAuthorizationHeader = async (req, res, next) => {
    // Get Authorization header value
    const authHeaderValue = req.get('Authorization');
    // Check if authorization header was provided
    if (!authHeaderValue) {
        const http400 = httpMsgHandler.code400('Authorization Header required');
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
        const http400 = httpMsgHandler.code400('Bearer Token required in Authorization Header');
        return res.status(http400.code).send(http400);
    }
    // Middleware passed successfully
    next();
}

const isAuthorized = async (req, res, next) => {
    // Get Authorization header value
    const authHeaderValue = req.get('Authorization');
    // Collect token value from authorization header
    const userToken = authHeaderValue.split(' ')[1];
    // Collect accessToken email from request body
    const userEmail = req.body.email;

    // Verify if user has a refresh token in database
    const accessTokenFound = await accessTokenDAL.getAccessToken(userEmail);
    if (accessTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Access Token', accessTokenFound.message);
    }

    // Check if access token is valid and does not expired yet
    if (accessTokenFound == userToken) {
        const isAccessTokenValid = await accessTokenHandler.verifyAccessToken(userToken);
        if (isAccessTokenValid instanceof Error) {
            const http401 = httpMsgHandler.code401('You do not have permission to access on this route');
            return res.status(http401.code).send(http401);
        }
    } else {
        return httpMsgHandler.code401("Access Token provided does not belongs to the User");
    }
    
    // Middleware passed successfully
    next();
}

module.exports = {
    hasAuthorizationHeader,
    hasBearerToken,
    isAuthorized
};