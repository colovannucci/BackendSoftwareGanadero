// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const express = require("express");
const authenticationAPIRouter = express.Router();
const authorizationController = require("../Modules/Authorization/authorization_controller");

authenticationAPIRouter
  .post("/signup", authorizationController.signUp)
  .post("/signin", authorizationController.signIn)

module.exports = authenticationAPIRouter;