// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Use environment variables
require('dotenv').config()

// Call MongoDB model
const RefreshTokenDBModel = require('./refresh_token_model');

const { v4: uuid } = require("uuid");
const moment = require('moment');
const jwt = require('jsonwebtoken');


function generateRefreshToken(user){
    const refreshToken = jwt.sign( { user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
    return refreshToken;
}

function saveRefreshToken(userEmail, refreshToken){
    const isAlreadySaved = RefreshTokenDBModel.findOne({ userEmail: userEmail });
    if (isAlreadySaved) {
        // Search in users DB by email address and update it
        RefreshTokenDBModel.deleteOne({ email: userEmail })
            .then(tokendeleted => {
                console.log(`Refresh token deleted: ${tokendeleted.email}`);
                return true;
            })
            .catch(err => {
                console.log(`Error updating refresh token of: ${erruserEmail}-Error: ${err}`);
                return false;
            });
    }
    // Declare the refresh token and save it in DB
    const newRefreshToken = new RefreshTokenDBModel();
    newRefreshToken.email = userEmail;
    newRefreshToken.token = refreshToken;
    // Add fields createdId, createdAt and expiresAt
    newRefreshToken.createdId = uuid();
    newRefreshToken.createdAt = Date().toLocaleString("en-US", { timezone: "UTC" });
    newRefreshToken.expiresAt = moment().add(30, 'days').unix();

    // Store new refresh token in DB
    newRefreshToken.save()
        .then(tokenStored => {
            console.log(`Refresh token saved: ${tokenStored.email}`);
            return true;           
        })
        .catch(err => {
            console.log(`Error saving new refresh token: ${err}`);
            return false;
        });
}

function deleteRefreshToken(userEmail){
    // Search in users DB by email address and update it
    RefreshTokenDBModel.deleteOne({ email: userEmail })
        .then(tokendeleted => {
            console.log('Refresh token deleted succesfully');
            return true;
        })
        .catch(err => {
            console.log(`Error updating refresh token of: ${userEmail}-Error: ${err}`);
            return false;
        });
}

function getAllRefreshTokens(req, res){
    // Search for products without any query parameters
    RefreshTokenDBModel.find({})
        .then(tokensFound => {
            res.status(200).send({ status: "OK", tokens: tokensFound });
        })
        .catch(err => {
            res.status(500).send({ status: "ERROR", message: 'Error finding all tokens' });
            console.log(`Error finding all tokens: ${err}`);
        });
}

function getRefreshToken(req, res) {

}

module.exports = {
    generateRefreshToken,
    saveRefreshToken,
    deleteRefreshToken,
    getAllRefreshTokens,
    getRefreshToken
}