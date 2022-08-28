// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema({
    email: { type: String, unique: true, required: true, lowercase: true }, // "lowercase: true" to make email lowercase
    refreshToken: { type: String, unique: true, required: true },
    createdId: { type: String, select: false },
    createdAt: { type: String, select: false },
    expiresAt: { type: String }
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);