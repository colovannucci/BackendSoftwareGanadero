// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema({
    email: { type: String, unique: true, required: true, lowercase: true }, // "lowercase: true" to make email lowercase
    refreshToken: { type: String, unique: true, required: true }, // "unique: true" to create an unique index of the field
    createdId: { type: String, select: false }, // "select: false" to avoid showing the value in the JSON response
    createdAtTime: { type: String, select: false },
    updatedAtTime: { type: String, select: false },
    expiresAtTime: { type: String }
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);