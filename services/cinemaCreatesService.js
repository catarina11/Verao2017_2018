'use strict'
const req = require('request')
const cinemaPathDB = 'http://127.0.0.1:5984/cinemadb/'
const cinemaGets = require('./cinemaGetsService')
module.exports = {
    createNewCinema,
    createNewTheater,
    createNewSession
}

function createNewCinema(cinemaName, cinemaCity, cb) {

    let cinema = {
        name: cinemaName,
        city: cinemaCity,
        rooms:{}
    }
    save(cinema, cinemaName, cb)
}

function createNewTheater(cinemaName,theaterName, numbRows, seats,cb) {
    cinemaGets.getCinema(cinemaName, (err, data)=>{
        if (err) return cb(err)
        data.rooms[theaterName] = {
            name: theaterName,
            number: (Object.keys(data.rooms).length+1) + "",
            rows: numbRows,
            seats: seats,
            sessions:[]
        }
        save(data, cinemaName, cb)
    })

}

function createNewSession(cinema, theater, date, hour, movie, id, cb) {
    cinemaGets.getCinema(cinema, (err, data)=>{
        if(err) return cb(err)
        data.rooms[theater].sessions.push(
            {
            date: date,
            hour: hour,
            movie_name: movie,
            movie_id: id,
            }
        )
        save(data, cinema, cb)

    })
}
function save(data, id, cb) {
    const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(data)
    }
    requestToDB(id,options,(err)=>{
        if(err) return cb(err)
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
