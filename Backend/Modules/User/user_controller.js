// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Call MongoDB model
const UserDBModel = require('./user_model');

const refreshTokenController = require('../RefreshToken/refresh_token_controller');

function getAllUsers (req, res) {
    // Search for products without any query parameters
    UserDBModel.find({})
        .then(usersFound => {
          if (!usersFound) return res.status(500).send({ status: "ERROR", message: 'There are no products' });

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
    UserDBModel.findOne({ email: userEmail })
        .then(userFound => {
          if (!userFound) return res.status(404).send({ status: "ERROR", message: 'User not found' }); 
          
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
      .then(userFound => {
        // If user doesn't exist
        if (!userFound) return res.status(404).send({ status: "ERROR", message: 'User not found' });

        res.status(200).send({ status: "OK", message: 'User updated successfully' });
      })
      .catch(err => {
        res.status(500).send({ status: "ERROR", message: 'Error updating user' });
        console.log(`Error updating user ${userEmail}-Error: ${err}`);
      });
}

function deleteUser (req, res) {
    const userEmail = req.params.email;
    
    // Search in users DB by email address and delete it
    UserDBModel.deleteOne({ email: userEmail })
      .then(userFound => {
        // If user doesn't exist
        if (!userFound) return res.status(404).send({ status: "ERROR", message: 'User not found' });

        res.status(200).send({ status: "OK", message: 'User deleted successfully' })
      })
      .catch(err => {
        res.status(500).send({ status: "ERROR", message: 'Error deleting user' });
        console.log(`Error deleting user ${userEmail}-Error: ${err}`);
      });
}

function signOut(req, res){
  const userEmail = req.params.email;

  const refreshTokenDeleted = refreshTokenController.deleteRefreshToken(userEmail);
  // Check if it was deleted
  if (refreshTokenDeleted === false) return res.status(500).send({ status: "ERROR", message: 'Signed out failed' });

  res.status(200).send({ status: "OK", message: 'User signed out successfully' });
}

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    signOut
}