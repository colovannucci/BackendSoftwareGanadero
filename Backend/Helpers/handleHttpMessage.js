// Use restrictive JS mode to avoid silence errors of the project
'use strict';

const code500 = (msg, errMsg) => {
    
    return { code: 500, status: "Internal Server Error", message: msg, error: errMsg };
}

const code503 = (msg) => {
    
    return { code: 503, status: "Service Unavailable", message: msg};
}

const code400 = (msg) => {
    
    return { code: 400, status: "Bad Request", message: msg};
}

const code401 = (msg) => {
    
    return { code: 401, status: "Unauthorized", message: msg};
}

const code403 = (msg) => {
    
    return { code: 403, status: "Forbidden", message: msg};
}

const code404 = (msg) => {
    
    return { code: 404, status: "Not Found", message: msg};
}

const code415 = (msg) => {
    
    return { code: 415, status: "Unsupported Media Type", message: msg};
}

const code200 = (msg, data) => {
    
    return { code: 200, status: "OK", message: msg, data: data};
}

const code201 = (msg, data) => {
    
    return { code: 201, status: "Created", message: msg, data: data};
}

module.exports = {
    code500,
    code503,
    code400,
    code401,
    code403,
    code404,
    code415,
    code200,
    code201
}
