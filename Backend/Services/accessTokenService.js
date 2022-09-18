// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Create an instance of Access Token data access layer
const accessTokenDAL = require('../DataAccess/accessTokenDAL');


const getAllAccessTokens = async () => {
    // Search all Access tokens in database
    const allAccessTokens = await accessTokenDAL.getAllRefreshTokens();
    if (allAccessTokens instanceof Error) {
        return httpMsgHandler.code500('Error getting Access Token', allAccessTokens.message);
    }
    if (!allAccessTokens) {
        return httpMsgHandler.code404("Access Tokens does not found");
    }

    return httpMsgHandler.code200(allAccessTokens);
}

const getAccessTokenByEmail = async (userEmail) => {
    // Check if user email was provided
    if (!userEmail){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Search Access token in database
    const accessTokenFound = await accessTokenDAL.getAccessTokenByEmail(userEmail);
    if (accessTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Access Token', accessTokenFound.message);
    }
    if (!accessTokenFound) {
        return httpMsgHandler.code404("Access Token not found");
    }
    return httpMsgHandler.code200(accessTokenFound);
}

const createAccessToken = async (userData) => {
    // Check if body has all required fields
    if (!userData.email) {
        return httpMsgHandler.code400("Missing email on body");
    }

    // Check if Access Token exists in database
    const accessTokenExists = await accessTokenDAL.getAccessTokenByEmail(userData.email);
    if (accessTokenExists instanceof Error) {
        return httpMsgHandler.code500('Error getting Access Token', accessTokenExists.message);
    }
    if (refreshTokenExists) {
        return httpMsgHandler.code400("Access Token already exists");
    }

    // Create Access Token in database
    const accessTokenSaved = await accessTokenDAL.createAccessToken(userData);
    if (accessTokenSaved instanceof Error) {
        return httpMsgHandler.code500('Error saving Access token', accessTokenSaved.message);
    }
    return httpMsgHandler.code201('Access token created successfully', accessTokenSaved);
}

const updateAccessToken = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Check if new tocken was provided
    if (!userData.accessToken){
        return httpMsgHandler.code400("Access Token was not provided");
    }

    // Check if Refresh Token exists in database
    const accessTokenExists = await accessTokenDAL.getAccessTokenByEmail(userData.email);
    if (accessTokenExists instanceof Error) {
        return httpMsgHandler.code500('Error getting Access Token', accessTokenExists.message);
    }
    if (!accessTokenExists) {
        return httpMsgHandler.code400("Access Token does not exist");
    }
    
    // Update refresh token in database
    const accessTokenUpdated = await refreshTokenDAL.updateAccessToken(userData);
    if (accessTokenUpdated instanceof Error) {
        return httpMsgHandler.code500('Error updating Access Token', accessTokenUpdated.message);
    }
    return httpMsgHandler.code200('Access Token updated successfully');
}

const deleteAccessToken = async (userEmail) => {
    // Check if user email was provided
    if (!userEmail){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Check if Access Token exists in database
    const accessTokenExists = await accessTokenDAL.getAccessToken(userEmail);
    if (accessTokenExists instanceof Error) {
        return httpMsgHandler.code500('Error getting Access Token', accessTokenExists.message);
    }
    if (!accessTokenExists) {
        return httpMsgHandler.code404("Access Token doesn't exists");
    }

    // Delete Access Token in database
    const accessTokenDeleted = await accessTokenDAL.deleteAccessToken(userEmail);
    if (accessTokenDeleted instanceof Error) {
        return httpMsgHandler.code500('Error deleting Access Token', accessTokenDeleted.message);
    }
    return httpMsgHandler.code200('Access Token deleted successfully');
}

module.exports = {
    getAllAccessTokens,
    getAccessTokenByEmail,
    createAccessToken,
    updateAccessToken,
    deleteAccessToken
}