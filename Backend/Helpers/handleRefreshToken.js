// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Use environment variables
require('dotenv').config()
// Require json web token library
const jwt = require('jsonwebtoken') 

const signRefreshToken = (user) => {
    try {
        const refreshToken = jwt.sign( { user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
        return refreshToken;
    } catch (err) {
        console.log(`signRefreshToken-Catch Error: ${err}`);
        return new Error(err);
    }
}

const verifyRefreshToken = (token) => {
    try {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return true;
    } catch (err) {
        console.log(`verifyRefreshToken-Catch Error: ${err}`);
        return new Error(err);
    }
}

module.exports = {
    signRefreshToken,
    verifyRefreshToken
}