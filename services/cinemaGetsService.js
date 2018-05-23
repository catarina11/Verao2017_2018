'use strict'
const req = require('request')
const cinemaPathDB = 'http://127.0.0.1:5984/cinemadb/'
module.exports = {
    getAllCinemas,
    getCinema,
    getRoom,
    getSession,
    getBookingTickets
}

function getAllCinemas(cb) {
    requestToDB('_all_docs', 'GET', (err, cin) => {
        if (err) cb(err)
        cb(null, {"results": cin.rows})
    })
}

function getCinema(cinemaName, cb) {
    requestToDB(cinemaName, 'GET', (err, cin) => {
        if (err) cb(err)
        cb(null, cin)
    })
}

function getRoom(cinemaName, theaterName, cb) {
    getCinema(cinemaName, (err, cin) => {
        if (err) cb(err)
        let theater = cin.rooms[theaterName]
        if(!theater) cb(new Error("No theater "+ theaterName))
        else{
            theater.cinemaName=cinemaName
            cb(null, theater)
        }

    })
}

function getSession(cinemaName, theaterName,date,hour, cb) {
    getRoom(cinemaName,theaterName,(err,room)=>{
        if (err) cb(err)
        let session = room.sessions.find(element=> element.date==date && element.hour == hour)
        if(!session)
            cb(new Error(`No session at ${date} ${hour}`))
        else
            session.cinemaName = cinemaName
            session.theaterName = theaterName
            cb(null, session)
    })
}

/************ Booking Tickets *****************/
function getBookingTickets(cinema, theater, date, hour, idMovie, cb) {
    getSession(cinema, theater, date, hour, (err, sessions)=>{

        if(err) cb(err)
        else{
            let books =sessions.booking
            books.cinema = cinema
            books.theater = theater
            books.movie_id = idMovie
            books.date=date
            books.hour=hour
            books.movieName= sessions.movie_name
            cb(null, books)
        }

    })
}

function requestToDB(id, option, cb) {
    let path = cinemaPathDB + id;
    req(path, option, (err, res) => {
        if (err) return cb(err)
        cb(null, JSON.parse(res.body))
    })
}