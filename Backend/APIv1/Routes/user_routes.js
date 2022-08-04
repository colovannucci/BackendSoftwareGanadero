

// getAllUsers, getUser, createUser, updateUser, deleteUser
const express = require("express");
const userAPIRouter = express.Router();
const userController = require("../../Modules/User/user_controller");

userAPIRouter
  .get("/all/", userController.getAllUsers)
  .get("/one/:email", userController.getUser)
  .patch("/update/:email", userController.updateUser)
  .delete("/delete/:email", userController.deleteUser)
  .post("/signup", userController.signUp)
  .post("/login", userController.signIn);

module.exports = userAPIRouter;
