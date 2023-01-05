// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Create an instance of establishmentDAL (data access layer)
const establishmentDAL = require('../DataAccess/establishmentDAL');

const establishmentExist = async (req, res, next) => {
    // Collect dicoseFisico from request body
    const establishmentDicoseFisico = req.body.dicoseFisico;

    // Verify establlishment in database
    const establishmentExist = await establishmentDAL.establishmentExist(establishmentDicoseFisico);
    if (establishmentExist instanceof Error) {
        const http500 = httpMsgHandler.code500('Error verifying Establishment', establishmentExist.message);
        return res.status(http500.code).send(http500);
    }
    if (!establishmentExist) {
        const http404 = httpMsgHandler.code404('Establishment not found');
        return res.status(http404.code).send(http404);
    }
    // Middleware passed successfully
    next();
}

const establishmentNotExist = async (req, res, next) => {
    // Collect dicoseFisico from request body
    const establishmentDicoseFisico = req.body.dicoseFisico;

    // Verify establlishment in database
    const establishmentExist = await establishmentDAL.establishmentExist(establishmentDicoseFisico);
    if (establishmentExist instanceof Error) {
        const http500 = httpMsgHandler.code500('Error verifying Establishment', establishmentExist.message);
        return res.status(http500.code).send(http500);
    }
    if (establishmentExist) {
        const http400 = httpMsgHandler.code400('Establishment already registered');
        return res.status(http400.code).send(http400);
    }
    // Middleware passed successfully
    next();
}

module.exports = {
    establishmentExist,
    establishmentNotExist
};