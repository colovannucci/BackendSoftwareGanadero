// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Create an instance of User Service
const userServices = require('../Services/userService');

const getUser = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const userFound = await userServices.getUser(body);
    res.status(userFound.code).send(userFound);
}

const updateUser = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const userUpdated = await userServices.updateUser(body);
    res.status(userUpdated.code).send(userUpdated);
}

const deleteUser = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const userDeleted = await userServices.deleteUser(body);
    res.status(userDeleted.code).send(userDeleted);
}

const test = (req, res) => {
    console.log('Establishment Routes connected successfully');
    res.status(200).send('Establishment Routes connected successfully');
}

module.exports = {
    test,
    getUser,
    updateUser,
    deleteUser
}