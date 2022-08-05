// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true, lowercase: true }, // "lowercase: true" to make email lowercase
    password: { type: String, required: true }, // "select: false" to avoid showing the password in the JSON response
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone: { type: String, required: true },
    birthDate: { type: String, required: true },
    country: { type: String },
    createdId: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    lastLogin: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);