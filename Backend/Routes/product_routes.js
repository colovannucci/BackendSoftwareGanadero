// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const express = require("express");
const productAPIRouter = express.Router();
const productController = require("../Modules/Product/product_controller");

// Protect all the routes with an auth middleware.
const authenticationMiddleware = require('../Middlewares/authenticationMiddleware');
productAPIRouter.use(authenticationMiddleware);

productAPIRouter
  .get("/all", productController.getAllProducts)
  .get("/one/:productId", productController.getProduct)
  .post("/create", productController.createProduct)
  .patch("/update/:productId", productController.updateProduct)
  .delete("/delete/:productId", productController.deleteProduct);

module.exports = productAPIRouter;