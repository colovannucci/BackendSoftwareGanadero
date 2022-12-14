// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Use environment variables
require('dotenv').config()
// Require json web token library
const jwt = require('jsonwebtoken') 

const signAccessToken = async (user) => {
    try {
        const accessToken = await jwt.sign( { user }, process.env.APPSETTING_ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        return accessToken;
    } catch (err) {
        console.log("signAccessToken-Catch Error: ", err);
        return new Error(err.message);
    }
}

const verifyAccessToken = async (token) => {
    try {
        await jwt.verify(token, process.env.APPSETTING_ACCESS_TOKEN_SECRET);
        return true;
    } catch (err) {
        console.log("verifyAccesshToken-Catch Error: ", err);
        return new Error(err.message);
    }
}

module.exports = {
    signAccessToken,
    verifyAccessToken
}