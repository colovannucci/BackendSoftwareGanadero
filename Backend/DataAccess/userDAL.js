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
        console.log("getAllUsers-Catch Error: ", err);
        return new Error(err.message);
    }
}

const userExist = async (userEmail) => {
    try {
        const userExists = await UserModelDB.exists({ email: userEmail });
        return userExists;
    } catch (err) {
        console.log("userExist-Catch Error: ", err);
        return new Error(err.message);
    }
}

const getUser = async (userEmail) => {
    try {
        const userFound = await UserModelDB.findOne({ email: userEmail }).select("-_id -__v");
        return userFound;
    } catch (err) {
        console.log("getUser-Catch Error: ", err);
        return new Error(err.message);
    }
}

const createUser = async (userData) => {
    // Declare new user object with data received
    const newUser = new UserModelDB();
    newUser.email = userData.email;
    newUser.name = userData.name;

    // Encrypt password
    const hashedPassword = await pswHandler.encryptPassword(userData.password);
    if (hashedPassword instanceof Error) {
        return httpMsgHandler.code500('Error hashing Password', hashedPassword.message);
    }
    // Replace the password with the new password
    newUser.password = hashedPassword;

    // Generate defined values to folowing attributes
    newUser.createdId = uuid();
    newUser.createdAtTime = dateHandler.getStrDateNow();
    newUser.updatedAtTime = "";
    newUser.lastLoginTime = "";
    newUser.lastLogoutTime = "";
    newUser.isBlocked = false;
    newUser.lastBlockedTime = "";
    newUser.lastUnblockedTime = "";
    
    // Save new user in database
    try {
        await newUser.save();
        // Delete password from returned object for security reasons
        delete userData.password;
        return userData;
    } catch (err) {
        console.log("createUser-Catch Error: ", err);
        return new Error(err.message);
    }
}

const updateUser = async (userEmail, userData) => {
    // Check if the user wants to update his password
    if (userData.password){
        // Encrypt password
        const hashedPassword = await pswHandler.encryptPassword(userData.password);
        if (hashedPassword instanceof Error) {
            return new Error(hashedPassword.message);
        }
        // Replace the password with the new password
        userData.password = hashedPassword;
    }
    // Add field updatedAt
    userData.updatedAt = dateHandler.getStrDateNow();

    // Update user in database
    try {
        await UserModelDB.updateOne({ email: userEmail }, userData);
        return true;
    } catch (err) {
        console.log("updateUser-Catch Error: ", err);
        return new Error(err.message);
    }
}

const deleteUser = async (userEmail) => {
    // Delete user in database
    try {
        await UserModelDB.deleteOne({ email: userEmail });
        return true;
    } catch (err) {
        console.log("deleteUser-Catch Error: ", err);
        return new Error(err.message);
    }
}

const getUserPassword = async (userEmail) => {
    try {
        const userData = await UserModelDB.findOne({email: userEmail}).select("password");
        return userData.password;
    } catch (err) {
        console.log("getUserPassword-Catch Error: ", err);
        return new Error(err.message);
    }
}

const updateLoginTime = async (userEmail) => {
    // Create the last login time
    const loginTime = dateHandler.getStrDateNow();
    // Update the last login time in database
    try {
        await UserModelDB.updateOne({ email: userEmail }, { lastLoginTime: loginTime });
        return true;
    } catch (err) {
        console.log("updateLastLoginTime-Catch Error: ", err);
        return new Error(err.message);
    }
}

const updateLogoutTime = async (userEmail) => {
    // Create the last logout time
    const logoutTime = dateHandler.getStrDateNow();
    // Update the last logout time in database
    try {
        await UserModelDB.updateOne({ email: userEmail }, { lastLogoutTime: logoutTime });
        return true;
    } catch (err) {
        console.log("updateLogoutTime-Catch Error: ", err);
        return new Error(err.message);
    }
}

const blockUser = async (userEmail) => {
    // Update user blocked status in database
    try {
        await UserModelDB.updateOne({ email: userEmail }, { isBlocked: true });
        return true;
    } catch (err) {
        console.log("blockUser-Catch Error: ", err);
        return new Error(err.message);
    }
}

const unblockUser = async (userEmail) => {
    // Update user blocked status in database
    try {
        await UserModelDB.updateOne({ email: userEmail }, { isBlocked: false });
        return true;
    } catch (err) {
        console.log("unblockUser-Catch Error: ", err);
        return new Error(err.message);
    }
}

const getUserBlockedStatus = async (userEmail) => {
    try {
        const userData = await UserModelDB.findOne({email: userEmail}).select("isBlocked");
        return userData.isBlocked;
    } catch (err) {
        console.log("getUserBlockedStatus-Catch Error: ", err);
        return new Error(err.message);
    }
}

const updateBlockedTime = async (userEmail) => {
    // Create the last login time
    const bloquedTime = dateHandler.getStrDateNow();
    // Update the last login time in database
    try {
        await UserModelDB.updateOne({ email: userEmail }, { lastBlockedTime: bloquedTime });
        return true;
    } catch (err) {
        console.log("updateBlockedTime-Catch Error: ", err);
        return new Error(err.message);
    }
}

const updateUnblockedTime = async (userEmail) => {
    // Create the last logout time
    const unbloquedTime = dateHandler.getStrDateNow();
    // Update the last logout time in database
    try {
        await UserModelDB.updateOne({ email: userEmail }, { lastUnblockedTime: unbloquedTime });
        return true;
    } catch (err) {
        console.log("updateUnblockedTime-Catch Error: ", err);
        return new Error(err.message);
    }
}

module.exports = {
    getAllUsers,
    userExist,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserPassword,
    updateLoginTime,
    updateLogoutTime,
    blockUser,
    unblockUser,
    getUserBlockedStatus,
    updateBlockedTime,
    updateUnblockedTime
}