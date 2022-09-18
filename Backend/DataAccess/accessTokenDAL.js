// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Use "uuid" library to generate unique IDs
const { v4: uuid } = require("uuid");
// Require handler for Access token
const accessTokenHandler = require('../Helpers/handleAccessToken');
// Require handler moment dates
const dateHandler = require('../Helpers/handleDate');
// Use MongoDB AccessToken Schema
const AccessTokenModelDB = require('../Models/accessTokenModel');

const getAllAccessTokens = async () => {
    try {
        const allAccessTokens = await AccessTokenModelDB.find({}).select("-_id -__v");
        if (allAccessTokens.length === 0) {
            return null;
        }
        return allAccessTokens;
    } catch (err) {
        console.log(`getAllAccessTokens-Catch Error: ${err}`);
        return new Error(err);
    }
}

const getAccessTokenByEmail = async (userEmail) => {
    try {
        const accessTokenFound = await AccessTokenModelDB.findOne({ email: userEmail }).select("-_id -__v");
        if (!accessTokenFound) {
            return null;
        }
        return accessTokenFound;
    } catch (err) {
        console.log(`getAccessTokenByEmail-Catch Error: ${err}`);
        return new Error(err);
    }
}

const getAccessToken = async (token) => {
    try {
        const accessTokenFound = await AccessTokenModelDB.findOne({ accessToken: token }).select("-_id -__v");
        if (!accessTokenFound) {
            return null;
        }
        return accessTokenFound;
    } catch (err) {
        console.log(`getAccessToken-Catch Error: ${err}`);
        return new Error(err);
    }
}

const createAccessToken = async (userData) => {
     // Declare new RefreshToken object with data received
    const newAccessToken = new AccessTokenModelDB();
    newAccessToken.email = userData.email;
    newAccessToken.accessToken = accessTokenHandler.signAccessToken(userData);
    newAccessToken.createdId = uuid();
    newAccessToken.createdAt = dateHandler.getStrDateNow();
    newAccessToken.updatedAt = dateHandler.getStrDateNow();
    newAccessToken.expiresAt = dateHandler.addHoursDateNow(1);

    // Save new RefreshToken in database
    try {
        await newAccessToken.save();
        return newAccessToken.accessToken;
    } catch (err) {
        console.log(`createAccessToken-Catch Error: ${err}`);
        return new Error(err);
    }
}

const updateAccessToken = async (userEmail, newToken) => {
    // Create a new object with data to update
    const accessTokenData = {
        accessToken: newToken,
        updatedAt: dateHandler.getStrDateNow(),
        expiresAt: dateHandler.addHoursDateNow(1)
    };

    // Update Access Token in database
    try {
        await AccessTokenModelDB.updateOne({ email: userEmail }, accessTokenData);
        return true;
    } catch (err) {
        console.log(`updateAccessToken-Catch Error: ${err}`);
        return new Error(err);
    }
}

const deleteAccessToken = async (userEmail) => {
    // Delete RefreshToken in database
    try {
        await AccessTokenModelDB.deleteOne({ email: userEmail });
        return true;
    } catch (err) {
        console.log(`deleteAccessToken-Catch Error: ${err}`);
        return new Error(err);
    }
}

module.exports = {
    getAllAccessTokens,
    getAccessTokenByEmail,
    getAccessToken,
    createAccessToken,
    updateAccessToken,
    deleteAccessToken
}