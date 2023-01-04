// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const hasRequiredFields = async (animalData) => {
    // Check if body has all required fields
    if (
        animalData.email &&
        animalData.numeroCaravana &&
        animalData.raza &&
        animalData.cruza &&
        animalData.sexo &&
        animalData.edadMeses &&
        animalData.edadDias &&
        animalData.dicosePropietario &&
        animalData.dicoseUbicacion &&
        animalData.dicoseTenedor &&
        animalData.statusVida &&
        animalData.statusTrazabilidad
    ) {
        return true;
    }
    return false;
}

const hasCreatableFields = async (animalData) => {
    // Specify creatableFields
    const creatableFields = ["email", "numeroCaravana", "raza", "cruza", "sexo", "edadMeses", "edadDias", "dicosePropietario", "dicoseUbicacion", "dicoseTenedor", "statusVida", "statusTrazabilidad"];
    let isValid= true;
    // Collect all body fields
    Object.keys(animalData).forEach(fieldName => {
        // Check if body has not creatableFields
        if(!creatableFields.includes(fieldName)){
            isValid = false;
        }
    });
    return isValid;
}

const hasUpdatableFields = async (animalData) => {
    // Specify updatableFields
    const updatableFields = ["edadMeses", "edadDias", "dicosePropietario", "dicoseUbicacion", "dicoseTenedor", "statusVida", "statusTrazabilidad"];
    let isValid= true;
    // Collect all body fields
    Object.keys(animalData).forEach(fieldName => {
        // Check if body has not updatableFields
        if(!updatableFields.includes(fieldName)){
            isValid = false;
        }
    });
    return isValid;
}

const esSexoValido = async (animalSexo) => {
    // Specify sexosValidos
    const sexosValidos = ["Hembra", "Macho"];
    // Check if field value is valid
    if(sexosValidos.includes(animalSexo)){
        return true;
    }
    return false;
}

const esStatusVidaValido = async (animalStatusVida) => {
    // Specify statusVidaValidos
    const statusVidaValidos = ["Vivo", "Muerto", "Faenado", "No aplica"];
    // Check if field value is valid
    if(statusVidaValidos.includes(animalStatusVida)){
        return true;
    }
    return false;
}

const esStatusTrazabilidadValido = async (animalStatusTrazabilidad) => {
    // Specify statusTrazabilidadValidos
    const statusTrazabilidadValidos = ["Trazado", "No Trazado", "Observado"];
    // Check if field value is valid
    if(statusTrazabilidadValidos.includes(animalStatusTrazabilidad)){
        return true;
    }
    return false;
}

module.exports = {
    hasRequiredFields,
    hasCreatableFields,
    hasUpdatableFields,
    esSexoValido,
    esStatusVidaValido,
    esStatusTrazabilidadValido
}