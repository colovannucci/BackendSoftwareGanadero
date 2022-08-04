// Use restrictive JS mode to avoid silence errors of the project
'use strict'

const jwt = require('jsonwebtoken')

function isAuthenticated( req, res, next){
    const authHeader = req.headers['authorization']
    if (authHeader) {
        const userToken = authHeader.split(' ')[1];
        if (userToken == null) return res.status(401).send({ status: "ERROR", message: "Access Token required to authenticate"});

        jwt.verify(userToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            console.log(err);

            if (err) return res.status(403).send({ status: "ERROR", message: 'User not authorized to access' });
            
            req.user = user
            next()
        })
    } else {
        return res.status(400).send({ status: "ERROR", message: "Authorization header required"});
    }
}

module.exports = isAuthenticated;