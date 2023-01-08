// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Create an instance of fileService
const fileService = require('../Services/fileService');

const animalSheet = async (req, res) => {
    // Send file fields data
    const animalSheetSaved = await fileService.animalSheet(req.file);
    res.status(animalSheetSaved.code).send(animalSheetSaved);
}

const testRoutes = (req, res) => {
    console.log('File Routes connected successfully');
    res.status(200).send('File Routes connected successfully');
}

module.exports = {
    testRoutes,
    animalSheet
}