// Use restrictive JS mode to avoid silence errors of the project
"use strict";

const express = require("express");
const establishmentAPIRouter = express.Router();
const establishmentController = require("../Controllers/establishmentController");

// Protect the routes with an db connection middleware.
const dbConnectionMiddleware = require("../Middlewares/dbConnectionMiddleware");
establishmentAPIRouter.use(dbConnectionMiddleware);

// Protect the routes with an content type header middleware.
const contentTypeMiddleware = require("../Middlewares/contentTypeMiddleware");
establishmentAPIRouter.use(contentTypeMiddleware.hasContentTypeHeader);
establishmentAPIRouter.use(contentTypeMiddleware.isApplicationJson);


// Protect all the routes with an user status middleware.
const userMiddleware = require("../Middlewares/userMiddleware");
establishmentAPIRouter.use(userMiddleware.userExist);
establishmentAPIRouter.use(userMiddleware.isNotBlocked);

// Protect routes with an access token middleware.
const accessTokenMiddleware = require("../Middlewares/accessTokenMiddleware");
establishmentAPIRouter.use(accessTokenMiddleware.accessTokenExist);

// Protect all the routes with an authorization middleware.
const authorizationMiddleware = require("../Middlewares/authorizationMiddleware");
establishmentAPIRouter.use(authorizationMiddleware.hasAuthorizationHeader);
establishmentAPIRouter.use(authorizationMiddleware.hasBearerToken);
establishmentAPIRouter.use(authorizationMiddleware.isAuthorized);

// Protect all the routes with an establishment middleware.
const establishmentMiddleware = require("../Middlewares/establishmentMiddleware");

establishmentAPIRouter
  .post("/get/all", establishmentController.getAllEstablishments)
  .post("/get/one", establishmentMiddleware.establishmentExist, establishmentController.getEstablishment)
  .post("/create", establishmentMiddleware.establishmentNotExist, establishmentController.createEstablishment)
  .post("/update", establishmentMiddleware.establishmentExist, establishmentController.updateEstablishment)
  .post("/delete", establishmentMiddleware.establishmentExist, establishmentController.deleteEstablishment);

module.exports = establishmentAPIRouter;