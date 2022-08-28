// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true, lowercase: true }, // "lowercase: true" to make email lowercase
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone: { type: String, required: true },
    birthDate: { type: String, required: true },
    country: { type: String, required: true },
    password: { type: String, required: true, select: false }, // "select: false" to avoid showing the password in the JSON response
    createdId: { type: String, select: false },
    createdAt: { type: String, select: false },
    updatedAt: { type: String, select: false },
    lastLogin: { type: String, select: false },
    lastLogout: { type: String, select: false }
});

module.exports = mongoose.model('User', UserSchema);