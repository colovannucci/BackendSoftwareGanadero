// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const excelHasRequiredColumns = async (excelFileData) => {
    // Collect first row as example
    const firstRow = excelFileData[0];
    // Specify requiredColumns
    const requiredColumns = ["Dispositivo", "Raza", "Cruza", "Sexo", "Edad(meses)", "Edad (dias)", "Propietario", "Ubicacion", "Tenedor", "Status de vida", "Status de trazabilidad", "Errores"];
    // Collect all fields and check if the excel file has all required fields
    let isValid= true;
    Object.keys(firstRow).forEach((columnName, index) => {
        // Check if current column is equal to expected column
        if(!(columnName === requiredColumns[index])){
            isValid = false;
        }
    });
    return isValid;
    
}

module.exports = {
    excelHasRequiredColumns
}