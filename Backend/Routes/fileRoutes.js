// Use restrictive JS mode to avoid silence errors of the project
"use strict";

const express = require("express");
const fileAPIRouter = express.Router();
const fileController = require("../Controllers/fileController");

// Protect the routes with an db connection middleware.
const dbConnectionMiddleware = require("../Middlewares/dbConnectionMiddleware");
fileAPIRouter.use(dbConnectionMiddleware);

// Protect the routes with an content type header middleware.
const contentTypeMiddleware = require("../Middlewares/contentTypeMiddleware");
fileAPIRouter.use(contentTypeMiddleware.hasContentTypeHeader);
fileAPIRouter.use(contentTypeMiddleware.isMultipartFormData);

// Protect all the routes with an user status middleware.
const userMiddleware = require("../Middlewares/userMiddleware");

// Protect routes with an access token middleware.
const accessTokenMiddleware = require("../Middlewares/accessTokenMiddleware");

// Protect all the routes with an authorization middleware.
const authorizationMiddleware = require("../Middlewares/authorizationMiddleware");

// Protect all the routes with an file middleware.
const fileMiddleware = require("../Middlewares/fileMiddleware");

fileAPIRouter.post(
  "/animalSheet",
  fileMiddleware.saveAnimalSheet,
  /*userMiddleware.userExist,
  userMiddleware.isNotBlocked,
  accessTokenMiddleware.accessTokenExist,
  authorizationMiddleware.hasAuthorizationHeader,
  authorizationMiddleware.hasBearerToken,
  authorizationMiddleware.isAuthorized,*/
  fileController.animalSheet
);

module.exports = fileAPIRouter;
