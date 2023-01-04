// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Use "uuid" library to generate unique IDs
const { v4: uuid } = require("uuid");
// Require handler moment dates
const dateHandler = require('../Helpers/handleDate');
// Require animalValidator functions
const animalValidator = require('../Validators/animalValidator');
// Use animalModelDB (MongoDB Schema)
const animalModelDB = require('../Models/animalModelDB');

const animalExist = async (animalNumeroCaravana) => {
    try {
        const animalExist = await animalModelDB.exists({ numeroCaravana: animalNumeroCaravana });
        return animalExist;
    } catch (err) {
        console.log("animalExist-Catch Error: ", err);
        return new Error(err.message);
    }
}

const getAllAnimalsByUser = async (animalEmail) => {
    try {
        const allAnimalsFoundByUser = await animalModelDB.find({ email: animalEmail }).select("-_id -__v");
        // Check if the list retreived has values
        if (allAnimalsFoundByUser.length === 0) {
            return null;
        }
        return allAnimalsFoundByUser;
    } catch (err) {
        console.log("getAllAnimalsByUser-Catch Error: ", err);
        return new Error(err.message);
    }
}

const getAllAnimalsByEstablishment = async (establishmentDicoseFisico) => {
    try {
        const allAnimalsFoundByEstablishment = await animalModelDB.find({ dicoseUbicacion: establishmentDicoseFisico }).select("-_id -__v");
        // Check if the list retreived has values
        if (allAnimalsFoundByEstablishment.length === 0) {
            return null;
        }
        return allAnimalsFoundByEstablishment;
    } catch (err) {
        console.log("getAllAnimalsByEstablishment-Catch Error: ", err);
        return new Error(err.message);
    }
}

const getAnimal = async (animalNumeroCaravana) => {
    try {
        const animalFound = await animalModelDB.findOne({ numeroCaravana: animalNumeroCaravana }).select("-_id -__v");
        return animalFound;
    } catch (err) {
        console.log("getAnimal-Catch Error: ", err);
        return new Error(err.message);
    }
}

const createAnimal = async (animalData) => {
    // Declare new animal object with data received
    const newAnimal = new animalModelDB();
    newAnimal.email = animalData.email;
    newAnimal.numeroCaravana = animalData.numeroCaravana;
    newAnimal.raza = animalData.raza;
    newAnimal.cruza = animalData.cruza;
    newAnimal.sexo = animalData.sexo;
    newAnimal.edadMeses = animalData.edadMeses;
    newAnimal.edadDias = animalData.edadDias;
    newAnimal.dicosePropietario = animalData.dicosePropietario;
    newAnimal.dicoseUbicacion = animalData.dicoseUbicacion;
    newAnimal.dicoseTenedor = animalData.dicoseTenedor;
    newAnimal.statusVida = animalData.statusVida;
    newAnimal.statusTrazabilidad = animalData.statusTrazabilidad;
    newAnimal.pesoActual = "";
    newAnimal.disponibleVenta = false;

    // Generate defined values to folowing attributes
    newAnimal.createdId = uuid();
    newAnimal.createdAtTime = dateHandler.getStrDateNow();
    newAnimal.updatedAtTime = "";
    
    // Save new animal in database
    try {
        await newAnimal.save();
        // Remove email field from returned data
        delete animalData.email;
        return animalData;
    } catch (err) {
        console.log("createAnimal-Catch Error: ", err);
        return new Error(err.message);
    }
}

const updateAnimal = async (animalNumeroCaravana, animalData) => {
    // Add field updatedAt
    animalData.updatedAt = dateHandler.getStrDateNow();

    // Update animal in database
    try {
        await animalModelDB.updateOne({ numeroCaravana: animalNumeroCaravana }, animalData);
        return true;
    } catch (err) {
        console.log("updateAnimal-Catch Error: ", err);
        return new Error(err.message);
    }
}

const deleteAnimal = async (animalNumeroCaravana) => {
    // Delete animal in database
    try {
        await animalModelDB.deleteOne({ numeroCaravana: animalNumeroCaravana });
        return true;
    } catch (err) {
        console.log("deleteAnimal-Catch Error: ", err);
        return new Error(err.message);
    }
}

module.exports = {
    animalExist,
    getAllAnimalsByUser,
    getAllAnimalsByEstablishment,
    getAnimal,
    createAnimal,
    updateAnimal,
    deleteAnimal
}