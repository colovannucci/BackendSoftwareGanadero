// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Call MongoDB model
const UserDBModel = require('./user_model');

const bcrypt = require('bcrypt')


function getAllUsers (req, res) {
    // Search for products without any query parameters
    UserDBModel.find({})
        .then(usersFound => {
            res.status(200).send({ status: "OK", users: usersFound });
        })
        .catch(err => {
            res.status(500).send({ status: "ERROR", message: 'Error finding all users' });
            console.log(`Error finding all users: ${err}`);
        });
}

function getUser (req, res) {
    const userEmail = req.params.email;

    // Search in users DB by email address
    UserDBModel.find({ email: userEmail })
        .then(userFound => {
            res.status(200).send({ status: "OK", user: userFound });
        })
        .catch(err => {
            res.status(404).send({ status: "ERROR", message: 'Error finding user' });
            console.log(`Error finding user ${userEmail}-Error: ${err}`);
        });
}

function updateUser (req, res) {
    const userEmail = req.params.email;
    const dataToUpdate = req.body;

    // Check if cretedId, createdAt and updatedAt are empty
    if (
        dataToUpdate.createdId ||
        dataToUpdate.createdAt ||
        dataToUpdate.updatedAt
    ) {
        return res.status(400).send({ message: 'Prohibited fields added' });
    }
    // Check if category is valid
    if (dataToUpdate.category && !(validCategories.includes(dataToUpdate.category))) return res.status(404).send({ message: 'Invalid category' });

    // Modify field updatedAt
    dataToUpdate.updatedAt = Date().toLocaleString("en-US", { timezone: "UTC" });

    // Search in users DB by email address and update it
    UserDBModel.updateOne({ email: userEmail }, dataToUpdate)
      .then(res.status(200).send({ status: "OK", message: 'User updated successfully' }))
      .catch(err => {
        res.status(500).send({ status: "ERROR", message: 'Error updating user' });
        console.log(`Error updating user ${userEmail}-Error: ${err}`);
      });
}

function deleteUser (req, res) {
    const userEmail = req.params.email;
    
    // Search in users DB by email address and delete it
    UserDBModel.deleteOne({ email: userEmail })
      .then(res.status(200).send({ status: "OK", message: 'User deleted successfully' }))
      .catch(err => {
        res.status(500).send({ status: "ERROR", message: 'Error deleting user' });
        console.log(`Error deleting user ${userEmail}-Error: ${err}`);
      });
}

async function signUp (req, res) {
  // Collect body fields
  const { body } = req;
  // Check if body is not empty
  if (
      !body.email ||
      !body.password ||
      !body.name ||
      !body.surname ||
      !body.birthDate ||
      !body.phone
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

  // Declare new product object with data received
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
          res.status(500).send({ status: "ERROR", message: 'Error saving new user' });
          console.log(`Error saving new user: ${err.message}`);
      });
  } catch (err) {
    res.status(500).send({ status: "ERROR", message: 'Error hashing password' });
    console.log(`Error hashing password: ${err}`);
  }
}

async function signIn(req, res){
  const userEmail = req.params.email;
  const userPass = req.params.password;

  // Search in users DB by email address
  UserDBModel.find({ email: userEmail })
    .then(async userFound => {
      // Check if password is correct
      try {
        await bcrypt.compare(userPass, userFound.password)
          .then(() => {
            res.status(200).send({ status: "OK", message: 'User signed in successfully' });
          })
          .catch(err => {
            res.status(400).send({ status: "ERROR", message: 'Invalid username or password' });
          });

        /*
        if (await bcrypt.compare(userPass, userFound.password)) {
          res.status(200).send({ status: "OK", message: 'User signed in successfully' });
        } else {
          res.status(400).send({ status: "ERROR", message: 'Invalid username or password' });
        }
        */
      } catch (err){
        res.status(500).send({ status: "ERROR", message: 'Error comparing password' });
        console.log(`Error comparing password: ${err}`);
      }
      
    })
    .catch(err => {
        res.status(404).send({ status: "ERROR", message: 'Error finding user' });
        console.log(`Error finding user ${userEmail}-Error: ${err}`);
    });
}

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    signUp,
    signIn
}