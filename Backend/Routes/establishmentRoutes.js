// Use restrictive JS mode to avoid silence errors of the project
"use strict";

const express = require("express");
const establishmentAPIRouter = express.Router();
const establishmentController = require("../Controllers/establishmentController");

establishmentAPIRouter
  .post("/get/all", establishmentController.getAllEstablishments)
  .post("/get/one", establishmentController.getEstablishment)
  .post("/create", establishmentController.createEstablishment)
  .post("/update", establishmentController.updateEstablishment)
  .post("/delete", establishmentController.deleteEstablishment);

module.exports = establishmentAPIRouter;
