// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Use environment variables
require('dotenv').config()
// Require json web token library
const jwt = require('jsonwebtoken') 

const signAccessToken = (user) => {
    try {
        const accessToken = jwt.sign( { user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
        return accessToken;
    } catch (err) {
        console.log(`signAccessToken-Catch Error: ${err}`);
        return new Error(err);
    }
}

const verifyAccessToken = (token) => {
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return true;
    } catch (err) {
        console.log(`verifyAccesshToken-Catch Error: ${err}`);
        return new Error(err);
    }
}

module.exports = {
    signAccessToken,
    verifyAccessToken
}