// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Create an instance of userService
const userService = require('../Services/userService');

const getUser = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const userFound = await userService.getUser(body);
    res.status(userFound.code).send(userFound);
}

const updateUser = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const userUpdated = await userService.updateUser(body);
    res.status(userUpdated.code).send(userUpdated);
}

const deleteUser = async (req, res) => {
    // Collect body fields with user data
    const { body } = req;

    const userDeleted = await userService.deleteUser(body);
    res.status(userDeleted.code).send(userDeleted);
}

const testRoutes = (req, res) => {
    console.log('User Routes connected successfully');
    res.status(200).send('User Routes connected successfully');
}

module.exports = {
    testRoutes,
    getUser,
    updateUser,
    deleteUser
}