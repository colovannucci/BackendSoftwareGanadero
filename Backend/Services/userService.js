// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require user validator fields
const userValidator = require('../Validators/userValidator');
// Create an instance of RefreshToken data access layer
const refreshTokenDAL = require('../DataAccess/refreshTokenDAL');
// Create an instance of AccessToken data access layer
const accessTokenDAL = require('../DataAccess/accessTokenDAL');
// Create an instance of User data access layer
const userDAL = require('../DataAccess/userDAL');

const getUser = async (userEmail) => {
    // Check if user email was provided
    if (!userEmail){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Search user in database
    const userFound = await userDAL.getUser(userEmail);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting User', userFound.message);
    }
    if (!userFound) {
        return httpMsgHandler.code404("User not found");
    }

    // Create an object to show user found
    const userData = {
        user: userFound
    };
    return httpMsgHandler.code200("User found successfully", userData);
}

const updateUser = async (userEmail, userData) => {
    // Check if user email was provided
    if (!userEmail){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Check if user email exists in database
    const userExists = await userDAL.getUser(userEmail);
    if (userExists instanceof Error) {
        return httpMsgHandler.code500('Error getting User', userExists.message);
    }
    if (!userExists) {
        return httpMsgHandler.code404("User not found");
    }

    // Check if the user is not trying to update the email address
    if (userData.email){
        return httpMsgHandler.code400("User email cannot be updated");
    }
    // Check if body has only valid fields
    const hasValidFields = await userValidator.hasValidFields(userData);
    if (!hasValidFields) {
        return httpMsgHandler.code400("Invalid fields added on body");
    }
    
    // Update user in database
    const userUpdated = await userDAL.updateUser(userEmail, userData);
    if (userUpdated instanceof Error) {
        return httpMsgHandler.code500('Error updating User', userUpdated.message);
    }

    // Search updated user in database
    const userFound = await userDAL.getUser(userEmail);
    if (userFound instanceof Error) {
        // The user was updated successfully but the server had an error retrieving the user details
        // It will return an http error response
        userFound = "Error getting Updated User";
    }
    // Create an object to show updateduser found
    const updatedUser = {
        user: userFound
    };

    return httpMsgHandler.code200('User updated successfully', updatedUser);
}

const deleteUser = async (userEmail) => {
    // Check if user email was provided
    if (!userEmail){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Check if user email exists in database
    const userExists = await userDAL.getUser(userEmail);
    if (userExists instanceof Error) {
        return httpMsgHandler.code500('Error getting user', userExists.message);
    }
    if (!userExists) {
        return httpMsgHandler.code404("User not found");
    }

    // Verify access token in database, if it exists indicate that the user has an active token
    const accessTokenFound = await accessTokenDAL.getAccessTokenByEmail(userEmail);
    if (accessTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Access token', accessTokenFound.message);
    }
    if (accessTokenFound) {
        // Delete user access token in database
        const accessTokenDeleted = accessTokenDAL.deleteAccessToken(userEmail);
        if (accessTokenDeleted instanceof Error) {
            return httpMsgHandler.code500('Error deleting Access Token', accessTokenDeleted.message);
        }
    }
    
    // Verify refresh token in database, if it exists indicate that the user has an active token
    const refreshTokenFound = await refreshTokenDAL.getRefreshTokenByEmail(userEmail);
    if (refreshTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Refresh Token', refreshTokenFound.message);
    }
    if (refreshTokenFound) {
        // Delete user refresh token in database
        const refreshTokenDeleted = refreshTokenDAL.deleteRefreshToken(userEmail);
        if (refreshTokenDeleted instanceof Error) {
            return httpMsgHandler.code500('Error deleting Refresh Token', refreshTokenDeleted.message);
        }
    }
    
    // Delete user in database
    const userDeleted = await userDAL.deleteUser(userEmail);
    if (userDeleted instanceof Error) {
        return httpMsgHandler.code500('Error deleting User', userDeleted.message);
    }

    return httpMsgHandler.code200('User deleted successfully');
}

module.exports = {
    getUser,
    updateUser,
    deleteUser
}