// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require bcrypt library
const bcrypt = require('bcrypt')

const encrypt = async (plainPassword) => {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    return hashedPassword;
}

const compare = async (plainPassword, hashedPassword) => {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword)
    return isValid;
}

module.exports = {
    encrypt,
    compare
}