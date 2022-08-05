// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const express = require("express");
const userAPIRouter = express.Router();
const userController = require("../../Modules/User/user_controller");

// Protect all the routes with an auth middleware.
const authenticationMiddleware = require('../../Middlewares/authentication_middleware');
userAPIRouter.use(authenticationMiddleware);

userAPIRouter
  .get("/one/:email", userController.getUser)
  .patch("/update/:email", userController.updateUser)
  .delete("/delete/:email", userController.deleteUser)
  .delete("/signout/:email", userController.signOut);

module.exports = userAPIRouter;
