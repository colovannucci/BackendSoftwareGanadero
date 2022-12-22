// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const express = require("express");
const systemAPIRouter = express.Router();
const systemController = require("../Controllers/systemController");

// Protect the routes with an db connection middleware.
const dbConnectionMiddleware = require('../Middlewares/dbConnectionMiddleware');
systemAPIRouter.use(dbConnectionMiddleware);

// Protect the routes with an auth middleware.
const authenticationMiddleware = require('../Middlewares/authenticationMiddleware');

systemAPIRouter
    .post('/signUp', systemController.signUp)
    .post('/signIn', systemController.signIn)
    .post('/signOut', authenticationMiddleware, systemController.signOut)
    .post('/generateNewAccessToken', systemController.generateNewAccessToken)
    .post('/blockUser', systemController.blockUser)
    .post('/unblockUser', systemController.unblockUser);
    
module.exports = systemAPIRouter;