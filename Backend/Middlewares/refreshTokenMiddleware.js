// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Create an instance of refreshTokenDAL (data access layer)
const refreshTokenDAL = require('../DataAccess/refreshTokenDAL');

const refreshTokenExist = async (req, res, next) => {
    // Collect refreshToken email from request body
    const userEmail = req.body.email;

    // Verify refreshToken in database
    const refreshTokenExists = await refreshTokenDAL.refreshTokenExist(userEmail);
    if (refreshTokenExists instanceof Error) {
        const http500 = httpMsgHandler.code500('Error verifying Refresh Token', refreshTokenExists.message);
        return res.status(http500.code).send(http500);
    }
    if (!refreshTokenExists) {
        const http404 = httpMsgHandler.code404('Refresh Token not found');
        return res.status(http404.code).send(http404);
    }
    // Middleware passed successfully
    next();
}

module.exports = {
    refreshTokenExist
};