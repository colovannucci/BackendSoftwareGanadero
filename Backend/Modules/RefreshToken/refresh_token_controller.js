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

    RefreshTokenDBModel.findOne({ email: userEmail }, function (err, record) {
        if (record == null){
            // Declare the refresh token and save it in DB
            const newRefreshToken = new RefreshTokenDBModel();
            newRefreshToken.email = userEmail;
            newRefreshToken.refreshToken = refreshToken;
            // Add fields createdId, createdAt and expiresAt
            newRefreshToken.createdId = uuid();
            newRefreshToken.createdAt = Date().toLocaleString("en-US", { timezone: "UTC" });
            newRefreshToken.expiresAt = moment().add(30, 'days').unix();

            console.log("NEW REFRESH TOKEN");
            console.log(newRefreshToken)
            // Store new refresh token in DB
            newRefreshToken.save()
                .then(tokenStored => {
                    console.log('Refresh token saved successfully');
                    return true;           
                })
                .catch(err => {
                    console.log(`Error saving new refresh token: ${err}`);
                    return false;
                });
        } else {
            RefreshTokenDBModel.updateOne({ email: userEmail }, { refreshToken: refreshToken}, function (err, updated) {
                if (updated == null){
                    return false;
                } else {
                    return true;
                }
            })
        }
    })
    /*
    const isAlreadySaved = RefreshTokenDBModel.findOne({ userEmail: userEmail });
    if (isAlreadySaved == null) {
        
    } else {
        
    }
    
    const deletedTokenResponse = deleteRefreshToken(userEmail);
    console.log('Deleted refresh token');
    console.log(deletedToken);
    if (deletedToken === false){
        
    }
    */
}

function deleteRefreshToken(userEmail){
    // Search in users DB by email address and update it
    RefreshTokenDBModel.deleteOne({ email: userEmail })
        .then(tokendeleted => {
            console.log('Refresh token deleted succesfully');
            return true;
        })
        .catch(err => {
            console.log(`Error deleting refresh token of: ${userEmail}-Error: ${err}`);
            return false;
        });
    //return false;
}

function getAllRefreshTokens(req, res){
    // Search for products without any query parameters
    RefreshTokenDBModel.find({})
        .then(tokensFound => {
            res.status(200).send({ status: "OK", refreshTokens: tokensFound });
        })
        .catch(err => {
            res.status(500).send({ status: "ERROR", message: 'Error finding all tokens' });
            console.log(`Error finding all tokens: ${err}`);
        });
}

module.exports = {
    generateRefreshToken,
    saveRefreshToken,
    deleteRefreshToken,
    getAllRefreshTokens
}