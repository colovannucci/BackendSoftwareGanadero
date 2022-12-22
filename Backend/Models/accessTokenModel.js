// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccessTokenSchema = new Schema({
    email: { type: String, unique: true, required: true, lowercase: true }, // "lowercase: true" to make email lowercase
    accessToken: { type: String, unique: true, required: true },
    createdId: { type: String, select: false }, // "select: false" to avoid showing the value in the JSON response
    createdAtTime: { type: String, select: false },
    updatedAtTime: { type: String, select: false },
    expiresAtTime: { type: String }
});

module.exports = mongoose.model('AccessToken', AccessTokenSchema);