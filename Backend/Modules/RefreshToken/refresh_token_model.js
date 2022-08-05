// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshTokenSchema = Schema({
    email: { type: String, unique: true, required: true },
    refreshToken: { type: String, unique: true, required: true},
    createdId: { type: String },
    createdAt: { type: Date },
    expiresAt: { type: Date }
})

// Export model
module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);