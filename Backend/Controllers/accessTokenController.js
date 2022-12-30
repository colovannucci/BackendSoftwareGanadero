// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Create an instance of accessTokenService
const accessTokenService = require('../Services/accessTokenService');

const getAllAccessTokens = async (req, res) => {
    const allAccessTokens = await accessTokenService.getAllAccessTokens();
    res.status(allAccessTokens.code).send(allAccessTokens);
}

const getAccessTokenByEmail = async (req, res) => {
    // Collect user email in request parameters
    const userEmail = req.params.email;

    const accessTokenFound = await accessTokenService.getAccessTokenByEmail(userEmail);
    res.status(accessTokenFound.code).send(accessTokenFound);
}

const createAccessToken = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const accessTokenSaved = await accessTokenService.createAccessToken(body);
    res.status(accessTokenSaved.code).send(accessTokenSaved);
}

const updateAccessToken = async (req, res) => {
    // Collect body fields with Access Token data
    const { body } = req;

    const accessTokenUpdated = await accessTokenService.updateAccessToken(body);
    res.status(accessTokenUpdated.code).send(accessTokenUpdated);
}

const deleteAccessToken = async (req, res) => {
    const userEmail = req.params.email;

    const accessTokenDeleted = await accessTokenService.deleteAccessToken(userEmail);
    res.status(accessTokenDeleted.code).send(accessTokenDeleted);
}

const testRoutes = (req, res) => {
    console.log('Access token Routes connected successfully');
    res.status(200).send('Access token Routes connected successfully');
}

module.exports = {
    testRoutes,
    getAllAccessTokens,
    getAccessTokenByEmail,
    createAccessToken,
    updateAccessToken,
    deleteAccessToken
}