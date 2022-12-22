// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Use "uuid" library to generate unique IDs
const { v4: uuid } = require("uuid");
// Require handler for refresh token
const refreshTokenHandler = require('../Helpers/handleRefreshToken');
// Require handler moment dates
const dateHandler = require('../Helpers/handleDate');
// Use MongoDB RefreshToken Schema
const RefreshTokenModelDB = require('../Models/refreshTokenModel');

const getAllRefreshTokens = async () => {
    try {
        const allRefreshTokens = await RefreshTokenModelDB.find({}).select("-_id -__v");
        if (allRefreshTokens.length === 0) {
            return null;
        }
        return allRefreshTokens;
    } catch (err) {
        console.log(`getAllRefreshTokens-Catch Error: ${err}`);
        return new Error(err);
    }
}

const getRefreshTokenByEmail = async (userEmail) => {
    try {
        const refreshTokenFound = await RefreshTokenModelDB.findOne({ email: userEmail }).select("-_id -__v");
        if (!refreshTokenFound) {
            return null;
        }
        return refreshTokenFound.refreshToken;
    } catch (err) {
        console.log(`getRefreshTokenByEmail-Catch Error: ${err}`);
        return new Error(err);
    }
}

const getRefreshToken = async (token) => {
    try {
        const refreshTokenFound = await RefreshTokenModelDB.findOne({ refreshToken: token }).select("-_id -__v");
        if (!refreshTokenFound) {
            return null;
        }
        return refreshTokenFound.refreshToken;
    } catch (err) {
        console.log(`getRefreshToken-Catch Error: ${err}`);
        return new Error(err);
    }
}

const createRefreshToken = async (userData) => {
     // Declare new RefreshToken object with data received
    const newRefreshToken = new RefreshTokenModelDB();
    newRefreshToken.email = userData.email;
    newRefreshToken.refreshToken = refreshTokenHandler.signRefreshToken(userData);

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
        console.log(`createRefreshToken-Catch Error: ${err}`);
        return new Error(err);
    }
}

const updateRefreshToken = async (userData) => {
    // Create a new object with data to update
    const refeshTokenData = {
        refreshToken: refreshTokenHandler.signRefreshToken(userData),
        updatedAt: dateHandler.getStrDateNow(),
        expiresAt: dateHandler.addDaysDateNow(30)
    };

    // Update Refresh Token in database
    try {
        await RefreshTokenModelDB.updateOne({ email: userData.email }, refeshTokenData);
        return refeshTokenData.refreshToken;
    } catch (err) {
        console.log(`updateRefreshToken-Catch Error: ${err}`);
        return new Error(err);
    }
}

const deleteRefreshToken = async (userEmail) => {
    // Delete RefreshToken in database
    try {
        await RefreshTokenModelDB.deleteOne({ email: userEmail });
        return true;
    } catch (err) {
        console.log(`deleteRefreshToken-Catch Error: ${err}`);
        return new Error(err);
    }
}

module.exports = {
    getAllRefreshTokens,
    getRefreshTokenByEmail,
    getRefreshToken,
    createRefreshToken,
    updateRefreshToken,
    deleteRefreshToken
}