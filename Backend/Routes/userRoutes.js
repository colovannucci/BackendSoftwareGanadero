// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const express = require("express");
const userAPIRouter = express.Router();
const userController = require("../Controllers/userController");

// Protect the routes with an db connection middleware.
const dbConnectionMiddleware = require('../Middlewares/dbConnectionMiddleware');
userAPIRouter.use(dbConnectionMiddleware);

// Protect the routes with an content type header middleware.
const contentTypeMiddleware = require('../Middlewares/contentTypeMiddleware');
userAPIRouter.use(contentTypeMiddleware.isApplicationJson);

// Protect all the routes with an authorization middleware.
const authorizationMiddleware = require('../Middlewares/authorizationMiddleware');
userAPIRouter.use(authorizationMiddleware.hasAuthorizationHeader);
userAPIRouter.use(authorizationMiddleware.hasBearerToken);
userAPIRouter.use(authorizationMiddleware.hasAccessToken);
userAPIRouter.use(authorizationMiddleware.isAuthorized);

userAPIRouter
  .get("/get/:userEmail", userController.getUser)
  .patch("/update/:userEmail", userController.updateUser)
  .delete("/delete/:userEmail", userController.deleteUser)

module.exports = userAPIRouter;
