// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Use environment variables
require('dotenv').config()

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require handleDate
const handleDate = require('../Helpers/handleDate');
// Require multer library
const multer  = require('multer');

const saveAnimalSheet = async (req, res, next) => {
    // Collect temporal route provided by azure app service "C:\\local\\Temp"
    const TEMP = process.env.TEMP;
    // Generate storage instance of multer object
    const storage = multer.diskStorage({
        //destination: './Backend/TemporalFiles',
        destination: function (req, file, cb) {
            cb(null, TEMP )
        },
        filename: function (req, file, cb) {
          cb(null, handleDate.getStrDateNowFileFormat() + "-" + file.originalname )
        }
    });
    // Generate multer instance to upload the files
    const upload = multer({ storage: storage }).single('PlanillaAnimales');

    upload(req, res, next, function (err) {
        if (err instanceof multer.MulterError) {
            // Un error de Multer ocurrió durante la subida.
            const http500 = httpMsgHandler.code500('Un error de Multer ocurrió durante la subida.',err);
            return res.status(http500.code).send(http500);
        } else if (err) {
            // Un error desconocido ocurrió durante la subida.
            const http500 = httpMsgHandler.code500('Un error desconocido ocurrió durante la subida.',err);
            return res.status(http500.code).send(http500);
        }
        // Middleware passed successfully
        next();
    });
}

module.exports = {
    saveAnimalSheet
};