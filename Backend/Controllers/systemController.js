// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Create an instance of systemControlService
const systemControlService = require('../Services/systemControlService');

const signUp = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const signedUp = await systemControlService.signUp(body);
    res.status(signedUp.code).send(signedUp);
}

const signIn = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const signedIn = await systemControlService.signIn(body);
    res.status(signedIn.code).send(signedIn);
}

const signOut = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const signedOut = await systemControlService.signOut(body);
    res.status(signedOut.code).send(signedOut);
}

const generateNewAccessToken = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const accessTokenGenerated = await systemControlService.generateNewAccessToken(body);
    res.status(accessTokenGenerated.code).send(accessTokenGenerated);
}

const blockUser = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const blockUser = await systemControlService.blockUser(body);
    res.status(blockUser.code).send(blockUser);
}

const unblockUser = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const unblockUser = await systemControlService.unblockUser(body);
    res.status(unblockUser.code).send(unblockUser);
}

const testRoutes = (req, res) => {
    console.log('System Routes connected successfully');
    res.status(200).send('System Routes connected successfully');
}

module.exports = {
    testRoutes,
    signUp,
    signIn,
    signOut,
    generateNewAccessToken,
    blockUser,
    unblockUser
}