// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require animalValidator functions
const animalValidator = require('../Validators/animalValidator');
// Create an instance of animalDAL (data access layer)
const animalDAL = require('../DataAccess/animalDAL');

const getAllAnimalsByUser = async (animalData) => {
    // Check if searchEmail was provided
    if (!animalData.searchEmail){
        return httpMsgHandler.code400("User search email was not provided");
    }
    
    // Search allAnimalsByUser in database
    const allAnimalsFoundByUser = await animalDAL.getAllAnimalsByUser(animalData.searchEmail);
    if (allAnimalsFoundByUser instanceof Error) {
        return httpMsgHandler.code500('Error getting All Animals by User', allAnimalsFoundByUser.message);
    }
    if (!allAnimalsFoundByUser){
        return httpMsgHandler.code404("No Animals found of the User");
    }
    
    // Create an object to show allAnimals found
    const animalDataValues = {
        animals: allAnimalsFoundByUser
    };

    return httpMsgHandler.code200("All Animals by User found successfully", animalDataValues);
}

const getAllAnimalsByEstablishment = async (animalData) => {
    // Check if dicoseFisico was provided
    if (!animalData.dicoseFisico){
        return httpMsgHandler.code400("Establishment Dicose Fisico was not provided");
    }
    
    // Search allAnimalsByEstablishment in database
    const allAnimalsFoundByEstablishment = await animalDAL.getAllAnimalsByEstablishment(animalData.dicoseFisico);
    if (allAnimalsFoundByEstablishment instanceof Error) {
        return httpMsgHandler.code500('Error getting All Animals by Establishment', allAnimalsFoundByEstablishment.message);
    }
    if (!allAnimalsFoundByEstablishment){
        return httpMsgHandler.code404("No Animals found of the Establishment");
    }
    
    // Create an object to show allAnimals found
    const animalDataValues = {
        animals: allAnimalsFoundByEstablishment
    };

    return httpMsgHandler.code200("All Animals by Establishment found successfully", animalDataValues);
}

const getAnimal = async (animalData) => {
    // Check if numeroCaravana was provided
    if (!animalData.numeroCaravana){
        return httpMsgHandler.code400("Animal Numero Caravana was not provided");
    }
    
    // Search animal in database
    const animalFound = await animalDAL.getAnimal(animalData.numeroCaravana);
    if (animalFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Animal', animalFound.message);
    }

    // Create an object to show animal found
    const animalDataValues = {
        animal: animalFound
    };

    return httpMsgHandler.code200("Animal found successfully", animalDataValues);
}

const createAnimal = async (animalData) => {
    // Check if body has all required fields
    const hasRequiredFields = await animalValidator.hasRequiredFields(animalData);
    if (!hasRequiredFields) {
        return httpMsgHandler.code400("Missing fields on body");
    }
    // Check if body has only valid fields
    const hasCreatableFields = await animalValidator.hasCreatableFields(animalData);
    if (!hasCreatableFields) {
        return httpMsgHandler.code400("Invalid fields added on body");
    }

    // Check if sexo value is valid
    const esSexoValido = await animalValidator.esSexoValido(animalData.sexo);
    if (!esSexoValido){
        return httpMsgHandler.code400("Sexo is not valid");
    }

    // Check if statusVida value is valid
    const esStatusVidaValido = await animalValidator.esStatusVidaValido(animalData.statusVida);
    if (!esStatusVidaValido){
        return httpMsgHandler.code400("Status Vida is not valid");
    }
    
    // Check if statusTrazabilidad value is valid
    const esStatusTrazabilidadValido = await animalValidator.esStatusTrazabilidadValido(animalData.statusTrazabilidad);
    if (!esStatusTrazabilidadValido){
        return httpMsgHandler.code400("Status Trazabilidad is not valid");
    }
    
    // Save animal in database
    const animalCreated = await animalDAL.createAnimal(animalData);
    if (animalCreated instanceof Error) {
        return httpMsgHandler.code500('Error creating Animal', animalCreated.message);
    }
    
    // Create an object to show animal found
    const animalDataValues = {
        animal: animalCreated
    };

    return httpMsgHandler.code201('Animal created successfully', animalDataValues);
}

const updateAnimal = async (animalData) => {
    // Check if numeroCaravana was provided
    if (!animalData.numeroCaravana){
        return httpMsgHandler.code400("Animal Numero Caravana was not provided");
    }

    // Collect numeroCaravana value
    const animalDicoseFisico = animalData.numeroCaravana;
    // Remove email field from updatable data
    delete animalData.email;
    // Remove numeroCaravana field from updatable data
    delete animalData.numeroCaravana;

    // Check if body has only valid fields
    const hasUpdatableFields = await animalValidator.hasUpdatableFields(animalData);
    if (!hasUpdatableFields) {
        return httpMsgHandler.code400("Invalid fields added on body");
    }
    
    // Check if body has statusVida field
    if (animalData.statusVida){
        // Check if statusVida value is valid
        const esStatusVidaValido = await animalValidator.esStatusVidaValido(animalData.statusVida);
        if (!esStatusVidaValido){
            return httpMsgHandler.code400("Status Vida is not valid");
        }
    }

    // Check if body has statusTrazabilidad field
    if (animalData.statusTrazabilidad){
        // Check if statusTrazabilidad value is valid
        const esStatusTrazabilidadValido = await animalValidator.esStatusTrazabilidadValido(animalData.statusTrazabilidad);
        if (!esStatusTrazabilidadValido){
            return httpMsgHandler.code400("Status Trazabilidad is not valid");
        }
    }

    // Update animal in database
    const animalUpdated = await animalDAL.updateAnimal(animalDicoseFisico, animalData);
    if (animalUpdated instanceof Error) {
        return httpMsgHandler.code500('Error updating Animal', animalUpdated.message);
    }

    // Search animal in database
    const animalFound = await animalDAL.getAnimal(animalDicoseFisico);
    if (animalFound instanceof Error) {
        // The animal was updated successfully but the server had an error retrieving the values
        animalFound = "Error getting updated Animal data";
    }
    // Create an object to show updatedanimal found
    const updatedAnimal = {
        animal: animalFound
    };

    return httpMsgHandler.code200('Animal updated successfully', updatedAnimal);
}

const deleteAnimal = async (animalData) => {
    // Check if numeroCaravana was provided
    if (!animalData.numeroCaravana){
        return httpMsgHandler.code400("Animal Numero Caravana was not provided");
    }
    
    // Delete animal in database
    const animalDeleted = await animalDAL.deleteAnimal(animalData.numeroCaravana);
    if (animalDeleted instanceof Error) {
        return httpMsgHandler.code500('Error deleting Animal', animalDeleted.message);
    }

    return httpMsgHandler.code200('Animal deleted successfully');
}

module.exports = {
    getAllAnimalsByUser,
    getAllAnimalsByEstablishment,
    getAnimal,
    createAnimal,
    updateAnimal,
    deleteAnimal
}