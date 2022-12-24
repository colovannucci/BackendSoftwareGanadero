// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Create an instance of User data access layer
const userDAL = require('../DataAccess/userDAL');

const isNotBlocked = async (req, res, next) => {
    // Collect user email from request body
    const userEmail = req.body.email;
    // Verify if user has a blocked status in database
    const blockedStatusFound = await userDAL.getUserBlockedStatus(userEmail);
    if (blockedStatusFound instanceof Error) {
        return httpMsgHandler.code500('Error getting User Blocked status', blockedStatusFound.message);
    }
    // Check if the user is blocked
    if (blockedStatusFound) {
        return httpMsgHandler.code403("Blocked User");
    }
    // Middleware passed successfully
    next();
}

module.exports = {
    isNotBlocked
};