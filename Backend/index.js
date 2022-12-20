// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Require to collect DB configuration
const connectDB = require('./dbConfig');
connectDB();

// Require dotenv for environment variables
require('dotenv').config();
const PORT = process.env.PORT;

// Require to collect application configuration
const app = require('./application');
async function main() {
    // Web server connection
    await app.listen(PORT, () => { console.log(`Web server listening on port ${PORT}`) });
}

main();