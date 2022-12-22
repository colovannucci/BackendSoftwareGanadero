// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Use environment variables
require('dotenv').config()

const verifyUnblockUserToken = (unblockUserToken) => {
    // Verify if block user token provided is the same as we have saved in environement settings
    if (unblockUserToken == process.env.APPSETTING_UNBLOCK_USER_TOKEN) {
        return true;
    }
    return false;
}

module.exports = {
    verifyUnblockUserToken
}