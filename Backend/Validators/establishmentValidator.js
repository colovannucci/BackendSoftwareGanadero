// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const hasRequiredFields = async (establishmentData) => {
    // Check if body has all required fields
    if (
        establishmentData.email &&
        establishmentData.nombreEstablecimiento &&
        establishmentData.nombreProductor &&
        establishmentData.dicoseFisico &&
        establishmentData.rubroPrincipal &&
        establishmentData.cantidadDicosePropiedad &&
        establishmentData.valoresDicosePropiedad
    ) {
        return true;
    }
    return false;
}

const hasCreatableFields = async (establishmentData) => {
    // Specify valid fields
    const validFields = ["email", "nombreEstablecimiento", "nombreProductor", "dicoseFisico", "rubroPrincipal", "cantidadDicosePropiedad", "valoresDicosePropiedad"];
    let isValid= true;
    // Collect all body fields
    Object.keys(establishmentData).forEach(fieldName => {
        // Check if body has not valid fields
        if(!validFields.includes(fieldName)){
            isValid = false;
        }
    });
    return isValid;
}

const hasUpdatableFields = async (establishmentData) => {
    // Specify valid fields
    const updatableFields = ["nombreEstablecimiento", "nombreProductor", "rubroPrincipal"];
    let isValid= true;
    // Collect all body fields
    Object.keys(establishmentData).forEach(fieldName => {
        // Check if body has not valid fields
        if(!updatableFields.includes(fieldName)){
            isValid = false;
        }
    });
    return isValid;
}

const esRubroValido = async (establishmentRubroPrincipal) => {
    // Specify valid fields
    const rubrosValidos = ["Cria", "Recria", "Cria y recria", "Invernada", "Ciclo completo", "Feedlot"];
    // Check if field value is valid
    if(rubrosValidos.includes(establishmentRubroPrincipal)){
        return true;
    }
    return false;
}

module.exports = {
    hasRequiredFields,
    hasCreatableFields,
    hasUpdatableFields,
    esRubroValido
}