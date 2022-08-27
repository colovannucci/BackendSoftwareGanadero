// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const express = require("express");
const userAPIRouter = express.Router();
const userController = require("../Controllers/userController");

userAPIRouter
    .get('/test', userController.test)
    .get('/getAll', userController.getAllUsers)
    .get('/password/:email', userController.getUserPassword)
    .get('/:email', userController.getUser)
    .post('/create', userController.createUser)
    .patch('/update/:email', userController.updateUser)
    .delete('/delete/:email', userController.deleteUser);

module.exports = userAPIRouter;
