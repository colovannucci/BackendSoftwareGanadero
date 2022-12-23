// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');

const isApplicationJson = async (req, res, next) => {
    // Collect Content-Type header value
    const contentTypeHeaderValue = req.get('Content-Type');
    // Check if Content-Type header is setted as application/json
    if (contentTypeHeaderValue != 'application/json'){
    //if (!contentTypeHeaderValue.equals('application/json')){
        const http415 = httpMsgHandler.code415('Content-Type Header must have application json value');
        return res.status(http415.code).send(http415);
    }
    // Middleware passed successfully
    next();
}

module.exports = {
    isApplicationJson
};


