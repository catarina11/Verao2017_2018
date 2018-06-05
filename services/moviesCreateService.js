'use strict'
const cinemaPathDB = 'http://127.0.0.1:5984/cinemamoviesdb/'
const req = require('request')
const cinemaMovies = require('./movieService')
module.exports = {
    createMovies
}

function createMovies(cb) {
    cinemaMovies.

    save(cinema, cinemaName, cb)
}

function save(data, id, cb) {
    const options = {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }
    requestToDB(id, options, (err) => {
        if (err) return cb(err)
        cb(null, data)
    })

}

function requestToDB(id, option, cb) {
    let path = cinemaPathDB + id;
    req(path, option, (err, res) => {
        if (err) return cb(err)
        cb(null, JSON.parse(res.body))
    })
}