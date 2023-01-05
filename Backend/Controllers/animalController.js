// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Create an instance of animalService
const animalService = require('../Services/animalService');

const getAllAnimalsByUser = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const allAnimalsByUserFound = await animalService.getAllAnimalsByUser(body);
    res.status(allAnimalsByUserFound.code).send(allAnimalsByUserFound);
}

const getAllAnimalsByEstablishment = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const allAnimalsByEstablishmentFound = await animalService.getAllAnimalsByEstablishment(body);
    res.status(allAnimalsByEstablishmentFound.code).send(allAnimalsByEstablishmentFound);
}

const getAnimal = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const animalFound = await animalService.getAnimal(body);
    res.status(animalFound.code).send(animalFound);
}

const createAnimal = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const animalCreated = await animalService.createAnimal(body);
    res.status(animalCreated.code).send(animalCreated);
}

const updateAnimal = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const animalUpdated = await animalService.updateAnimal(body);
    res.status(animalUpdated.code).send(animalUpdated);
}

const deleteAnimal = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const animalDeleted = await animalService.deleteAnimal(body);
    res.status(animalDeleted.code).send(animalDeleted);
}

const testRoutes = (req, res) => {
    console.log('Animal Routes connected successfully');
    res.status(200).send('Animal Routes connected successfully');
}

module.exports = {
    testRoutes,
    getAllAnimalsByUser,
    getAllAnimalsByEstablishment,
    getAnimal,
    createAnimal,
    updateAnimal,
    deleteAnimal
}