'use strict'
const request = require('request')

const CINEMA_DB_USERS = 'http://127.0.0.1:5984/cinemausers/'

module.exports = {
    'find': find,
    'authenticate': authenticate,
    'authenticateUser': authenticateUser,
    'signin': signin,
    'save':save,
}

function find(username, cb) {
    const path = CINEMA_DB_USERS + username
    request(path, (err, res, body) => {
        if(err) return cb(err)
        cb(null, JSON.parse(body))
    })
}

function findStaff(username, cb) {
    const path = CINEMA_DB_USERS + 'Admin/'
    request(path, (err, res, body) => {
        if(err) return cb(err)
        var users =  JSON.parse(body)
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

///added
function authenticateUser(username, passwd, cb) {
    const path = CINEMA_DB_USERS + "Admin"
    request(path, (err, res, body) => {
        if(err) return cb(err)
        if(res.statusCode != 200) return cb(null, null, `User ${username} does not exists`)
       // const urser =body.users
        const allusers = JSON.parse(body)
        allusers.users.forEach(userStaff=>{
            if(userStaff.username==username){
                if(userStaff.password!= passwd) return cb(null, null, 'Invalid password')
            }
        })

        cb(null, allusers)
    })
}

function signin(admin, user, cb) {
    findStaff(user.username,(err, obj) =>{
        var arrayStaff = obj.users
        var idx = 0
        obj.users.forEach(userStaff=>{
            if(userStaff.username == user.username)
                return cb(null, null, `User ${user.username} already exists`)
            else ++idx
            if(obj.users.length==idx)
                arrayStaff.push(user)
        })
        save(obj,cb)
    })
}

function save(user, cb) {
    const path = CINEMA_DB_USERS + 'Admin/'
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