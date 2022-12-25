// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Create an instance of User data access layer
const userDAL = require('../DataAccess/userDAL');

const userExist = async (req, res, next) => {
    // Collect user email from request body
    const userEmail = req.body.email;

    // Verify user in database
    const userExists = await userDAL.userExist(userEmail);
    if (userExists instanceof Error) {
        const http500 = httpMsgHandler.code500('Error verifying User', userExists.message);
        return res.status(http500.code).send(http500);
    }
    if (!userExists) {
        const http404 = httpMsgHandler.code404('User not found');
        return res.status(http404.code).send(http404);
    }
    // Middleware passed successfully
    next();
}

const userNotExist = async (req, res, next) => {
    // Collect user email from request body
    const userEmail = req.body.email;

    // Verify user in database
    const userExists = await userDAL.userExist(userEmail);
    if (userExists instanceof Error) {
        const http500 = httpMsgHandler.code500('Error verifying User', userExists.message);
        return res.status(http500.code).send(http500);
    }
    if (userExists) {
        const http400 = httpMsgHandler.code400('User already registered');
        return res.status(http400.code).send(http400);
    }
    // Middleware passed successfully
    next();
}

const isBlocked = async (req, res, next) => {
    // Collect user email from request body
    const userEmail = req.body.email;

    // Verify if user has a blocked status in database
    const blockedStatusFound = await userDAL.getUserBlockedStatus(userEmail);
    if (blockedStatusFound instanceof Error) {
        const http500 = httpMsgHandler.code500('Error getting User Blocked status', blockedStatusFound.message);
        return res.status(http500.code).send(http500);
    }
    // Check if the user is blocked
    if (!blockedStatusFound) {
        const http400 = httpMsgHandler.code400('The User is not Bocked', blockedStatusFound.message);
        return res.status(http400.code).send(http400);
    }
    // Middleware passed successfully
    next();
}

const isNotBlocked = async (req, res, next) => {
    // Collect user email from request body
    const userEmail = req.body.email;

    // Verify if user has a blocked status in database
    const blockedStatusFound = await userDAL.getUserBlockedStatus(userEmail);
    if (blockedStatusFound instanceof Error) {
        const http500 = httpMsgHandler.code500('Error getting User Blocked status', blockedStatusFound.message);
        return res.status(http500.code).send(http500);
    }
    // Check if the user is blocked
    if (blockedStatusFound) {
        const http403 = httpMsgHandler.code403('Blocked User', blockedStatusFound.message);
        return res.status(http403.code).send(http403);
    }
    // Middleware passed successfully
    next();
}

module.exports = {
    userExist,
    userNotExist,
    isBlocked,
    isNotBlocked
};