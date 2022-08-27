// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Create an instance of User Service
const userServices = require('../Services/userService');

const getAllUsers = async (req, res) => {
    const allUsers = await userServices.getAllUsers();
    res.status(allUsers.code).send(allUsers);
}

const getUser = async (req, res) => {
    const userEmail = req.params.email;

    const userFound = await userServices.getUser(userEmail);
    res.status(userFound.code).send(userFound);
}

const createUser = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const userSaved = await userServices.createUser(body);
    res.status(userSaved.code).send(userSaved);
}

const updateUser = async (req, res) => {
    const userEmail = req.params.email;

    // Collect body fields with user data
    const { body } = req;

    const userUpdated = await userServices.updateUser(userEmail, body);
    res.status(userUpdated.code).send(userUpdated);
}

const deleteUser = async (req, res) => {
    const userEmail = req.params.email;

    const userDeleted = await userServices.deleteUser(userEmail);
    res.status(userDeleted.code).send(userDeleted);
}

const test = (req, res) => {
    console.log('HOLA');
    res.status(200).send('User Routes tested successfully');
}

const getUserPassword = async (req, res) => {
    const email = req.params.email;

    const userPassword = await userServices.getUserPassword(email);
    res.status(userPassword.code).send(userPassword);
}

module.exports = {
    test,
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserPassword
}