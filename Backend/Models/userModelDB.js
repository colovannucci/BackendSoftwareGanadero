// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true, lowercase: true }, // "lowercase: true" to make email lowercase
    name: { type: String, required: true },
    password: { type: String, required: true, select: false }, // "select: false" to avoid showing the value in the JSON response
    createdId: { type: String, select: false },
    createdAtTime: { type: String, select: false },
    updatedAtTime: { type: String, select: false },
    lastLoginTime: { type: String, select: false },
    lastLogoutTime: { type: String, select: false },
    isBlocked: { type: Boolean, select: false },
    lastBlockedTime: { type: String, select: false },
    lastUnblockedTime: { type: String, select: false }
});

module.exports = mongoose.model('User', UserSchema);