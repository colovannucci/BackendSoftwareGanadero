// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Create an instance of Refresh Token data access layer
const refreshTokenDAL = require('../DataAccess/refreshTokenDAL');

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

const getRefreshTokenByEmail = async (userEmail) => {
    // Check if user email was provided
    if (!userEmail){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Search Refresh Token in database
    const refreshTokenFound = await refreshTokenDAL.getRefreshTokenByEmail(userEmail);
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

    // Check if Refresh Token exists in database
    const refreshTokenExists = await refreshTokenDAL.getRefreshTokenByEmail(userData.email);
    if (refreshTokenExists instanceof Error) {
        return httpMsgHandler.code500('Error getting Refresh Token', refreshTokenExists.message);
    }
    if (refreshTokenExists) {
        return httpMsgHandler.code400("Refresh Token already exists");
    }

    // Create Refresh Token in database
    const refreshTokenSaved = await refreshTokenDAL.createRefreshToken(userData);
    if (refreshTokenSaved instanceof Error) {
        return httpMsgHandler.code500('Error saving Refresh token', refreshTokenSaved.message);
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

    // Check if Refresh Token exists in database
    const refreshTokenExists = await refreshTokenDAL.getRefreshTokenByEmail(userData.email);
    if (refreshTokenExists instanceof Error) {
        return httpMsgHandler.code500('Error getting Refresh Token', refreshTokenExists.message);
    }
    if (!refreshTokenExists) {
        return httpMsgHandler.code400("Refresh Token does not exist");
    }
    
    // Update refresh token in database
    const refreshTokenUpdated = await refreshTokenDAL.updateRefreshToken(userData);
    if (refreshTokenUpdated instanceof Error) {
        return httpMsgHandler.code500('Error updating Refresh Token', refreshTokenUpdated.message);
    }
    return httpMsgHandler.code200('Refresh Token updated successfully');
}

const deleteRefreshToken = async (userEmail) => {
    // Check if user email was provided
    if (!userEmail){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Check if Refresh Token exists in database
    const refreshTokenExists = await refreshTokenDAL.getRefreshToken(userEmail);
    if (refreshTokenExists instanceof Error) {
        return httpMsgHandler.code500('Error getting Refresh Token', refreshTokenExists.message);
    }
    if (!refreshTokenExists) {
        return httpMsgHandler.code404("Refresh Token doesn't exists");
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
    getRefreshTokenByEmail,
    createRefreshToken,
    updateRefreshToken,
    deleteRefreshToken
}