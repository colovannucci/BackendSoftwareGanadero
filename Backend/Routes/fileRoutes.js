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
/*
// Protect all the routes with an user status middleware.
const userMiddleware = require("../Middlewares/userMiddleware");
fileAPIRouter.use(userMiddleware.userExist);
fileAPIRouter.use(userMiddleware.isNotBlocked);

// Protect routes with an access token middleware.
const accessTokenMiddleware = require("../Middlewares/accessTokenMiddleware");
fileAPIRouter.use(accessTokenMiddleware.accessTokenExist);

// Protect all the routes with an authorization middleware.
const authorizationMiddleware = require("../Middlewares/authorizationMiddleware");
fileAPIRouter.use(authorizationMiddleware.hasAuthorizationHeader);
fileAPIRouter.use(authorizationMiddleware.hasBearerToken);
fileAPIRouter.use(authorizationMiddleware.isAuthorized);
*/
// Protect all the routes with an file middleware.
const fileMiddleware = require("../Middlewares/fileMiddleware");

fileAPIRouter
  .post("/animalSheet", fileMiddleware.saveAnimalSheet, fileController.animalSheet)

module.exports = fileAPIRouter;