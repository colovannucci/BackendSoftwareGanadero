// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require handler access token
const accessTokenHandler = require('../Helpers/handleAccessToken');

const isAuthenticated = async (req, res, next) => {
    // Get Authorization header value
    const authHeaderValue = req.get('Authorization');
    // Collect token value from authorization header
    const userToken = authHeaderValue.split(' ')[1];

    // Check if access token is valid and does not expired yet
    const isTokenValid = accessTokenHandler.verifyAccessToken(userToken);
    if (isTokenValid instanceof Error) {
        const http403 = httpMsgHandler.code403('You do not have permission to access on this route');
        return res.status(http403.code).send(http403);
    }
    // Middleware passed successfully
    next();
}

module.exports = isAuthenticated;