// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const express = require("express");
const refreshTokenAPIRouter = express.Router();
const refreshTokenController = require("../Controllers/refreshTokenController");

refreshTokenAPIRouter
    .get('/test', refreshTokenController.test)
    .get('/getAll', refreshTokenController.getAllRefreshTokens)
    .get('/:email', refreshTokenController.getRefreshToken)
    .post('/create', refreshTokenController.createRefreshToken)
    .delete('/delete/:email', refreshTokenController.deleteRefreshToken);

module.exports = refreshTokenAPIRouter;