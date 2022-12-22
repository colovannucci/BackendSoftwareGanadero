// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require handler bcrypt password
const pswHandler = require('../Helpers/handlePassword');
// Require handler for refresh token
const refreshTokenHandler = require('../Helpers/handleRefreshToken');
// Require handler for block user token
const blockUserTokenHandler = require('../Helpers/handleBlockUserToken');
// Require handler for unblock user token
const unblockUserTokenHandler = require('../Helpers/handleUnblockUserToken');
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
        return httpMsgHandler.code500('Error validating User existence', userExists.message);
    }
    if (userExists) {
        return httpMsgHandler.code400("User email already exists");
    }
    // Create user in database
    const userCreated = await userDAL.createUser(userData);
    if (userCreated instanceof Error) {
        return httpMsgHandler.code500('Error creating User', userCreated.message);
    }

    // Create an object to show user created
    const userSaved = {
        user: userCreated
    };
    return httpMsgHandler.code201('User Signed Up successfully', userSaved);
}

const signIn = async (userCredentials) => {
    // Check if body has credentails fields
    const hasRequiredCredentials = await userValidator.hasRequiredCredentials(userCredentials);
    if (!hasRequiredCredentials) {
        return httpMsgHandler.code400("Missing credentials on body");
    }
    // Check if body has only valid fields
    const hasValidCredentials = await userValidator.hasValidCredentials(userCredentials);
    if (!hasValidCredentials) {
        return httpMsgHandler.code400("Invalid credential fields added on body");
    }

    // Check if user exists in database
    const userFound = await userDAL.getUser(userCredentials.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting User', userFound.message);
    }
    if (!userFound) {
        return httpMsgHandler.code404("Invalid username or password");
    }

    // Check if user password of database
    const userPassword = await userDAL.getUserPassword(userCredentials.email);
    if (userPassword instanceof Error) {
        return httpMsgHandler.code500('Error getting Password', userPassword.message);
    }
    if (!userPassword) {
        return httpMsgHandler.code404("User has not a Password registered");
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
        return httpMsgHandler.code500('Error getting Access Token', accessTokenFound.message);
    }
    if (accessTokenFound) {
        // Update access token in database
        const accessTokenUpdated = await accessTokenDAL.updateAccessToken(userFound);
        if (accessTokenUpdated instanceof Error) {
            return httpMsgHandler.code500('Error updating Access Token', accessTokenUpdated.message);
        }

        // Save access token generated in variable
        userTokens.accessToken = accessTokenUpdated;
    } else {
        // Save access token in database
        const accessTokenSaved = await accessTokenDAL.createAccessToken(userFound);
        if (accessTokenSaved instanceof Error) {
            return httpMsgHandler.code500('Error saving Access Token', accessTokenSaved.message);
        }

        // Save access token generated in variable
        userTokens.accessToken = accessTokenSaved;
    }
    
    // Verify refresh token in database, if it exists indicate that the user has an active token
    const refreshTokenFound = await refreshTokenDAL.getRefreshTokenByEmail(userCredentials.email);
    if (refreshTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Refresh Token', refreshTokenFound.message);
    }
    if (refreshTokenFound) {
        // Update refresh token in database
        const refreshTokenUpdated = await refreshTokenDAL.updateRefreshToken(userFound);
        if (refreshTokenUpdated instanceof Error) {
            return httpMsgHandler.code500('Error updating Refresh Token', refreshTokenUpdated.message);
        }

        // Save refresh token generated in variable
        userTokens.refreshToken = refreshTokenUpdated;
    } else {
        // Save refresh token in database
        const refreshTokenSaved = await refreshTokenDAL.createRefreshToken(userFound);
        if (refreshTokenSaved instanceof Error) {
            return httpMsgHandler.code500('Error saving Refresh Token', refreshTokenSaved.message);
        }

        // Save refresh token generated in variable
        userTokens.refreshToken = refreshTokenSaved;
    }

    // Update user with new login datetime in database
    const loginTimeUpdated = userDAL.updateLoginTime(userCredentials.email);
    if (loginTimeUpdated instanceof Error) {
        return httpMsgHandler.code500('Error saving User Login Time', loginTimeUpdated.message);
    }

    return httpMsgHandler.code200('User Signed In successfully', userTokens);
}

const signOut = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Search user in database
    const userFound = await userDAL.getUser(userData.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error validating User existence', userFound.message);
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
        if (accessTokenDeleted instanceof Error) {
            return httpMsgHandler.code500('Error deleting Access Token', accessTokenDeleted.message);
        }
    }
    
    // Verify refresh token in database, if it exists indicate that the user has an active token
    const refreshTokenFound = await refreshTokenDAL.getRefreshTokenByEmail(userData.email);
    if (refreshTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Refresh Token', refreshTokenFound.message);
    }
    if (refreshTokenFound) {
        // Delete user refresh token in database
        const refreshTokenDeleted = refreshTokenDAL.deleteRefreshToken(userData.email);
        if (refreshTokenDeleted instanceof Error) {
            return httpMsgHandler.code500('Error deleting Refresh Token', refreshTokenDeleted.message);
        }
    }

    // Update user with new logout datetime in database
    const logoutTimeUpdated = userDAL.updateLogoutTime(userData.email);
    if (logoutTimeUpdated instanceof Error) {
        return httpMsgHandler.code500('Error saving User Logout Time', logoutTimeUpdated.message);
    }

    return httpMsgHandler.code200('User Signed Out successfully');
}

const generateNewAccessToken = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Check if user refresh token was provided
    if (!userData.refreshToken){
        return httpMsgHandler.code400("Refresh Token was not provided");
    }

    // Verify user in database
    const userFound = await userDAL.getUser(userData.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error validating User existence', userFound.message);
    }
    if (!userFound) {
        return httpMsgHandler.code404("User not found");
    }

    // Verify if user has a refresh token in database
    const refreshTokenFound = await refreshTokenDAL.getRefreshTokenByEmail(userData.email);
    if (refreshTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Refresh Token', refreshTokenFound.message);
    }
    if (refreshTokenFound) {
        // Verify refresh token provided is the same as we have saved in database
        if (refreshTokenFound == userData.refreshToken) {
            // Check if refresh token is valid
            const isRefreshTokenValid = refreshTokenHandler.verifyRefreshToken(userData.refreshToken);
            if (isRefreshTokenValid instanceof Error) {
                return httpMsgHandler.code401("Refresh Token is not valid");
            }
        } else {
            return httpMsgHandler.code401("Refresh Token provided does not belongs to the user");
        }
    } else {
        return httpMsgHandler.code404("Refresh Token not found");
    }
    
    // Create an empty object to save new token generated
    const userToken = {
        accessToken: ""
    };
    // Verify access token in database, if it exists indicate that the user has an active token
    const accessTokenFound = await accessTokenDAL.getAccessTokenByEmail(userData.email);
    if (accessTokenFound instanceof Error) {
        return httpMsgHandler.code500('Error getting Access Token', accessTokenFound.message);
    }
    if (accessTokenFound) {
        // Update access token in database
        const accessTokenUpdated = await accessTokenDAL.updateAccessToken(userFound);
        if (accessTokenUpdated instanceof Error) {
            return httpMsgHandler.code500('Error updating Access Token', accessTokenUpdated.message);
        }

        // Save access token generated in variable
        userToken.accessToken = accessTokenUpdated;
    } else {
        // Save access token in database
        const accessTokenSaved = await accessTokenDAL.createAccessToken(userFound);
        if (accessTokenSaved instanceof Error) {
            return httpMsgHandler.code500('Error saving Access Token', accessTokenSaved.message);
        }

        // Save access token generated in variable
        userToken.accessToken = accessTokenSaved;
    }

    return httpMsgHandler.code201('New Access Token generated successfully', userToken);
}

const blockUser = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Check if block User Token was provided
    if (!userData.blockUserToken){
        return httpMsgHandler.code400("Block User Token was not provided");
    }

    // Verify user in database
    const userFound = await userDAL.getUser(userData.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting User', userFound.message);
    }
    if (!userFound) {
        return httpMsgHandler.code404("User not found");
    }

    // Verify if user has a blocked status in database
    const blockedStatusFound = await userDAL.getUserBlockedStatus(userData.email);
    if (blockedStatusFound instanceof Error) {
        return httpMsgHandler.code500('Error getting User Blocked status', blockedStatusFound.message);
    }
    // Check if the user is already blocked
    if (blockedStatusFound) {
        return httpMsgHandler.code404("The User is already Blocked");
    }

    // Check if block user token is valid
    const isBlockUserTokenValid = blockUserTokenHandler.verifyBlockUserToken(userData.blockUserToken);
    if (!isBlockUserTokenValid) {
        return httpMsgHandler.code401("Block User Token provided is not valid");
    }
    
    // Update user with new blocked datetime in database
    const bloquedTimeUpdated = userDAL.updateBlockedTime(userData.email);
    if (bloquedTimeUpdated instanceof Error) {
        return httpMsgHandler.code500('Error saving User Blocked Time', bloquedTimeUpdated.message);
    }

    return httpMsgHandler.code200('User Blocked successfully');
}

const unblockUser = async (userData) => {
    // Check if user email was provided
    if (!userData.email){
        return httpMsgHandler.code400("User email was not provided");
    }
    // Check if user refresh token was provided
    if (!userData.refreshToken){
        return httpMsgHandler.code400("Refresh Token was not provided");
    }

    // Verify user in database
    const userFound = await userDAL.getUser(userData.email);
    if (userFound instanceof Error) {
        return httpMsgHandler.code500('Error getting User', userFound.message);
    }
    if (!userFound) {
        return httpMsgHandler.code404("User not found");
    }

    // WRITE PROCESS

    return httpMsgHandler.code200('User Unblocked successfully');
}

module.exports = {
    signUp,
    signIn,
    signOut,
    generateNewAccessToken,
    blockUser,
    unblockUser
}