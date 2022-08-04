// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const express = require("express");
const accessTokenAPIRouter = express.Router();
const accessTokenController = require("../../Modules/AccessToken/access_token_controller");


accessTokenAPIRouter
  .post("/new", accessTokenController.getNewAccessToken);
  
module.exports = accessTokenAPIRouter;