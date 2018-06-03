'use strict'
const req = require('request')
const cinemaGets = require('./cinemaGetsService')
const cinemaPathDB = 'http://127.0.0.1:5984/cinemadb/'
module.exports = {
    removeCinema,
    removeTheater,
    removeSessionByNameOfMovie
}
//TODO
function removeCinema(name, cb) {
    cinemaGets.getCinema(name, (error, data)=>{
        if(error) return cb(err)
        else{
            let _rev = data._rev
            remove(name, _rev, cb)
        }
    })
}


function removeTheater(cinName, roomName, cb) {
    cinemaGets.getCinema(cinName, (error, data)=>{
        if(error) cb(error)
        else{
            var allRooms = data.rooms
            for (var prop in allRooms) {
                if(prop==roomName){
                    delete allRooms[roomName]
                    break
                }

            }
            data.rooms = allRooms
            save(data, cinName, cb)
        }

    })
}

function removeSessionByNameOfMovie(cinemaName, roomName, numbRoom, sessionMovieId, cb) {
    var allSessions = null
    var idx = 0
    cinemaGets.getCinema(cinemaName, (error, data)=>{
        if(error) cb(error)
        else{
            allSessions = data.rooms[roomName].sessions
            allSessions.forEach(movie=>{
                if(movie.movie_id==sessionMovieId){
                    allSessions.splice(idx, 1)
                }
                else ++idx
            })
            data.rooms[roomName].sessions = allSessions
            save(data, cinemaName, cb)
        }
    })
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

function remove(id, rev, cb) {
    const options = {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
    }
    requestToDB(id, options, (err) => {
        if (err) return cb(err)
        cb(null)
    }, rev)

}

function requestToDB(id, option, cb, rev) {
    let path = cinemaPathDB + id
    path = rev!=undefined ? path + "?rev=" + rev : path ;
    req(path, option, (err, res) => {
        if (err) return cb(err)
        cb(null, JSON.parse(res.body))
    })
}





