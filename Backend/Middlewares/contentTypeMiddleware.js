// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require handler http messages
const httpMsgHandler = require('../Helpers/handleHttpMessage');

const hasContentTypeHeader = async (req, res, next) => {
    // Collect Content-Type header value
    const contentTypeHeaderValue = req.get('Content-Type');
    // Check if Content-Type header was provided
    if (!contentTypeHeaderValue) {
        const http400 = httpMsgHandler.code400('Content-Type Header required');
        return res.status(http400.code).send(http400);
    }
    // Middleware passed successfully
    next();
}

const isApplicationJson = async (req, res, next) => {
    // Collect Content-Type header value
    const contentTypeHeaderValue = req.get('Content-Type');
    // Check if Content-Type header is setted as application/json
    if (contentTypeHeaderValue != 'application/json'){
        const http415 = httpMsgHandler.code415('Content-Type Header must have application json value');
        return res.status(http415.code).send(http415);
    }
    // Middleware passed successfully
    next();
}

const isMultipartFormData = async (req, res, next) => {
    // Collect Content-Type header value
    const contentTypeHeaderValue = req.get('Content-Type');
    // Collect falue from header because it normally is 'multipart/form-data; boundary=???'
    const contentTypeValue = contentTypeHeaderValue.split(';')[0];
    // Check if Content-Type header is setted as application/json
    if (contentTypeValue != 'multipart/form-data'){
        const http415 = httpMsgHandler.code415('Content-Type Header must have multipart form data value');
        return res.status(http415.code).send(http415);
    }
    // Middleware passed successfully
    next();
}

module.exports = {
    hasContentTypeHeader,
    isApplicationJson,
    isMultipartFormData
};


