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
        console.log("getAllAccessTokens-Catch Error: ", err);
        return new Error(err.message);
    }
}

const accessTokenExist = async (userEmail) => {
    try {
        const accessTokenExists = await AccessTokenModelDB.exists({ email: userEmail });
        return accessTokenExists;
    } catch (err) {
        console.log("accessTokenExist-Catch Error: ", err);
        return new Error(err.message);
    }
}

const getAccessToken = async (userEmail) => {
    try {
        const accessTokenFound = await AccessTokenModelDB.findOne({ email: userEmail }).select("-_id -__v");
        if (!accessTokenFound){
            return accessTokenFound;
        }
        return accessTokenFound.accessToken;
    } catch (err) {
        console.log("getAccessToken-Catch Error: ", err);
        return new Error(err.message);
    }
}

const createAccessToken = async (userData) => {
     // Declare new RefreshToken object with data received
    const newAccessToken = new AccessTokenModelDB();
    newAccessToken.email = userData.email;
    // Generate a new access token value
    const generatedAccessToken = await accessTokenHandler.signAccessToken(userData);
    if (generatedAccessToken instanceof Error) {
        return new Error(generatedAccessToken.message);
    }
    newAccessToken.accessToken = generatedAccessToken;
    
    // Generate defined values to folowing attributes
    newAccessToken.createdId = uuid();
    newAccessToken.createdAtTime = dateHandler.getStrDateNow();
    newAccessToken.updatedAtTime = "";
    newAccessToken.expiresAtTime = dateHandler.addHoursDateNow(1);

    // Save new RefreshToken in database
    try {
        await newAccessToken.save();
        return newAccessToken.accessToken;
    } catch (err) {
        console.log("createAccessToken-Catch Error: ", err);
        return new Error(err.message);
    }
}

const updateAccessToken = async (userData) => {
    // Generate a new access token value
    const generatedAccessToken = await accessTokenHandler.signAccessToken(userData);
    if (generatedAccessToken instanceof Error) {
        return new Error(generatedAccessToken.message);
    }

    // Create a new object with data to update
    const accessTokenData = {
        accessToken: generatedAccessToken,
        updatedAt: dateHandler.getStrDateNow(),
        expiresAt: dateHandler.addHoursDateNow(1)
    };

    // Update Access Token in database
    try {
        await AccessTokenModelDB.updateOne({ email: userData.email }, accessTokenData);
        return accessTokenData.accessToken;
    } catch (err) {
        console.log("updateAccessToken-Catch Error: ", err);
        return new Error(err.message);
    }
}

const deleteAccessToken = async (userEmail) => {
    // Delete RefreshToken in database
    try {
        await AccessTokenModelDB.deleteOne({ email: userEmail });
        return true;
    } catch (err) {
        console.log("deleteAccessToken-Catch Error: ", err);
        return new Error(err.message);
    }
}

module.exports = {
    getAllAccessTokens,
    accessTokenExist,
    getAccessToken,
    createAccessToken,
    updateAccessToken,
    deleteAccessToken
}