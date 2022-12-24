// Use restrictive JS mode to avoid silence errors of the project
"use strict";

const express = require("express");
const systemAPIRouter = express.Router();
const systemController = require("../Controllers/systemController");

// Protect the routes with an db connection middleware.
const dbConnectionMiddleware = require("../Middlewares/dbConnectionMiddleware");
systemAPIRouter.use(dbConnectionMiddleware);

// Protect the routes with an content type header middleware.
const contentTypeMiddleware = require("../Middlewares/contentTypeMiddleware");
systemAPIRouter.use(contentTypeMiddleware.isApplicationJson);

// Protect routes with an access token middleware.
const accessTokenMiddleware = require("../Middlewares/accessTokenMiddleware");

// Protect the routes with an authorization middleware.
const authorizationMiddleware = require("../Middlewares/authorizationMiddleware");

// Protect the routes with an user status middleware.
const userMiddleware = require("../Middlewares/userMiddleware");

// Protect routes with an refresh token middleware.
const refreshTokenMiddleware = require("../Middlewares/refreshTokenMiddleware");

systemAPIRouter
  .post("/signUp", userMiddleware.userNotExist, systemController.signUp)
  .post(
    "/signIn",
    userMiddleware.userExist,
    userMiddleware.isNotBlocked,
    systemController.signIn
  )
  .post(
    "/signOut",
    userMiddleware.userExist,
    userMiddleware.isNotBlocked,
    refreshTokenMiddleware.refreshTokenExist,
    accessTokenMiddleware.accessTokenExist,
    authorizationMiddleware.hasAuthorizationHeader,
    authorizationMiddleware.hasBearerToken,
    authorizationMiddleware.isAuthorized,
    systemController.signOut
  )
  .post(
    "/generateNewAccessToken",
    userMiddleware.userExist,
    userMiddleware.isNotBlocked,
    refreshTokenMiddleware.refreshTokenExist,
    systemController.generateNewAccessToken
  )
  .post("/blockUser", systemController.blockUser)
  .post("/unblockUser", systemController.unblockUser);

module.exports = systemAPIRouter;
