// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const express = require("express");
const testAPIRouter = express.Router();

const productController = require("../Modules/Product/product_controller");
const refreshTokenController = require("../Modules/RefreshToken/refresh_token_controller");
const userController = require("../Modules/User/user_controller");


testAPIRouter
    .get("/refreshtokens/all", refreshTokenController.getAllRefreshTokens)
    .get("/users/all/", userController.getAllUsers);

module.exports = testAPIRouter;