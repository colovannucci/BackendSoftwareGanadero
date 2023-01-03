// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnimalSchema = new Schema({
    email: { type: String, required: true, lowercase: true }, // "lowercase: true" to make email lowercase
    numeroCaravana: { type: String, unique: true, required: true }, // "unique: true" to create an unique index of the field
    raza: { type: String, required: true },
    cruza: { type: String, required: true },
    sexo: { type: String, required: true },
    edadMeses: { type: String, required: true },
    edadDias: { type: String, required: true },
    dicosePropietario: { type: String, required: true },
    dicoseUbicacion: { type: String, required: true },
    dicoseTenedor: { type: String, required: true },
    statusVida: { type: String, required: true },
    statusTrazabilidad: { type: String, required: true },
    pesoActual: { type: String, required: true },
    disponibleVenta: { type: Boolean, required: true },
    createdId: { type: String, select: false }, // "select: false" to avoid showing the value in the JSON response
    createdAtTime: { type: String, select: false },
    updatedAtTime: { type: String, select: false }
});

module.exports = mongoose.model('Animal', AnimalSchema);