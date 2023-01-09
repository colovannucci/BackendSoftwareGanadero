// Use restrictive JS mode to avoid silence errors of the project
'use strict';

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');
// Require handleFile
const fileHandler = require('../Helpers/handleFile');
// Require fileValidator functions
const fileValidator = require('../Validators/fileValidator');
// Create an instance of fileDAL (data access layer)
//const fileDAL = require('../DataAccess/fileDAL');

const animalSheet = async (fileData) => {
    // Collect filePath of file
    let filePath = "";
    // Collect originalname of file to show
    let fileName = "";
    try {
        // Collect filePath of file
        filePath = fileData.path;
        // Collect originalname of file to show
        fileName = fileData.originalname;
    }
    catch (err) {
        return httpMsgHandler.code400('Error reading file sent. Please select it and send it again');
    }
    // Generate JSON representation of excel file
    const JsonExcelData = await fileHandler.getJsonExcelData(filePath);
    /*
    // Delete temporal file created
    const fileDeleted = await fileHandler.deleteFile(filePath);
    if (fileDeleted instanceof Error) {
        return httpMsgHandler.code500('Error deleting File', fileDeleted.message);
    }
    */
    //console.log('JsonExcelData', JsonExcelData);

    // Check if body has all required columns
    const excelHasRequiredColumns = await fileValidator.excelHasRequiredColumns(JsonExcelData);
    if (!excelHasRequiredColumns) {
        return httpMsgHandler.code400("Missing columns on sheet");
    }

    /*
    // Loop through all the rows in the file
    for (const excelRow of JsonExcelData) {
        console.log('ExcelRow', excelRow);
    }
    */
    

    return httpMsgHandler.code200('File '+fileName+' saved successfully', JsonExcelData);
    /*
    // Check if body has only valid fields
    const hasCreatableFields = await fileValidator.hasCreatableFields(fileData);
    if (!hasCreatableFields) {
        return httpMsgHandler.code400("Invalid fields added on body");
    }

    // Check if rubroPrincipal value is valid
    const esRubroValido = await fileValidator.esRubroValido(fileData.rubroPrincipal);
    if (!esRubroValido){
        return httpMsgHandler.code400("Rubro Principal is not valid");
    }
    */

    /*
    // Save file in database
    const fileCreated = await fileDAL.animalSheet(fileData);
    if (fileCreated instanceof Error) {
        return httpMsgHandler.code500('Error creating File', fileCreated.message);
    }
    */
    // Create an object to show file found
    const fileDataValues = {
        file: fileCreated
    };

    return httpMsgHandler.code201('File created successfully', fileDataValues);
}


module.exports = {
    animalSheet
}