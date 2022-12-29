// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Use "uuid" library to generate unique IDs
const { v4: uuid } = require("uuid");
// Require handler moment dates
const dateHandler = require('../Helpers/handleDate');
// Require handler bcrypt password
const pswHandler = require('../Helpers/handlePassword');
// Use establishmentModelDB (MongoDB Schema)
const establishmentModelDB = require('../Models/establishmentModelDB');

const userExist = async (userEmail) => {
    try {
        const userExists = await establishmentModelDB.exists({ email: userEmail });
        return userExists;
    } catch (err) {
        console.log("userExist-Catch Error: ", err);
        return new Error(err.message);
    }
}

const getAllEstablishments = async () => {
    try {
        const allUsers = await establishmentModelDB.find({}).select("-_id -__v");
        if (allUsers.length === 0) {
            return null;
        }
        return allUsers;
    } catch (err) {
        console.log("getAllEstablishments-Catch Error: ", err);
        return new Error(err.message);
    }
}

const getEstablishment = async (userEmail) => {
    try {
        const userFound = await establishmentModelDB.findOne({ email: userEmail }).select("-_id -__v");
        return userFound;
    } catch (err) {
        console.log("getEstablishment-Catch Error: ", err);
        return new Error(err.message);
    }
}

const createEstablishment = async (userData) => {
    // Declare new user object with data received
    const newEstablishment = new establishmentModelDB();
    newEstablishment.idUsuario = userData.idUsuario;
    newEstablishment.nombreEstablecimiento = userData.nombreEstablecimiento;
    newEstablishment.nombreProductor = userData.nombreProductor;
    newEstablishment.dicoseFisico = userData.dicoseFisico;
    newEstablishment.rubroPrincipal = userData.rubroPrincipal;
    newEstablishment.cantidadDicosePropiedad = userData.cantidadDicosePropiedad;
    newEstablishment.valoresDicosePropiedad = userData.valoresDicosePropiedad;

    // Generate defined values to folowing attributes
    newEstablishment.createdId = uuid();
    newEstablishment.createdAtTime = dateHandler.getStrDateNow();
    newEstablishment.updatedAtTime = "";
    
    // Save new user in database
    try {
        await newEstablishment.save();
        return userData;
    } catch (err) {
        console.log("createEstablishment-Catch Error: ", err);
        return new Error(err.message);
    }
}

const updateEstablishment = async (userEmail, userData) => {
    // Check if the user wants to update his password
    if (userData.password){
        // Encrypt password
        const hashedPassword = await pswHandler.encryptPassword(userData.password);
        if (hashedPassword instanceof Error) {
            return new Error(hashedPassword.message);
        }
        // Replace the password with the new password
        userData.password = hashedPassword;
    }
    // Add field updatedAt
    userData.updatedAt = dateHandler.getStrDateNow();

    // Update user in database
    try {
        await establishmentModelDB.updateOne({ email: userEmail }, userData);
        return true;
    } catch (err) {
        console.log("updateEstablishment-Catch Error: ", err);
        return new Error(err.message);
    }
}

const deleteEstablishment = async (userEmail) => {
    // Delete user in database
    try {
        await establishmentModelDB.deleteOne({ email: userEmail });
        return true;
    } catch (err) {
        console.log("deleteEstablishment-Catch Error: ", err);
        return new Error(err.message);
    }
}

module.exports = {
    userExist,
    getAllEstablishments,
    getEstablishment,
    createEstablishment,
    updateEstablishment,
    deleteEstablishment
}