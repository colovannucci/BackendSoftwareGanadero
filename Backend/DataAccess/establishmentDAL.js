// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Use "uuid" library to generate unique IDs
const { v4: uuid } = require("uuid");
// Require handler moment dates
const dateHandler = require('../Helpers/handleDate');
// Require establishmentValidator functions
const establishmentValidator = require('../Validators/establishmentValidator');
// Use establishmentModelDB (MongoDB Schema)
const establishmentModelDB = require('../Models/establishmentModelDB');

const establishmentExist = async (establishmentDicoseFisico) => {
    try {
        const establishmentExist = await establishmentModelDB.exists({ dicoseFisico: establishmentDicoseFisico });
        return establishmentExist;
    } catch (err) {
        console.log("establishmentExist-Catch Error: ", err);
        return new Error(err.message);
    }
}

const getAllEstablishments = async (userEmail) => {
    try {
        const allEstablishmentsFound = await establishmentModelDB.find({ email: userEmail }).select("-_id -__v");
        console.log("allEstablishments");
        console.log(allEstablishmentsFound);
        if (allEstablishmentsFound.length === 0) {
            return null;
        }
        return allEstablishmentsFound;
    } catch (err) {
        console.log("getAllEstablishments-Catch Error: ", err);
        return new Error(err.message);
    }
}

const getEstablishment = async (establishmentDicoseFisico) => {
    try {
        const establishmentFound = await establishmentModelDB.findOne({ dicoseFisico: establishmentDicoseFisico }).select("-_id -__v");
        return establishmentFound;
    } catch (err) {
        console.log("getEstablishment-Catch Error: ", err);
        return new Error(err.message);
    }
}

const createEstablishment = async (establishmentData) => {
    // Declare new user object with data received
    const newEstablishment = new establishmentModelDB();
    newEstablishment.email = establishmentData.email;
    newEstablishment.nombreEstablecimiento = establishmentData.nombreEstablecimiento;
    newEstablishment.nombreProductor = establishmentData.nombreProductor;
    newEstablishment.dicoseFisico = establishmentData.dicoseFisico;
    newEstablishment.rubroPrincipal = establishmentData.rubroPrincipal;
    newEstablishment.cantidadDicosePropiedad = establishmentData.cantidadDicosePropiedad;
    newEstablishment.valoresDicosePropiedad = establishmentData.valoresDicosePropiedad;

    // Generate defined values to folowing attributes
    newEstablishment.createdId = uuid();
    newEstablishment.createdAtTime = dateHandler.getStrDateNow();
    newEstablishment.updatedAtTime = "";
    
    // Save new user in database
    try {
        await newEstablishment.save();
        return establishmentData;
    } catch (err) {
        console.log("createEstablishment-Catch Error: ", err);
        return new Error(err.message);
    }
}

const updateEstablishment = async (establishmentDicoseFisico, establishmentData) => {
    // Add field updatedAt
    establishmentData.updatedAt = dateHandler.getStrDateNow();

    // Update user in database
    try {
        await establishmentModelDB.updateOne({ dicoseFisico: establishmentDicoseFisico }, establishmentData);
        return true;
    } catch (err) {
        console.log("updateEstablishment-Catch Error: ", err);
        return new Error(err.message);
    }
}

const deleteEstablishment = async (establishmentDicoseFisico) => {
    // Delete user in database
    try {
        await establishmentModelDB.deleteOne({ dicoseFisico: establishmentDicoseFisico });
        return true;
    } catch (err) {
        console.log("deleteEstablishment-Catch Error: ", err);
        return new Error(err.message);
    }
}

module.exports = {
    establishmentExist,
    getAllEstablishments,
    getEstablishment,
    createEstablishment,
    updateEstablishment,
    deleteEstablishment
}