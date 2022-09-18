// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require handler bcrypt password
const pswHandler = require('../Helpers/handlePassword');
// Require handler for refresh token
const refreshTokenHandler = require('../Helpers/handleRefreshToken');
// Require handler for access token
const accessTokenHandler = require('../Helpers/handleAccessToken');
// Require user validator fields
const userValidator = require('../Validators/userValidator');
// Create an instance of User data access layer
const userDAL = require('../DataAccess/userDAL');
// Create an instance of RefreshToken data access layer
const refreshTokenDAL = require('../DataAccess/refreshTokenDAL');
// Create an instance of AccessToken data access layer
const accessTokenDAL = require('../DataAccess/accessTokenDAL');

const signUp = async (userData) => {
    // Check if body has all required fields
    const hasRequiredFields = await userValidator.hasRequiredFields(userData);
    if (!hasRequiredFields) {
        return httpMsgHandler.code400("Missing fields on body");
    }
    // Check if body has only valid fields
    const hasValidFields = await userValidator.hasValidFields(userData);
    if (!hasValidFields) {
        return httpMsgHandler.code400("Invalid fields added on body");
    }

    // Check if user email exists in database
    const userExists = await userDAL.getUser(userData.email);
    if (userExists instanceof Error) {
        return httpMsgHandler.code500('Error getting user', userExists.message);
    }
    if (userExists) {
        return httpMsgHandler.code400("User email already exists");
    }
    // Create user in database
    const userSaved = await userDAL.createUser(userData);
    if (userSaved instanceof Error) {
        return httpMsgHandler.code500('Error saving user', userSaved.message);
    }
    return httpMsgHandler.code201('User created successfully', userSaved);
}

const signIn = async (userCredentials) => {
    // Check if body has both credentails fields: email and password
    const hasCredentials = await userValidator.hasCredentials(userCredentials);
    if (!hasCredentials) {
        return httpMsgHandler.code400("Missing credentials on body");
    }

    // Check if user exists in database
    const userFound = await userDAL.getUser(userCredentials.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting user', userFound.message);
    }
    if (!userFound) {
        return httpMsgHandler.code400("Invalid username or password");
    }

    // Check if user password of database
    const userPassword = await userDAL.getUserPassword(userCredentials.email);
    if (userPassword instanceof Error) {
        return httpMsgHandler.code500('Error getting password', userPassword.message);
    }
    if (!userPassword) {
        return httpMsgHandler.code400("Invalid username or password");
    }
    // Check if user password is correct
    const isPswValid = pswHandler.compare(userCredentials.password, userPassword);
    if (!isPswValid) {
        return httpMsgHandler.code400("Invalid username or password");
    }

    // Create an empty object to save new tokens generated
    const userTokens = {
        accessToken: "", 
        refreshToken: ""
    };
    
    // Verify access token in database, if it exists indicate that the user has an active token
    const accessTokenFound = await accessTokenDAL.getAccessTokenByEmail(userCredentials.email);
    if (accessTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Access token', accessTokenFound.message);
    }
    if (accessTokenFound) {
        // Update access token in database
        const accessTokenUpdated = await accessTokenDAL.updateAccessToken(userFound);
        if (accessTokenUpdated instanceof Error) {
            return httpMsgHandler.code500('Error updating access token', accessTokenUpdated.message);
        }

        // Save access token generated in variable
        userTokens.accessToken = accessTokenUpdated;
    } else {
        // Save access token in database
        const accessTokenSaved = await accessTokenDAL.createAccessToken(userFound);
        if (accessTokenSaved instanceof Error) {
            return httpMsgHandler.code500('Error saving access token', accessTokenSaved.message);
        }

        // Save access token generated in variable
        userTokens.accessToken = accessTokenSaved;
    }
    
    // Verify refresh token in database, if it exists indicate that the user has an active token
    const refreshTokenFound = await refreshTokenDAL.getRefreshTokenByEmail(userCredentials.email);
    if (refreshTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting refresh token', refreshTokenFound.message);
    }
    if (refreshTokenFound) {
        // Update refresh token in database
        const refreshTokenUpdated = await refreshTokenDAL.updateRefreshToken(userFound);
        if (refreshTokenUpdated instanceof Error) {
            return httpMsgHandler.code500('Error updating refresh token', refreshTokenUpdated.message);
        }

        // Save refresh token generated in variable
        userTokens.refreshToken = refreshTokenUpdated;
    } else {
        // Save refresh token in database
        const refreshTokenSaved = await refreshTokenDAL.createRefreshToken(userFound);
        if (refreshTokenSaved instanceof Error) {
            return httpMsgHandler.code500('Error saving Refresh token', refreshTokenSaved.message);
        }

        // Save refresh token generated in variable
        userTokens.refreshToken = refreshTokenSaved;
    }

    // Update user with new login datetime in database
    const loginTimeUpdated = userDAL.updateLoginTime(userCredentials.email);
    if (loginTimeUpdated === false) {
        return httpMsgHandler.code500('Error saving last login time', loginTimeUpdated.message);
    }

    return httpMsgHandler.code200('User signed in successfully', userTokens);
}

const signOut = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Search user in database
    const userFound = await userDAL.getUser(userData.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting user', userFound.message);
    }
    if (!userFound) {
        return httpMsgHandler.code404("User not found");
    }

    // Verify access token in database, if it exists indicate that the user has an active token
    const accessTokenFound = await accessTokenDAL.getAccessTokenByEmail(userData.email);
    if (accessTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Access token', accessTokenFound.message);
    }
    if (accessTokenFound) {
        // Delete user access token in database
        const accessTokenDeleted = accessTokenDAL.deleteAccessToken(userData.email);
        if (accessTokenDeleted === false) {
            return httpMsgHandler.code500('Error deleting access token', accessTokenDeleted.message);
        }
    }
    
    // Verify refresh token in database, if it exists indicate that the user has an active token
    const refreshTokenFound = await refreshTokenDAL.getRefreshTokenByEmail(userData.email);
    if (refreshTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting refresh token', refreshTokenFound.message);
    }
    if (refreshTokenFound) {
        // Delete user refresh token in database
        const refreshTokenDeleted = refreshTokenDAL.deleteRefreshToken(userData.email);
        if (refreshTokenDeleted === false) {
            return httpMsgHandler.code500('Error deleting refresh token', refreshTokenDeleted.message);
        }
    }

    // Update user with new logout datetime in database
    const logoutTimeUpdated = userDAL.updateLogoutTime(userData.email);
    if (logoutTimeUpdated === false) {
        return httpMsgHandler.code500('Error saving last logout time', logoutTimeUpdated.message);
    }

    return httpMsgHandler.code200('User signed out successfully');
}

const generateNewAccessToken = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Check if user refresh token was provided
    if (!userData.refreshToken){
        return httpMsgHandler.code400("Refresh token was not provided");
    }

    // Verify user in database
    const userFound = await userDAL.getUser(userData.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting user', userFound.message);
    }
    if (!userFound) {
        return httpMsgHandler.code404("User not found");
    }

    // Verify refresh token in database
    const refreshTokenFound = await refreshTokenDAL.getRefreshTokenByEmail(userData.email);
    if (refreshTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting refresh token', refreshTokenFound.message);
    }
    if (refreshTokenFound) {
        // Verify refresh token provided is the same as we have saved in database
        if (refreshTokenFound == userData.refreshToken) {
            // Check if refresh token is valid
            const isRefreshTokenValid = refreshTokenHandler.verifyRefreshToken(userData.refreshToken);
            if (isRefreshTokenValid instanceof Error) {
                return httpMsgHandler.code400("Refresh token is not valid");
            }
        } else {
            return httpMsgHandler.code400("Refresh token not found");
        }
    } else {
        return httpMsgHandler.code404("Refresh token not found");
    }
    
    // Verify access token in database, if it exists indicate that the user has an active token
    const accessTokenFound = await accessTokenDAL.getAccessTokenByEmail(userData.email);
    if (accessTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Access token', accessTokenFound.message);
    }
    if (accessTokenFound) {
        // Update access token in database
        const accessTokenUpdated = await accessTokenDAL.updateAccessToken(userFound);
        if (accessTokenUpdated instanceof Error) {
            return httpMsgHandler.code500('Error updating access token', accessTokenUpdated.message);
        }

        return httpMsgHandler.code200('New access token generated successfully', accessTokenUpdated);
    } else {
        // Save access token in database
        const accessTokenSaved = await accessTokenDAL.createAccessToken(userFound);
        if (accessTokenSaved instanceof Error) {
            return httpMsgHandler.code500('Error saving access token', accessTokenSaved.message);
        }

        return httpMsgHandler.code200('New access token generated successfully', accessTokenSaved);
    }
}

module.exports = {
    signUp,
    signIn,
    signOut,
    generateNewAccessToken
}