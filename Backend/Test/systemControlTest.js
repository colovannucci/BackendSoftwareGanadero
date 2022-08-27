// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const express = require("express");
const systemAPIRouter = express.Router();
const systemController = require("../Controllers/systemController");

// Protect the routes with an auth middleware.
const authenticationMiddleware = require('../Middlewares/authenticationMiddleware');

systemAPIRouter
    .get('/test', systemController.test)
    .post('/signup', systemController.signUp)
    .post('/signin', systemController.signIn)
    .post('/signout/:email', authenticationMiddleware, systemController.signOut)
    .post('/generatenewaccesstoken', systemController.generateNewAccessToken);

module.exports = systemAPIRouter;