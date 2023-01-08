// Use restrictive JS mode to avoid silence errors of the project
'use strict'

// Use moment library to manage dates
const moment = require('moment');

const getStrDateNow = () => {
    return moment().format('DD/MM/YYYY HH:mm:ss');
}

const getStrDateNowFileFormat = () => {
    return moment().format('DDMMYYYYHHmmss');
}

const addDaysDateNow = (daysQty) => {
    return moment().add(daysQty, 'days').format('DD/MM/YYYY HH:mm:ss');
}

const addHoursDateNow = (hoursQty) => {
    return moment().add(hoursQty, 'hours').format('DD/MM/YYYY HH:mm:ss');
}

module.exports = {
    getStrDateNow,
    getStrDateNowFileFormat,
    addDaysDateNow,
    addHoursDateNow
}