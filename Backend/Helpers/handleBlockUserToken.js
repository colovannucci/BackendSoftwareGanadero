// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Use environment variables
require('dotenv').config()

const verifyBlockUserToken = (blockUserToken) => {
    // Verify if block user token provided is the same as we have saved in environement settings
    if (blockUserToken == process.env.APPSETTING_BLOCK_USER_TOKEN) {
        return true;
    }
    return false;
}

module.exports = {
    verifyBlockUserToken
}