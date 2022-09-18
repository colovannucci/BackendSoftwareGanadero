// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Create an instance of User Service
const systemControlServices = require('../Services/systemControlService');

const signUp = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const signedUp = await systemControlServices.signUp(body);
    res.status(signedUp.code).send(signedUp);
}

const signIn = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const signedIn = await systemControlServices.signIn(body);
    res.status(signedIn.code).send(signedIn);
}

const signOut = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const signedOut = await systemControlServices.signOut(body);
    res.status(signedOut.code).send(signedOut);
}

const generateNewAccessToken = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const accessTokenGenerated = await systemControlServices.generateNewAccessToken(body);
    res.status(accessTokenGenerated.code).send(accessTokenGenerated);
}

const test = (req, res) => {
    console.log('System Routes connected successfully');
    res.status(200).send('System Routes connected successfully');
}

module.exports = {
    test,
    signUp,
    signIn,
    signOut,
    generateNewAccessToken
}