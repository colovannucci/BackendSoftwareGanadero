// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Create an instance of User Service
const establishmentService = require('../Services/establishmentService');

const getAllEstablishments = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const allEstablishmentsFound = await establishmentService.getAllEstablishments(body);
    res.status(allEstablishmentsFound.code).send(allEstablishmentsFound);
}

const getEstablishment = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const establishmentFound = await establishmentService.getEstablishment(body);
    res.status(establishmentFound.code).send(establishmentFound);
}

const createEstablishment = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const establishmentCreated = await establishmentService.createEstablishment(body);
    res.status(establishmentCreated.code).send(establishmentCreated);
}

const updateEstablishment = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const establishmentUpdated = await establishmentService.updateEstablishment(body);
    res.status(establishmentUpdated.code).send(establishmentUpdated);
}

const deleteEstablishment = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const establishmentDeleted = await establishmentService.deleteEstablishment(body);
    res.status(establishmentDeleted.code).send(establishmentDeleted);
}

const test = (req, res) => {
    console.log('Establishment Routes connected successfully');
    res.status(200).send('Establishment Routes connected successfully');
}

module.exports = {
    test,
    getAllEstablishments,
    getEstablishment,
    createEstablishment,
    updateEstablishment,
    deleteEstablishment
}