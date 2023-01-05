// Use restrictive JS mode to avoid silence errors of the project
"use strict";

const express = require("express");
const animalAPIRouter = express.Router();
const animalController = require("../Controllers/animalController");

// Protect the routes with an db connection middleware.
const dbConnectionMiddleware = require("../Middlewares/dbConnectionMiddleware");
animalAPIRouter.use(dbConnectionMiddleware);

// Protect the routes with an content type header middleware.
const contentTypeMiddleware = require("../Middlewares/contentTypeMiddleware");
animalAPIRouter.use(contentTypeMiddleware.hasContentTypeHeader);
animalAPIRouter.use(contentTypeMiddleware.isApplicationJson);

// Protect all the routes with an user status middleware.
const userMiddleware = require("../Middlewares/userMiddleware");
animalAPIRouter.use(userMiddleware.userExist);
animalAPIRouter.use(userMiddleware.isNotBlocked);
/*
// Protect routes with an access token middleware.
const accessTokenMiddleware = require("../Middlewares/accessTokenMiddleware");
animalAPIRouter.use(accessTokenMiddleware.accessTokenExist);

// Protect all the routes with an authorization middleware.
const authorizationMiddleware = require("../Middlewares/authorizationMiddleware");
animalAPIRouter.use(authorizationMiddleware.hasAuthorizationHeader);
animalAPIRouter.use(authorizationMiddleware.hasBearerToken);
animalAPIRouter.use(authorizationMiddleware.isAuthorized);
*/

// Protect all the routes with an animal middleware.
const animalMiddleware = require("../Middlewares/animalMiddleware");

animalAPIRouter
  .post("/get/all/byUser", animalController.getAllAnimalsByUser)
  .post("/get/all/byEstablishment", animalController.getAllAnimalsByEstablishment)
  .post("/get/one", animalMiddleware.animalExist, animalController.getAnimal)
  .post("/create", animalMiddleware.animalNotExist, animalController.createAnimal)
  .post("/update", animalMiddleware.animalExist, animalController.updateAnimal)
  .post("/delete", animalMiddleware.animalExist, animalController.deleteAnimal);

module.exports = animalAPIRouter;