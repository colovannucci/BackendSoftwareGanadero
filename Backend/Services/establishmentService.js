// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require establishmentValidator functions
const establishmentValidator = require('../Validators/establishmentValidator');
// Create an instance of establishmentDAL (data access layer)
const establishmentDAL = require('../DataAccess/establishmentDAL');

const getAllEstablishments = async (establishmentData) => {
    // Check if email was provided
    if (!establishmentData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    
    // Search allEstablishments in database
    const allEstablishmentsFound = await establishmentDAL.getAllEstablishments(establishmentData.email);
    if (allEstablishmentsFound instanceof Error) {
        return httpMsgHandler.code500('Error getting All Establishments', allEstablishmentsFound.message);
    }
    if (!allEstablishmentsFound){
        return httpMsgHandler.code404("No Establishments found of the User");
    }
    
    // Create an object to show allEstablishments found
    const establishmentDataValues = {
        establishments: allEstablishmentsFound
    };

    return httpMsgHandler.code200("All Establishments found successfully", establishmentDataValues);
}

const getEstablishment = async (establishmentData) => {
    // Check if dicoseFisico was provided
    if (!establishmentData.dicoseFisico){
        return httpMsgHandler.code400("Establishment Dicose Fisico was not provided");
    }
    
    // Search establishment in database
    const establishmentFound = await establishmentDAL.getEstablishment(establishmentData.dicoseFisico);
    if (establishmentFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Establishment', establishmentFound.message);
    }

    // Create an object to show establishment found
    const establishmentDataValues = {
        establishment: establishmentFound
    };

    return httpMsgHandler.code200("Establishment found successfully", establishmentDataValues);
}

const createEstablishment = async (establishmentData) => {
    // Check if body has all required fields
    const hasRequiredFields = await establishmentValidator.hasRequiredFields(establishmentData);
    if (!hasRequiredFields) {
        return httpMsgHandler.code400("Missing fields on body");
    }
    // Check if body has only valid fields
    const hasCreatableFields = await establishmentValidator.hasCreatableFields(establishmentData);
    if (!hasCreatableFields) {
        return httpMsgHandler.code400("Invalid fields added on body");
    }

    // Check if rubroPrincipal value is valid
    const esRubroValido = await establishmentValidator.esRubroValido(establishmentData.rubroPrincipal);
    if (!esRubroValido){
        return httpMsgHandler.code400("Rubro Principal is not valid");
    }

    // Save establishment in database
    const establishmentCreated = await establishmentDAL.createEstablishment(establishmentData);
    if (establishmentCreated instanceof Error) {
        return httpMsgHandler.code500('Error creating Establishment', establishmentCreated.message);
    }
    
    // Create an object to show establishment found
    const establishmentDataValues = {
        establishment: establishmentCreated
    };

    return httpMsgHandler.code201('Establishment created successfully', establishmentDataValues);
}

const updateEstablishment = async (establishmentData) => {
    // Check if dicoseFisico was provided
    if (!establishmentData.dicoseFisico){
        return httpMsgHandler.code400("Establishment Dicose Fisico was not provided");
    }

    // Collect dicoseFisico value
    const establishmentDicoseFisico = establishmentData.dicoseFisico;
    // Remove email field from updatable data
    delete establishmentData.email;
    // Remove dicoseFisico field from updatable data
    delete establishmentData.dicoseFisico;

    // Check if body has only valid fields
    const hasUpdatableFields = await establishmentValidator.hasUpdatableFields(establishmentData);
    if (!hasUpdatableFields) {
        return httpMsgHandler.code400("Invalid fields added on body");
    }

    // Check if body has rubroPrincipal field
    if (establishmentData.rubroPrincipal){
        // Check if rubroPrincipal value is valid
        const esRubroPrincipalValido = await establishmentValidator.esRubroPrincipalValido(establishmentData.rubroPrincipal);
        if (!esRubroPrincipalValido){
            return httpMsgHandler.code400("Rubro Principal is not valid");
        }
    }
    
    // Update establishment in database
    const establishmentUpdated = await establishmentDAL.updateEstablishment(establishmentDicoseFisico, establishmentData);
    if (establishmentUpdated instanceof Error) {
        return httpMsgHandler.code500('Error updating Establishment', establishmentUpdated.message);
    }

    // Search establishment in database
    const establishmentFound = await establishmentDAL.getEstablishment(establishmentDicoseFisico);
    if (establishmentFound instanceof Error) {
        // The establishment was updated successfully but the server had an error retrieving the values
        establishmentFound = "Error getting updated Establishment data";
    }
    // Create an object to show updatedestablishment found
    const updatedEstablishment = {
        establishment: establishmentFound
    };

    return httpMsgHandler.code200('Establishment updated successfully', updatedEstablishment);
}

const deleteEstablishment = async (establishmentData) => {
    // Check if dicoseFisico was provided
    if (!establishmentData.dicoseFisico){
        return httpMsgHandler.code400("Establishment Dicose Fisico was not provided");
    }
    
    // Delete establishment in database
    const establishmentDeleted = await establishmentDAL.deleteEstablishment(establishmentData.dicoseFisico);
    if (establishmentDeleted instanceof Error) {
        return httpMsgHandler.code500('Error deleting Establishment', establishmentDeleted.message);
    }

    return httpMsgHandler.code200('Establishment deleted successfully');
}

module.exports = {
    getAllEstablishments,
    getEstablishment,
    createEstablishment,
    updateEstablishment,
    deleteEstablishment
}