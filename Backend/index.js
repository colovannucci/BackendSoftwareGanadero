// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require to collect DB configuration
const dbConfig = require('./dbConfig');
dbConfig.connectDB();

// Require to collect application configuration
const application = require('./application');
application.mainStart();