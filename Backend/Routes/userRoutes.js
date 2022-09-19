// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const express = require("express");
const userAPIRouter = express.Router();
const userController = require("../Controllers/userController");

// Protect all the routes with an auth middleware.
const authenticationMiddleware = require('../Middlewares/authenticationMiddleware');
userAPIRouter.use(authenticationMiddleware);

userAPIRouter
  .get("/get/:userEmail", userController.getUser)
  .patch("/update/:userEmail", userController.updateUser)
  .delete("/delete/:userEmail", userController.deleteUser)

module.exports = userAPIRouter;
