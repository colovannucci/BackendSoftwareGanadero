// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Create an instance of animalDAL (data access layer)
const animalDAL = require('../DataAccess/animalDAL');

const animalExist = async (req, res, next) => {
    // Collect numeroCaravana from request body
    const animalNumeroCaravana = req.body.numeroCaravana;

    // Verify establlishment in database
    const animalExist = await animalDAL.animalExist(animalNumeroCaravana);
    if (animalExist instanceof Error) {
        const http500 = httpMsgHandler.code500('Error verifying Animal', animalExist.message);
        return res.status(http500.code).send(http500);
    }
    if (!animalExist) {
        const http404 = httpMsgHandler.code404('Animal not found');
        return res.status(http404.code).send(http404);
    }
    // Middleware passed successfully
    next();
}

const animalNotExist = async (req, res, next) => {
    // Collect numeroCaravana from request body
    const animalNumeroCaravana = req.body.numeroCaravana;

    // Verify establlishment in database
    const animalExist = await animalDAL.animalExist(animalNumeroCaravana);
    if (animalExist instanceof Error) {
        const http500 = httpMsgHandler.code500('Error verifying Animal', animalExist.message);
        return res.status(http500.code).send(http500);
    }
    if (animalExist) {
        const http400 = httpMsgHandler.code400('Animal already registered');
        return res.status(http400.code).send(http400);
    }
    // Middleware passed successfully
    next();
}

module.exports = {
    animalExist,
    animalNotExist
};