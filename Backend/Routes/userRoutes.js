// Use restrictive JS mode to avoid silence errors of the project
"use strict";

const express = require("express");
const userAPIRouter = express.Router();
const userController = require("../Controllers/userController");

// Protect the routes with an db connection middleware.
const dbConnectionMiddleware = require("../Middlewares/dbConnectionMiddleware");
userAPIRouter.use(dbConnectionMiddleware);

// Protect the routes with an content type header middleware.
const contentTypeMiddleware = require("../Middlewares/contentTypeMiddleware");
userAPIRouter.use(contentTypeMiddleware.hasContentTypeHeader);
userAPIRouter.use(contentTypeMiddleware.isApplicationJson);

// Protect all the routes with an user status middleware.
const userMiddleware = require("../Middlewares/userMiddleware");
userAPIRouter.use(userMiddleware.userExist);
userAPIRouter.use(userMiddleware.isNotBlocked);

// Protect routes with an access token middleware.
const accessTokenMiddleware = require("../Middlewares/accessTokenMiddleware");
userAPIRouter.use(accessTokenMiddleware.accessTokenExist);

// Protect all the routes with an authorization middleware.
const authorizationMiddleware = require("../Middlewares/authorizationMiddleware");
userAPIRouter.use(authorizationMiddleware.hasAuthorizationHeader);
userAPIRouter.use(authorizationMiddleware.hasBearerToken);
userAPIRouter.use(authorizationMiddleware.isAuthorized);

// Protect routes with an refresh token middleware.
const refreshTokenMiddleware = require("../Middlewares/refreshTokenMiddleware");

userAPIRouter
  .post("/get", userController.getUser)
  .post("/update", userController.updateUser)
  .post(
    "/delete",
    refreshTokenMiddleware.refreshTokenExist,
    userController.deleteUser
  );

module.exports = userAPIRouter;
