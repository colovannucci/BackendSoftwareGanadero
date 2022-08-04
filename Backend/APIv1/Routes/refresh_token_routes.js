// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const express = require("express");
const refreshTokenAPIRouter = express.Router();
const refreshTokenController = require("../../Modules/RefreshToken/refresh_token_controller");

// Protect all the routes with an auth middleware.
const authenticationMiddleware = require('../../Middlewares/authentication_middleware');
refreshTokenAPIRouter.use(authenticationMiddleware);

refreshTokenAPIRouter
  .get("/all/refreshtokens", refreshTokenController.getAllRefreshTokens)
  .get("/one/:userEmail", refreshTokenController.getRefreshToken);
  
module.exports = refreshTokenAPIRouter;