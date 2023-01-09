// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Use xlsx library to manage excel files
const xlsx = require('xlsx');
// Importa el submódulo `promises` del módulo de node `file-system`
const fs = require('fs').promises

// generate collect columns in Strings: [ primeras 12 valores que deerminan 12 columnas

const getJsonExcelData = async (filepath) => {
    // Generate an instance of excel file uploaded
    const excelWorkbook = xlsx.readFile(filepath);
    // Collect sheet names of workbook
    const workbookSheets = excelWorkbook.SheetNames;
    // Collect desired sheet of workbook
    const firstSheet = workbookSheets[0];
    // Parse excel sheet data to JSON object
    const excelData = xlsx.utils.sheet_to_json(excelWorkbook.Sheets[firstSheet]);
    console.log('excelData\n', excelData);

    return excelData;
}

const deleteFile = async (filepath) => {
    try {
        // Delete file of given path
        await fs.unlink(filepath)
        return true;
    } catch(err) {
        console.log("deleteFile-Catch Error: ", err);
        return new Error(err.message);
    }
}

module.exports = {
    getJsonExcelData,
    deleteFile
}