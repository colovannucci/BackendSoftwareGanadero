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

const getUser = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    
    // Search user in database
    const userFound = await userDAL.getUser(userData.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting User', userFound.message);
    }
    
    // Create an object to show user found
    const userDataValues = {
        user: userFound
    };

    return httpMsgHandler.code200("User found successfully", userDataValues);
}

const updateUser = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }

    // Collect user email value
    const userEmail = userData.email;
    // Remove email field from updatable data
    delete userData.email;

    // Check if body has only valid fields
    const hasUpdatableFields = await userValidator.hasUpdatableFields(userData);
    if (!hasUpdatableFields) {
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
        userFound = "Error getting Updated User data";
    }
    // Create an object to show updateduser found
    const updatedUser = {
        user: userFound
    };

    return httpMsgHandler.code200('User updated successfully', updatedUser);
}

const deleteUser = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }

    // Delete user access token in database
    const accessTokenDeleted = accessTokenDAL.deleteAccessToken(userData.email);
    if (accessTokenDeleted instanceof Error) {
        return httpMsgHandler.code500('Error deleting Access Token', accessTokenDeleted.message);
    }

    // Delete user refresh token in database
    const refreshTokenDeleted = refreshTokenDAL.deleteRefreshToken(userData.email);
    if (refreshTokenDeleted instanceof Error) {
        return httpMsgHandler.code500('Error deleting Refresh Token', refreshTokenDeleted.message);
    }
    
    // Delete user in database
    const userDeleted = await userDAL.deleteUser(userData.email);
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