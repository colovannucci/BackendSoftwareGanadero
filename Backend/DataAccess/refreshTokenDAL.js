// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Use "uuid" library to generate unique IDs
const { v4: uuid } = require("uuid");
// Require handler for refresh token
const refreshTokenHandler = require('../Helpers/handleRefreshToken');
// Require handler moment dates
const dateHandler = require('../Helpers/handleDate');
// Use refreshTokenModelDB (MongoDB Schema)
const refreshTokenModelDB = require('../Models/refreshTokenModelDB');

const getAllRefreshTokens = async () => {
    try {
        const allRefreshTokens = await refreshTokenModelDB.find({}).select("-_id -__v");
        if (allRefreshTokens.length === 0) {
            return null;
        }
        return allRefreshTokens;
    } catch (err) {
        console.log("getAllRefreshTokens-Catch Error: ", err);
        return new Error(err.message);
    }
}

const refreshTokenExist = async (userEmail) => {
    try {
        const refreshTokenExists = await refreshTokenModelDB.exists({ email: userEmail });
        return refreshTokenExists;
    } catch (err) {
        console.log("refreshTokenExist-Catch Error: ", err);
        return new Error(err.message);
    }
}

const getRefreshToken = async (userEmail) => {
    try {
        const refreshTokenFound = await refreshTokenModelDB.findOne({ email: userEmail }).select("-_id -__v");
        if (!refreshTokenFound){
            return refreshTokenFound;
        }
        return refreshTokenFound.refreshToken;
    } catch (err) {
        console.log("getRefreshToken-Catch Error: ", err);
        return new Error(err.message);
    }
}

const createRefreshToken = async (userData) => {
     // Declare new RefreshToken object with data received
    const newRefreshToken = new refreshTokenModelDB();
    newRefreshToken.email = userData.email;
    // Generate a new refresh token value
    const generatedRefreshToken = await refreshTokenHandler.signRefreshToken(userData);
    if (generatedRefreshToken instanceof Error) {
        return new Error(generatedRefreshToken.message);
    }
    newRefreshToken.refreshToken = generatedRefreshToken;

    // Generate defined values to folowing attributes
    newRefreshToken.createdId = uuid();
    newRefreshToken.createdAtTime = dateHandler.getStrDateNow();
    newRefreshToken.updatedAtTime = "";
    newRefreshToken.expiresAtTime = dateHandler.addDaysDateNow(30);

    // Save new RefreshToken in database
    try {
        await newRefreshToken.save();
        return newRefreshToken.refreshToken;
    } catch (err) {
        console.log("createRefreshToken-Catch Error: ", err);
        return new Error(err.message);
    }
}

const updateRefreshToken = async (userData) => {
    // Generate a new refresh token value
    const generatedRefreshToken = await refreshTokenHandler.signRefreshToken(userData);
    if (generatedRefreshToken instanceof Error) {
        return new Error(generatedRefreshToken.message);
    }
    
    // Create a new object with data to update
    const refeshTokenData = {
        refreshToken: generatedRefreshToken,
        updatedAt: dateHandler.getStrDateNow(),
        expiresAt: dateHandler.addDaysDateNow(30)
    };

    // Update Refresh Token in database
    try {
        await refreshTokenModelDB.updateOne({ email: userData.email }, refeshTokenData);
        return refeshTokenData.refreshToken;
    } catch (err) {
        console.log("updateRefreshToken-Catch Error: ", err);
        return new Error(err.message);
    }
}

const deleteRefreshToken = async (userEmail) => {
    // Delete RefreshToken in database
    try {
        await refreshTokenModelDB.deleteOne({ email: userEmail });
        return true;
    } catch (err) {
        console.log("deleteRefreshToken-Catch Error: ", err);
        return new Error(err.message);
    }
}

module.exports = {
    getAllRefreshTokens,
    refreshTokenExist,
    getRefreshToken,
    createRefreshToken,
    updateRefreshToken,
    deleteRefreshToken
}