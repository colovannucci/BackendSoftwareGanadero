// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const hasRequiredFields = async (userData) => {
    // Check if body has all required fields
    if (
        userData.email &&
        userData.password &&
        userData.name
    ) {
        return true;
    }
    return false;
}

const hasValidFields = async (userData) => {
    // Specify valid fields
    const validFields = ["email", "password", "name"];
    let isValid= true;
    // Collect all body fields
    Object.keys(userData).forEach(fieldName => {
        // Check if body has not valid fields
        if(!validFields.includes(fieldName)){
            isValid = false;
        }
    });
    return isValid;
}

const hasRequiredCredentials = async (userCredentials) => {
    // Check if body is not empty
    if (
        userCredentials.email &&
        userCredentials.password
    ) {
      return true;
    }
    return false;
}

const hasValidCredentials = async (userCredentials) => {
    // Specify valid fields
    const validFields = ["email", "password"];
    let isValid= true;
    // Collect all body fields
    Object.keys(userCredentials).forEach(fieldName => {
        // Check if body has not valid fields
        if(!validFields.includes(fieldName)){
            isValid = false;
        }
    });
    return isValid;
}

module.exports = {
    hasRequiredFields,
    hasValidFields,
    hasRequiredCredentials,
    hasValidCredentials
}