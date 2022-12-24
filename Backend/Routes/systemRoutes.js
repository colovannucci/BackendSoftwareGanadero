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

userAPIRouter.use();
systemAPIRouter
  .post("/signUp", systemController.signUp)
  .post(
    "/signIn",
    userMiddleware.userExist,
    userMiddleware.isNotBlocked,
    systemController.signIn
  )
  .post(
    "/signOut",
    userMiddleware.userExist,
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
    systemController.generateNewAccessToken
  )
  .post("/blockUser", systemController.blockUser)
  .post("/unblockUser", systemController.unblockUser);

module.exports = systemAPIRouter;
