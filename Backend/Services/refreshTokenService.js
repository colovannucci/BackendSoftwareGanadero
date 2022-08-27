// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Create an instance of User Schema
const refreshTokenDAL = require('../DataAccess/refreshTokenDAL');


const getAllRefreshTokens = async () => {

    const allRefreshTokens = await refreshTokenDAL.getAllRefreshTokens();
    if (allRefreshTokens instanceof Error) {
        return httpMsgHandler.code500('Error getting Refresh Token', allUsers.message);
    }
    if (!allRefreshTokens) {
        return httpMsgHandler.code404("Refresh Tokens doesn't found");
    }

    return httpMsgHandler.code200(allRefreshTokens);
}

const getRefreshToken = async (userEmail) => {
    // Check if user email was provided
    if (!userEmail){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Search user in database
    const refreshTokenFound = await refreshTokenDAL.getRefreshToken(userEmail);
    if (refreshTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting refresh Token', refreshTokenFound.message);
    }
    if (!refreshTokenFound) {
        return httpMsgHandler.code400("Refresh Token not found");
    }
    return httpMsgHandler.code200(refreshTokenFound);
}

const createRefreshToken = async (userData) => {

    // Check if body has all required fields
    if (!userData.email) {
        return httpMsgHandler.code400("Missing email on body");
    }

    // Check if RefreshToken exists in database
    const refreshTokenExists = await refreshTokenDAL.getRefreshToken(userData.email);
    if (refreshTokenExists instanceof Error) {
        return httpMsgHandler.code500('Error getting RefreshToken', refreshTokenExists.message);
    }
    if (refreshTokenExists) {
        return httpMsgHandler.code400("RefreshToken already exists");
    }
    // Create RefreshToken in database
    const refreshTokenSaved = await refreshTokenDAL.createRefreshToken(userData);
    if (refreshTokenSaved instanceof Error) {
        return httpMsgHandler.code500('Error saving Refresh token', refreshTokenSaved.message);
    }
    return httpMsgHandler.code201('Refresh token created successfully', refreshTokenSaved);
}

const deleteRefreshToken = async (userEmail) => {
    // Check if RefreshToken email was provided
    if (!userEmail){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Check if RefreshToken exists in database
    const refreshTokenExists = await refreshTokenDAL.getRefreshToken(userEmail);
    if (refreshTokenExists instanceof Error) {
        return httpMsgHandler.code500('Error getting RefreshToken', refreshTokenExists.message);
    }
    if (!refreshTokenExists) {
        return httpMsgHandler.code400("RefreshToken doesn't exists");
    }

    // Delete RefreshToken in database
    const refreshTokenDeleted = await refreshTokenDAL.deleteRefreshToken(userEmail);
    if (refreshTokenDeleted instanceof Error) {
        return httpMsgHandler.code500('Error deleting RefreshToken', refreshTokenDeleted.message);
    }
    return httpMsgHandler.code200('RefreshToken deleted successfully');
}

module.exports = {
    getAllRefreshTokens,
    getRefreshToken,
    createRefreshToken,
    deleteRefreshToken
}