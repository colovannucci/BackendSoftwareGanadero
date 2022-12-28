// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Create an instance of User Service
const refreshTokenService = require('../Services/refreshTokenService');

const getAllRefreshTokens = async (req, res) => {
    const allRefreshTokens = await refreshTokenService.getAllRefreshTokens();
    res.status(allRefreshTokens.code).send(allRefreshTokens);
}

const getRefreshTokenByEmail = async (req, res) => {
    // Collect user email in request parameters
    const userEmail = req.params.email;

    const refreshTokenFound = await refreshTokenService.getRefreshTokenByEmail(userEmail);
    res.status(refreshTokenFound.code).send(refreshTokenFound);
}

const createRefreshToken = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const refreshTokenSaved = await refreshTokenService.createRefreshToken(body);
    res.status(refreshTokenSaved.code).send(refreshTokenSaved);
}

const updateRefreshToken = async (req, res) => {
    // Collect body fields with Refresh Token data
    const { body } = req;

    const refreshTokenUpdated = await refreshTokenService.updateRefreshToken(body);
    res.status(refreshTokenUpdated.code).send(refreshTokenUpdated);
}

const deleteRefreshToken = async (req, res) => {
    const userEmail = req.params.email;

    const refreshTokenDeleted = await refreshTokenService.deleteRefreshToken(userEmail);
    res.status(refreshTokenDeleted.code).send(refreshTokenDeleted);
}

const test = (req, res) => {
    console.log('Refresh token Routes connected successfully');
    res.status(200).send('Refresh token Routes connected successfully');
}

module.exports = {
    test,
    getAllRefreshTokens,
    getRefreshTokenByEmail,
    createRefreshToken,
    updateRefreshToken,
    deleteRefreshToken
}