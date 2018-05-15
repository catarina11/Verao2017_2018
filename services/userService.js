'use strict'
const request = require('request')

const CINEMA_DB_USERS = 'http://127.0.0.1:5984/cinemausers/'

module.exports = {
    'find': find,
    'authenticate': authenticate,
    'signin': signin,
    'save':save
}

function find(username, cb) {
    const path = CINEMA_DB_USERS + username
    request(path, (err, res, body) => {
        if(err) return cb(err)
        cb(null, JSON.parse(body))
    })
}
function authenticate(username, passwd, cb) {
    const path = CINEMA_DB_USERS + username
    request(path, (err, res, body) => {
        if(err) return cb(err)
        if(res.statusCode != 200) return cb(null, null, `User ${username} does not exists`)
        const user = JSON.parse(body)
        if(passwd != user.password) return cb(null, null, 'Invalid password')
        cb(null, user)
    })
}
function signin(user, cb) {
    find(user.username,(err, obj) =>{
        if(obj.username == user.username) return cb(null, null, `User ${user.username} already exists`)
        save(user,cb)
    })
}
function save(user, cb) {
    const path = CINEMA_DB_USERS + user.username
    const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(user)
    }
    request(path, options, (err, res, body) => {
        if(err) return cb(err)
        cb(null,res)
    })
}