'use strict'
const req = require('request')
const cinemaGets = require('./cinemaGetsService')
const cinemaPathDB = 'http://127.0.0.1:5984/cinemadb/'

module.exports ={
        replaceNameRoom,
        editValueOfRow,
        editValueOfSeats,
        editDate,
        editHour,
        editMovieIdAndMovieName,

}


function replaceNameRoom(cinName, newRoomName, oldRoomName, cb) {
    cinemaGets.getCinema(cinName, (error, data)=>{
        if(error) cb(error)
        data.rooms[oldRoomName].name=newRoomName //give new name
        var aux = data.rooms[oldRoomName]
        data.rooms[oldRoomName] = data.rooms[newRoomName] //create new object with new name
        data.rooms[newRoomName] = aux //copy object old

        if(data.rooms==oldRoomName) //eliminate object
            delete data.rooms.oldRoomName

        save(data, cinName, cb)

    })
}

function editValueOfRow(newRowValue, cinName, roomName, roomNumb, cb) {
   cinemaGets.getCinema(cinName, (error, data)=>{
       if(error) cb(error)
       data.rooms[roomName].rows = newRowValue
       save(data, cinName, cb)
   })

}

function editValueOfSeats(newSeatsPerRow, cinName, roomName, roomNumb, cb) {
    cinemaGets.getCinema(cinName, (error, data)=>{
        if(error) cb(error)
        data.rooms[roomName].seats = newSeatsPerRow
        save(data, cinName, cb)
    })
}

function editDate(newDate, cinName, roomName, date, movieId, cb) {
    cinemaGets.getCinema(cinName, (error, data)=>{
        if(error) cb(error)
        data.rooms[roomName].sessions.forEach(movie =>{
            if(movie.movie_id == movieId){
                movie.date = newDate
            }
        })
        save(data, cinName, cb)
    })
}

function editHour(newHour, cinName, roomName, hour, movieId, cb) {
    cinemaGets.getCinema(cinName, (error, data)=>{
        if(error) cb(error)
        data.rooms[roomName].sessions.forEach(movie =>{
            if(movie.movie_id == movieId){
                movie.hour = newHour
            }
        })
        save(data, cinName, cb)
    })
}

function editMovieIdAndMovieName(newName, newId, cinName, roomName, movieName, idMovie, cb) {
    cinemaGets.getCinema(cinName, (error, data)=>{
        if(error) cb(error)
        data.rooms[roomName].sessions.forEach(movie =>{
            if(movie.movie_id == idMovie){
                movie.movie_id = newId
                movie.movie_name = newName
            }
        })
        save(data, cinName, cb)
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
