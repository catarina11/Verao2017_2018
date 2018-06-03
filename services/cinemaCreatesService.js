'use strict'
const req = require('request')
const cinemaPathDB = 'http://127.0.0.1:5984/cinemadb/'
const cinemaGets = require('./cinemaGetsService')
module.exports = {
    createNewCinema,
    createNewTheater,
    createNewSession,
    createBookingTickets,
    reservedTickets
}

function createNewCinema(cinemaName, cinemaCity, cb) {

    let cinema = {
        name: cinemaName,
        city: cinemaCity,
        rooms: {}
    }
    save(cinema, cinemaName, cb)
}

function createNewTheater(cinemaName, theaterName, numbRows, seats, cb) {
    cinemaGets.getCinema(cinemaName, (err, data) => {
        if (err) return cb(err)
        data.rooms[theaterName] = {
            name: theaterName,
            number: (Object.keys(data.rooms).length + 1) + "",
            rows: numbRows,
            seats: seats,
            sessions: []
        }
        save(data, cinemaName, cb)
    })

}

function createNewSession(cinema, theater, date, hour, movie, id, cb) {
    cinemaGets.getCinema(cinema, (err, data) => {
        if (err) return cb(err)
        data.rooms[theater].sessions.push(
            {
                date: date,
                hour: hour,
                movie_name: movie,
                movie_id: id,
                booking: {}
            }
        )
        save(data, cinema, cb)

    })
}

function createBookingTickets(cinema, theater, date, hour, id, cb) {
    cinemaGets.getCinema(cinema, (err, data) => {
        if (err) return cb(err)
        else {
            let idxofSessionMovieByID = findSessionByIdMovie(data.rooms[theater].sessions, date, hour, id)
            let objectBooking = data.rooms[theater].sessions[idxofSessionMovieByID].booking
            //prepare values to Object Booking
            let placesAvailable = data.rooms[theater].rows * data.rooms[theater].seats
            let sizeMaxOfRow = "A".charCodeAt(0) + parseInt(data.rooms[theater].rows) //dá me o maximo de colunas A a 'x'
            let codeCharMaxRowToCHAR = String.fromCharCode(sizeMaxOfRow); //transforma o valor do char em char o code,int
            let sizeMaxOfLine = parseInt(data.rooms[theater].seats)

            let map = [[]]
            map = doMappingTicketsAvailable(placesAvailable, sizeMaxOfRow, codeCharMaxRowToCHAR, sizeMaxOfLine)

            //create Object Booking
            if (Object.keys(objectBooking).length == 0) {
                data.rooms[theater].sessions[idxofSessionMovieByID].booking.mappingTickets = map
            }

        }
        save(data, cinema, cb)
    })

}


function reservedTickets(cinema, theater, date, hour, id, client, email, phone, seats, cb) {

    cinemaGets.getCinema(cinema, (err, data) => {
        var seatsAux = seats.replace('[', '').replace(']', '').replace(',', '')
        var string= seatsAux.split('\"').join('');
        var str = string.match(/.{2}/g)


        if (err) return cb(err)
        else {
            let idxofSessionMovieByID = findSessionByIdMovie(data.rooms[theater].sessions, date, hour, id)
            let objectBooking = data.rooms[theater].sessions[idxofSessionMovieByID].booking.mappingTickets
            let i = 0, k = 0

            objectBooking.forEach(r => {
                var rows = r["rows"]
                rows.forEach(array=>{
                    var seat = str[k]
                    if (array.name == str[k]) {
                        array.client = client
                        array.email = email
                        array.phone = phone
                        array.reserved = 1
                        ++k
                    }
                    if (k == str.length){
                        k = 0
                    }

                })

            })

            save(data, cinema, cb)
        }
    })
}

function findSessionByIdMovie(sess, date, hour, id) {
    var idx = 0
    for (; sess.length; ++idx) {
        if (sess[idx].movie_id == id && sess[idx].date == date && sess[idx].hour == hour)
            break
    }
    return idx

}

function doMappingTicketsAvailable(placesAvailable, sizeMaxOfRow, codeCharMaxRowToCHAR, sizeMaxOfLine) {
    var map = []
    var letter = null
    let idx1 = 0, idx2 = 0
    let i = "A".charCodeAt(0), y = 0
    for (; i < sizeMaxOfRow; i++, ++idx1) {
        var obj = {rows: []}
        y = 0
        idx2 = 0
        for (; y < sizeMaxOfLine; ++y, ++idx2) {
            letter = String.fromCharCode(i) + y.toString(); //e.g.:A0..A5, B0..B5
            obj.rows[idx2] = {
                name: letter,
                reserved: 0,
                client: null,
                email: null,
                phone: null
            }

        }
        map.push(obj)
    }
    return map
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
