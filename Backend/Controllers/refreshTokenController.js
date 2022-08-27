// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Create an instance of User Service
const refreshTokenServices = require('../Services/refreshTokenService');

const getAllRefreshTokens = async (req, res) => {
    const allRefreshTokens = await refreshTokenServices.getAllRefreshTokens();
    res.status(allRefreshTokens.code).send(allRefreshTokens);
}

const getRefreshToken = async (req, res) => {
    const userEmail = req.params.email;

    const refreshTokenFound = await refreshTokenServices.getRefreshToken(userEmail);
    res.status(refreshTokenFound.code).send(refreshTokenFound);
}

const createRefreshToken = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const refreshTokenSaved = await refreshTokenServices.createRefreshToken(body);
    res.status(refreshTokenSaved.code).send(refreshTokenSaved);
}

const deleteRefreshToken = async (req, res) => {
    const userEmail = req.params.email;

    const refreshTokenDeleted = await refreshTokenServices.deleteRefreshToken(userEmail);
    res.status(refreshTokenDeleted.code).send(refreshTokenDeleted);
}

const test = (req, res) => {
    console.log('HOLA');
    res.status(200).send('Refresh token Routes tested successfully');
}

module.exports = {
    test,
    getAllRefreshTokens,
    getRefreshToken,
    createRefreshToken,
    deleteRefreshToken
}