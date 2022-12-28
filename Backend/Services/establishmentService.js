// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require establishmentValidator functions
const establishmentValidator = require('../Validators/establishmentValidator');
// Create an instance of establishmentDAL (data access layer)
const establishmentDAL = require('../DataAccess/establishmentDAL');

const getAllEstablishments = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    
    // Search user in database
    const userFound = await establishmentDAL.getAllEstablishments(userData.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting User', userFound.message);
    }
    
    // Create an object to show user found
    const userDataValues = {
        user: userFound
    };

    return httpMsgHandler.code200("User found successfully", userDataValues);
}

const getEstablishment = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    
    // Search user in database
    const userFound = await establishmentDAL.getEstablishment(userData.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting User', userFound.message);
    }
    
    // Create an object to show user found
    const userDataValues = {
        user: userFound
    };

    return httpMsgHandler.code200("User found successfully", userDataValues);
}

const createEstablishment = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    
    // Search user in database
    const userFound = await establishmentDAL.createEstablishment(userData.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting User', userFound.message);
    }
    
    // Create an object to show user found
    const userDataValues = {
        user: userFound
    };

    return httpMsgHandler.code201('User Signed Up successfully', userSaved);
}

const updateEstablishment = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }

    // Collect user email value
    const userEmail = userData.email;
    // Remove email field from updatable data
    delete userData.email;

    // Check if body has only valid fields
    const hasUpdatableFields = await establishmentValidator.hasUpdatableFields(userData);
    if (!hasUpdatableFields) {
        return httpMsgHandler.code400("Invalid fields added on body");
    }
    
    // Update user in database
    const userUpdated = await establishmentDAL.updateEstablishment(userEmail, userData);
    if (userUpdated instanceof Error) {
        return httpMsgHandler.code500('Error updating User', userUpdated.message);
    }

    // Search updated user in database
    const userFound = await establishmentDAL.getEstablishment(userEmail);
    if (userFound instanceof Error) {
        // The user was updated successfully but the server had an error retrieving the values
        userFound = "Error getting updated User data";
    }
    // Create an object to show updateduser found
    const updatedUser = {
        user: userFound
    };

    return httpMsgHandler.code200('User updated successfully', updatedUser);
}

const deleteEstablishment = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    
    // Delete user in database
    const userDeleted = await establishmentDAL.deleteEstablishment(userData.email);
    if (userDeleted instanceof Error) {
        return httpMsgHandler.code500('Error deleting User', userDeleted.message);
    }

    return httpMsgHandler.code200('User deleted successfully');
}

module.exports = {
    getAllEstablishments,
    getEstablishment,
    createEstablishment,
    updateEstablishment,
    deleteEstablishment
}