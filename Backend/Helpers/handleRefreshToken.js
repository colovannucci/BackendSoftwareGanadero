// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Use environment variables
require('dotenv').config()
// Require json web token library
const jwt = require('jsonwebtoken') 

const signRefreshToken = async (user) => {
    try {
        const refreshToken = await jwt.sign( { user }, process.env.APPSETTING_REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
        return refreshToken;
    } catch (err) {
        console.log("signRefreshToken-Catch Error: ", err);
        return new Error(err.message);
    }
}

const verifyRefreshToken = async (token) => {
    try {
        await jwt.verify(token, process.env.APPSETTING_REFRESH_TOKEN_SECRET);
        return true;
    } catch (err) {
        console.log("verifyRefreshToken-Catch Error: ", err);
        return new Error(err.message);
    }
}

module.exports = {
    signRefreshToken,
    verifyRefreshToken
}