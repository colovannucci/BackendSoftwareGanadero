// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    name: { type: String, unique: true, required: true },
    price: { type: Number },
    category: { type: String, enum: ['computers', 'phones', 'accesories'] },
    description: String,
    createdId: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date }
})

// Export model
module.exports = mongoose.model('Product', ProductSchema);