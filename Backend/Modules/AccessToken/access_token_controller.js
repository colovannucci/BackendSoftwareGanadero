// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Use environment variables
require('dotenv').config()

const jwt = require('jsonwebtoken');
// Call MongoDB model
const RefreshTokenDBModel = require('../RefreshToken/refresh_token_model');

function generateAccessToken(user){
    const accessToken = jwt.sign( { user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
    return accessToken;
}

async function getNewAccessToken(req, res){
    const userEmail = req.params.email;
    const refreshToken = req.body.token;
    // Check if refresh token was provided
    if (refreshToken == null) return res.status(401).send({ status: "ERROR", message: 'No refresh token provided.' });
    
    // Check if Refresh token is in DB
    const isValid = RefreshTokenDBModel.findOne({ email: userEmail });

    console.log("ISVALID")
    console.log(isValid.email);

    if (isValid == null) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
    
            const accessToken = generateAccessToken({ name: user.name })
            res.status(200).send({ status: "OK", message: 'User access token generated', accessToken: accessToken });
        });
    } else{
        return res.status(403).send({ status: "ERROR", message: 'Refresh token not authorized to access' });
    }
}

module.exports = {
    generateAccessToken,
    getNewAccessToken
}