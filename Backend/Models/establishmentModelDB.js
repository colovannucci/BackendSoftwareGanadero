// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EstablishmentSchema = new Schema({
    idUsuario: { type: String, required: true, lowercase: true }, // "lowercase: true" to make email lowercase
    nombreEstablecimiento: { type: String, required: true },
    nombreProductor: { type: String, required: true },
    dicoseFisico: { type: String, unique: true, required: true }, // "unique: true" to create an unique index of the field
    rubroPrincipal: { type: String, required: true },
    cantidadDicosePropiedad: { type: String, required: true },
    valoresDicosePropiedad: { type : Array, of : String , required: true },
    createdId: { type: String, select: false }, // "select: false" to avoid showing the value in the JSON response
    createdAtTime: { type: String, select: false },
    updatedAtTime: { type: String, select: false }
});

module.exports = mongoose.model('Establishment', EstablishmentSchema);