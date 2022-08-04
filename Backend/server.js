require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

// COMPLETO AUTHENTICATION_MIDDLEWARE
const authenticationMiddleware = require('./Middlewares/authentication_middleware');


app.use(express.json())

const posts = [
  {
    username: 'Kyle',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  }
]

app.get('/posts', authenticationMiddleware, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    if (authHeader) {
        const userToken = authHeader.split(' ')[1];
        if (userToken == null) return res.status(401).send({ status: "ERROR", message: "Token required to authenticate"});

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

// without token
app.get('/getPosts', (req, res) => {
    res.json(posts);
})

app.listen(3000);
console.log('Server listening on port 3000');