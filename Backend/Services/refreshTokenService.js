// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Create an instance of refreshTokenDAL (data access layer)
const refreshTokenDAL = require('../DataRefresh/refreshTokenDAL');

const getAllRefreshTokens = async () => {
    // Search all Refresh tokens in database
    const allRefreshTokens = await refreshTokenDAL.getAllRefreshTokens();
    if (allRefreshTokens instanceof Error) {
        return httpMsgHandler.code500('Error getting Refresh Tokens', allRefreshTokens.message);
    }
    if (!allRefreshTokens) {
        return httpMsgHandler.code404("Refresh Tokens does not found");
    }

    return httpMsgHandler.code200(allRefreshTokens);
}

const getRefreshToken = async (userEmail) => {
    // Check if user email was provided
    if (!userEmail){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Search Refresh Token in database
    const refreshTokenFound = await refreshTokenDAL.getRefreshToken(userEmail);
    if (refreshTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Refresh Token', refreshTokenFound.message);
    }
    if (!refreshTokenFound) {
        return httpMsgHandler.code404("Refresh Token not found");
    }
    return httpMsgHandler.code200(refreshTokenFound);
}

const createRefreshToken = async (userData) => {
    // Check if body has all required fields
    if (!userData.email) {
        return httpMsgHandler.code400("Missing email on body");
    }

    // Create Refresh Token in database
    const refreshTokenSaved = await refreshTokenDAL.createRefreshToken(userData);
    if (refreshTokenSaved instanceof Error) {
        return httpMsgHandler.code500('Error creating Refresh token', refreshTokenSaved.message);
    }

    return httpMsgHandler.code201('Refresh token created successfully', refreshTokenSaved);
}

const updateRefreshToken = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Check if new tocken was provided
    if (!userData.refreshToken){
        return httpMsgHandler.code400("Refresh Token was not provided");
    }

    // Update refresh token in database
    const refreshTokenUpdated = await refreshTokenDAL.updateRefreshToken(userData);
    if (refreshTokenUpdated instanceof Error) {
        return httpMsgHandler.code500('Error updating Refresh Token', refreshTokenUpdated.message);
    }

    // Search updated refresh token in database
    const refreshTokenFound = await refreshTokenDAL.getRefreshToken(userData.email);
    if (refreshTokenFound instanceof Error) {
        // The refresh token was updated successfully but the server had an error retrieving the values
        refreshTokenFound = "Error getting updated Refresh Token data";
    }
    // Create an object to show updateduser found
    const updatedRefreshToken = {
        refreshToken: refreshTokenFound
    };

    return httpMsgHandler.code200('Refresh Token updated successfully', updatedRefreshToken);
}

const deleteRefreshToken = async (userEmail) => {
    // Check if user email was provided
    if (!userEmail){
        return httpMsgHandler.code400("User email was not provided");
    }

    // Delete Refresh Token in database
    const refreshTokenDeleted = await refreshTokenDAL.deleteRefreshToken(userEmail);
    if (refreshTokenDeleted instanceof Error) {
        return httpMsgHandler.code500('Error deleting Refresh Token', refreshTokenDeleted.message);
    }
    
    return httpMsgHandler.code200('Refresh Token deleted successfully');
}

module.exports = {
    getAllRefreshTokens,
    getRefreshToken,
    createRefreshToken,
    updateRefreshToken,
    deleteRefreshToken
}