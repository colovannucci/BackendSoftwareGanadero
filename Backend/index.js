// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require to collect DB configuration
const connectDB = require('./dbConfig');
await connectDB();

// Require to collect application configuration
const mainStart = require('./application');
await mainStart();