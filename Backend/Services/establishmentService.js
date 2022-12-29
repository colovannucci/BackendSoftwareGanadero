// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require establishmentValidator functions
const establishmentValidator = require('../Validators/establishmentValidator');
// Create an instance of establishmentDAL (data access layer)
const establishmentDAL = require('../DataAccess/establishmentDAL');

const getAllEstablishments = async (establishmentData) => {
    // Check if user email was provided
    if (!establishmentData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    
    // Search user in database
    const userFound = await establishmentDAL.getAllEstablishments(establishmentData.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting User', userFound.message);
    }
    
    // Create an object to show user found
    const establishmentDataValues = {
        user: userFound
    };

    return httpMsgHandler.code200("User found successfully", establishmentDataValues);
}

const getEstablishment = async (establishmentData) => {
    // Check if user email was provided
    if (!establishmentData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    
    // Search user in database
    const userFound = await establishmentDAL.getEstablishment(establishmentData.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting User', userFound.message);
    }
    
    // Create an object to show user found
    const establishmentDataValues = {
        user: userFound
    };

    return httpMsgHandler.code200("User found successfully", establishmentDataValues);
}

const createEstablishment = async (establishmentData) => {
    /*
    // Check if user email was provided
    if (!establishmentData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    */
    // VALIDANCION DE CAMPOS, ETC

    // Save establishment in database
    const establishmentCreated = await establishmentDAL.createEstablishment(establishmentData);
    if (establishmentCreated instanceof Error) {
        return httpMsgHandler.code500('Error creating Establishment', establishmentCreated.message);
    }
    
    // Create an object to show user found
    const establishmentDataValues = {
        establishment: establishmentCreated
    };

    return httpMsgHandler.code201('Establishment Created successfully', establishmentDataValues);
}

const updateEstablishment = async (establishmentData) => {
    // Check if user email was provided
    if (!establishmentData.email){
        return httpMsgHandler.code400("User email was not provided");
    }

    // Collect user email value
    const userEmail = establishmentData.email;
    // Remove email field from updatable data
    delete establishmentData.email;

    // Check if body has only valid fields
    const hasUpdatableFields = await establishmentValidator.hasUpdatableFields(establishmentData);
    if (!hasUpdatableFields) {
        return httpMsgHandler.code400("Invalid fields added on body");
    }
    
    // Update user in database
    const userUpdated = await establishmentDAL.updateEstablishment(userEmail, establishmentData);
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

const deleteEstablishment = async (establishmentData) => {
    // Check if user email was provided
    if (!establishmentData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    
    // Delete user in database
    const userDeleted = await establishmentDAL.deleteEstablishment(establishmentData.email);
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