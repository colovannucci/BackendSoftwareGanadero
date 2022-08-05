// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Use environment variables
require('dotenv').config()

const jwt = require('jsonwebtoken');
// Call MongoDB model
const RefreshTokenDBModel = require('../RefreshToken/refresh_token_model');

function generateAccessToken(user){
    const accessToken = jwt.sign( { user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    return accessToken;
}

async function getNewAccessToken(req, res){
    const userEmail = req.body.email;
    const refreshToken = req.body.refreshToken;

    // Check if required fields were provided
    if (userEmail == null) return res.status(401).send({ status: "ERROR", message: 'No email provided' });
    if (refreshToken == null) return res.status(401).send({ status: "ERROR", message: 'No refresh token provided' });
    
    // Check if Refresh token is in DB
    RefreshTokenDBModel.findOne({ email: userEmail }, function (err, record) {
        if (record == null){
            return res.status(403).send({ status: "ERROR", message: 'Refresh token not authorized to access' });
        } else {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(403).send({ status: "ERROR", message: 'Refresh token not authorized to access' });
        
                const accessToken = generateAccessToken({ name: user.name })
                res.status(200).send({ status: "OK", message: 'User access token generated', accessToken: accessToken });
            });
        }
    })
}

module.exports = {
    generateAccessToken,
    getNewAccessToken
}