// Use restrictive JS mode to avoid silence errors of the project
"use strict";

const express = require("express");
const establishmentAPIRouter = express.Router();
const establishmentController = require("../Controllers/establishmentController");

// Protect the routes with an db connection middleware.
const dbConnectionMiddleware = require("../Middlewares/dbConnectionMiddleware");
userAPIRouter.use(dbConnectionMiddleware);

// Protect the routes with an content type header middleware.
const contentTypeMiddleware = require("../Middlewares/contentTypeMiddleware");
userAPIRouter.use(contentTypeMiddleware.hasContentTypeHeader);
userAPIRouter.use(contentTypeMiddleware.isApplicationJson);

establishmentAPIRouter
  .post("/get/all", establishmentController.getAllEstablishments)
  .post("/get/one", establishmentController.getEstablishment)
  .post("/create", establishmentController.createEstablishment)
  .post("/update", establishmentController.updateEstablishment)
  .post("/delete", establishmentController.deleteEstablishment);

module.exports = establishmentAPIRouter;
