// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require bcrypt library
const bcrypt = require('bcrypt');

const encryptPassword = async (plainPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        return hashedPassword;
    } catch (err) {
        console.log("encrypt-Catch Error: ", err);
        return new Error(err.message);
    }
}

const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const isValid = await bcrypt.compare(plainPassword, hashedPassword);
        return isValid;
    } catch (err) {
        console.log("compare-Catch Error: ", err);
        return new Error(err.message);
    }
}

module.exports = {
    encryptPassword,
    comparePassword
}