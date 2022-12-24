// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Create an instance of accessToken data access layer
const accessTokenDAL = require('../DataAccess/accessTokenDAL');

const accessTokenExist = async (req, res, next) => {
    // Collect accessToken email from request body
    const userEmail = req.body.email;

    // Verify accessToken in database
    const accessTokenExists = await accessTokenDAL.accessTokenExist(userEmail);
    if (accessTokenExists instanceof Error) {
        const http500 = httpMsgHandler.code500('Error verifying Access Token', accessTokenExists.message);
        return res.status(http500.code).send(http500);
    }
    if (!accessTokenExists) {
        const http404 = httpMsgHandler.code404('Access Token not found');
        return res.status(http404.code).send(http404);
    }
    // Middleware passed successfully
    next();
}

module.exports = {
    accessTokenExist
};