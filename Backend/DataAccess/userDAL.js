// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Use "uuid" library to generate unique IDs
const { v4: uuid } = require("uuid");
// Require handler moment dates
const dateHandler = require('../Helpers/handleDate');
// Require handler bcrypt password
const pswHandler = require('../Helpers/handlePassword');
// Use MongoDB User Schema
const UserModelDB = require('../Models/userModel');

const getAllUsers = async () => {
    try {
        const allUsers = await UserModelDB.find({}).select("-_id -__v");
        if (allUsers.length === 0) {
            return null;
        }
        return allUsers;
    } catch (err) {
        console.log(`getAllUsers-Catch Error: ${err}`);
        return new Error(err);
    }
}

const getUser = async (userEmail) => {
    try {
        const userFound = await UserModelDB.findOne({ email: userEmail }).select("-_id -__v");
        if (!userFound) {
            return null;
        }
        return userFound;
    } catch (err) {
        console.log(`getUser-Catch Error: ${err}`);
        return new Error(err);
    }
}

const createUser = async (userData) => {
    // Encrypt password
    userData.password = await pswHandler.encrypt(userData.password);

    // Declare new user object with data received
    const newUser = new UserModelDB();
    newUser.email = userData.email;
    newUser.name = userData.name;
    newUser.surname = userData.surname;
    newUser.birthDate = userData.birthDate;
    newUser.phone = userData.phone;
    newUser.password = userData.password;
    // Add fields country (if required), createdId, createdAt and updatedAt
    if (!userData.country) {
        newUser.country = 'Uruguay';
    } else {
      newUser.country = userData.country;
    }
    newUser.createdId = uuid();
    newUser.createdAt = dateHandler.getStrDateNow();//Date().toLocaleString("en-US", { timezone: "UTC" });
    newUser.updatedAt = dateHandler.getStrDateNow();//Date().toLocaleString("en-US", { timezone: "UTC" });

    // Save new user in database
    try {
        await newUser.save();
        // Delete password from returned object for security reasons
        delete userData.password;
        return userData;
    } catch (err) {
        console.log(`createUser-Catch Error: ${err}`);
        return new Error(err);
    }
}

const updateUser = async (userEmail, userData) => {
    //////////////////////////////////////////////////////
    // PENDING - QUITAR CUANDO SE AGREGUE FUNCIONALIDAD
    /*
    if (userData.email){
        // Actualizar quizas en token y demas cosas relacionadas 
    }
    */
    // PENDING - QUITAR CUANDO SE AGREGUE FUNCIONALIDAD
    //////////////////////////////////////////////////////

    // Check if the user wants to update his password
    if (userData.password){
        // Encrypt password
        userData.password = await pswHandler.encrypt(userData.password);
    }
    // Add field updatedAt
    userData.updatedAt = dateHandler.getStrDateNow();//Date().toLocaleString("en-US", { timezone: "UTC" });
    // Update user in database
    try {
        await UserModelDB.updateOne({ email: userEmail }, userData);
        return true;
    } catch (err) {
        console.log(`updateUser-Catch Error: ${err}`);
        return new Error(err);
    }
}

const deleteUser = async (userEmail) => {
    // Delete user in database
    try {
        await UserModelDB.deleteOne({ email: userEmail });
        return true;
    } catch (err) {
        console.log(`deleteUser-Catch Error: ${err}`);
        return new Error(err);
    }
}

const getUserPassword = async (userEmail) => {
    try {
        const userPassword = await UserModelDB.findOne({email: userEmail}).select("password");
        if (!userPassword) {
            return null;
        }
        return userPassword.password;
    } catch (err) {
        console.log(`getUserPassword-Catch Error: ${err}`);
        return new Error(err);
    }
}

const updateLoginTime = async (userEmail) => {
    // Create the last login time
    const loginTime = dateHandler.getStrDateNow();//Date().toLocaleString("en-US", { timezone: "UTC" });
    // Update the last login time in database
    try {
        await UserModelDB.updateOne({ email: userEmail }, { lastLogin: loginTime });
        return true;
    } catch (err) {
        console.log(`updateLastLoginTime-Catch Error: ${err}`);
        return new Error(err);
    }
}

const updateLogoutTime = async (userEmail) => {
    // Create the last logout time
    const logoutTime = dateHandler.getStrDateNow();//Date().toLocaleString("en-US", { timezone: "UTC" });
    // Update the last logout time in database
    try {
        await UserModelDB.updateOne({ email: userEmail }, { lastLogout: logoutTime });
        return true;
    } catch (err) {
        console.log(`updateLogoutTime-Catch Error: ${err}`);
        return new Error(err);
    }
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserPassword,
    updateLoginTime,
    updateLogoutTime
}