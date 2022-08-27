// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require user validator fields
const userValidator = require('../Validators/userValidator');
// Create an instance of User Schema
const userDAL = require('../DataAccess/userDAL');


const getAllUsers = async () => {

    const allUsers = await userDAL.getAllUsers();
    if (allUsers instanceof Error) {
        return httpMsgHandler.code500('Error getting users', allUsers.message);
    }
    if (!allUsers) {
        return httpMsgHandler.code404("Users doesn't found");
    }

    return httpMsgHandler.code200(allUsers);
}

const getUser = async (userEmail) => {
    // Check if user email was provided
    if (!userEmail){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Search user in database
    const userFound = await userDAL.getUser(userEmail);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting user', userFound.message);
    }
    if (!userFound) {
        return httpMsgHandler.code400("User not found");
    }
    return httpMsgHandler.code200(userFound);
}

const createUser = async (userData) => {

    // Check if body has all required fields
    const hasRequiredFields = await userValidator.hasRequiredFields(userData);
    if (!hasRequiredFields) {
        return httpMsgHandler.code400("Missing fields on body");
    }
    // Check if body has prohibited fields: cretedId, createdAt and updatedAt
    const hasProhibitedFields = await userValidator.hasProhibitedFields(userData);
    if (hasProhibitedFields) {
        return httpMsgHandler.code400("Prohibited fields added on body");
    }

    // Check if user email exists in database
    const userExists = await userDAL.getUser(userData.email);
    if (userExists instanceof Error) {
        return httpMsgHandler.code500('Error getting user', userExists.message);
    }
    if (userExists) {
        return httpMsgHandler.code400("User email already exists");
    }
    
    // Create user in database
    const userSaved = await userDAL.createUser(userData);
    if (userSaved instanceof Error) {
        return httpMsgHandler.code500('Error saving user', userSaved.message);
    }
    return httpMsgHandler.code201('User created successfully', userSaved);
}

const updateUser = async (userEmail, userData) => {
    //////////////////////////////////////////////////////
    // PENDING - QUITAR CUANDO SE AGREGUE FUNCIONALIDAD
    if (userData.email){
        return httpMsgHandler.code400("User email cannot be updated yet... Functionality pending");
    }
    // PENDING - QUITAR CUANDO SE AGREGUE FUNCIONALIDAD
    //////////////////////////////////////////////////////
    
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
        return httpMsgHandler.code400("User doesn't exists");
    }

    // Check if body has only valid fields
    const hasValidFields = await userValidator.hasValidFields(userData);
    if (!hasValidFields) {
        return httpMsgHandler.code400("Invalid fields on body");
    }
    // Check if body has prohibited fields: cretedId, createdAt and updatedAt
    const hasProhibitedFields = await userValidator.hasProhibitedFields(userData);
    if (hasProhibitedFields) {
        return httpMsgHandler.code400("Prohibited fields added on body");
    }
    
    // Update user in database
    const userUpdated = await userDAL.updateUser(userEmail, userData);
    if (userUpdated instanceof Error) {
        return httpMsgHandler.code500('Error updating user', userUpdated.message);
    }
    return httpMsgHandler.code200('User updated successfully');
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
        return httpMsgHandler.code400("User doesn't exists");
    }

    // Delete user in database
    const userDeleted = await userDAL.deleteUser(userEmail);
    if (userDeleted instanceof Error) {
        return httpMsgHandler.code500('Error deleting user', userDeleted.message);
    }
    return httpMsgHandler.code200('User deleted successfully');
}

const getUserPassword = async (userEmail) => {

    const userPassword = await userDAL.getUserPassword(userEmail);
    if (userPassword instanceof Error) {
        return httpMsgHandler.code500('Error getting password', userPassword.message);
    }
    if (!userPassword) {
        return httpMsgHandler.code404("Password not found");
    }

    return httpMsgHandler.code200(userPassword);
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserPassword
}