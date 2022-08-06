
// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// uuid library to generate unique IDs
const { v4: uuid } = require("uuid");

// Call MongoDB model
const UserDBModel = require('../User/user_model');

const refreshTokenController = require('../RefreshToken/refresh_token_controller');
const accessTokenController = require('../AccessToken/access_token_controller');
const userController = require('../User/user_controller');


const bcrypt = require('bcrypt');

async function signUp (req, res) {
    // Collect body fields
    const { body } = req;
    // Check if body is not empty
    if (
        !body.email ||
        !body.password ||
        !body.name ||
        !body.surname ||
        !body.phone
        //!body.birthDate || // PENDING: aceptar fecha desde rest body
    ) {
        return res.status(400).send({ status: "ERROR", message: 'Missing fields' });
    }
    // Check if cretedId, createdAt and updatedAt are empty
    if (
        body.createdId ||
        body.createdAt ||
        body.updatedAt
    ) {
        return res.status(400).send({ status: "ERROR", message: 'Prohibited fields added' });
    }
  
    // Check if user email already exists
    const user = await UserDBModel.findOne({ email: body.email });
    if (user) {
      return res.status(400).send({ status: "ERROR", message: 'Email already exists' });
    }

    // Declare new user object with data received
    const newUser = new UserDBModel();
    newUser.email = body.email;
    newUser.name = body.name;
    newUser.surname = body.surname;
    newUser.birthDate = body.birthDate;
    newUser.phone = body.phone;
    // Add fields country (if required), createdId, createdAt and updatedAt
    if (!body.country) {
        newUser.country = 'Uruguay';
    } else {
      newUser.country = body.country;
    }
    newUser.createdId = uuid();
    newUser.createdAt = Date().toLocaleString("en-US", { timezone: "UTC" });
    newUser.updatedAt = Date().toLocaleString("en-US", { timezone: "UTC" });
    
    // Hash the user password before saving it
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      newUser.password = hashedPassword;

      // Store new product in DB
      newUser.save()
        .then(userStored => {
            res.status(201).send({ status: "OK", message: 'User created successfully', user: userStored });
        })
        .catch(err => {
          console.log(`Error saving new user: ${err.message}`);
          return res.status(500).send({ status: "ERROR", message: 'Error saving new user' });
        });
    } catch (err) {
      console.log(`Error hashing password: ${err}`);
      res.status(500).send({ status: "ERROR", message: 'Error hashing password' });
    }
}
  
async function signIn(req, res){

    // CORS requests
    res.setHeader("Access-Control-Allow-Origin",  "*")  //sets the allow use to all requests html header

    // Collect body fields
    const { body } = req;

    // Check if body is not empty
    if (
        !body.email ||
        !body.password
    ) {
      return res.status(400).send({ status: "ERROR", message: 'Missing fields' });
    }
    const userEmail = body.email;
    const userPass = body.password;
    
    // Search in users DB by email address
    UserDBModel.findOne({ email: userEmail })
      .then(async userFound => {
        // If user doesn't exist
        if (!userFound) return res.status(404).send({ status: "ERROR", message: 'Invalid username or password' }); 
  
        // Check if password is correct
        try {
          if (await bcrypt.compare(userPass, userFound.password)){
            
            // Generate new tokens 
            const accessToken = accessTokenController.generateAccessToken(userFound);
            if (!accessToken) {
              return res.status(500).send({ status: "ERROR", message: 'Access Token creation failed' });
            }
            const refreshToken = refreshTokenController.generateRefreshToken(userFound);
            if (!refreshToken) {
              return res.status(500).send({ status: "ERROR", message: 'Refresh Token creation failed' });
            }

            // Save refresh token in DB
            const refreshTokenStored = refreshTokenController.saveRefreshToken(userEmail, refreshToken);
            if (refreshTokenStored === false) {
              return res.status(500).send({ status: "ERROR", message: 'Refresh Token saving failed' });
            }

            // Update user with new login date
            const userUpdated = userController.updateLastLoginTime(userEmail);
            if (userUpdated === false) {
              return res.status(500).send({ status: "ERROR", message: 'Last login time saving failed' });
            }

            // Send response with tokens
            res.status(200).send({ status: "OK", message: 'User signed in successfully', accessToken: accessToken, refreshToken: refreshToken });
          } else{
            return res.status(400).send({ status: "ERROR", message: 'Invalid username or password' });
          }
        } catch (err){
          console.log(`Error comparing password: ${err}`);
          res.status(500).send({ status: "ERROR", message: 'Error comparing password' });
        }
        
      })
      .catch(err => {
        console.log(`Error finding user ${userEmail}-Error: ${err}`);
        res.status(404).send({ status: "ERROR", message: 'Error finding user' });
      });
}

module.exports = {
    signUp,
    signIn
}