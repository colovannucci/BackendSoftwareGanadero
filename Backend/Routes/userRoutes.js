// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const express = require("express");
const userAPIRouter = express.Router();
const userController = require("../Controllers/userController");

// Protect all the routes with an auth middleware.
const authenticationMiddleware = require('../Middlewares/authenticationMiddleware');
userAPIRouter.use(authenticationMiddleware);

userAPIRouter
  .get("/:email", userController.getUser)
  .patch("/update/:email", userController.updateUser)
  .delete("/delete/:email", userController.deleteUser)

module.exports = userAPIRouter;
