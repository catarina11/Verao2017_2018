const fs = require("fs");
const hbs = require('hbs')
//const contents = fs.readFileSync("../public/cinemaDB_tests.json");
// Define to JSON type
const contents = fs.readFileSync("../public/cinemaDB_tests.json");
const jsonContent = JSON.parse(contents);
const CinemaObj = require('./../Model/CinemaObj')

const movieDBService = require('../services/movieservice')
const express = require('express')
const router = express.Router()
const cin = require('../services/cinemaGetsService')
const cinemaCreates = require('../services/cinemaCreatesService')
const cinemaDeletes = require('../services/cinemaDeletesServices')
const cinemaEdits = require('../services/cinemaEditsService')

module.exports = router

/************************************GETS************************************/



router.get('/', (req, resp, next)=>{
    cin.getAllCinemas((err, data)=>{
        if(err) return next(err)
        resp.render('cinemaListView', data)
    })
})

router.get('/:name', (req, resp, next)=>{
    cin.getCinema(req.params.name, (err, data)=>{
        if(err) return next(err)
        resp.render('cinemaView', data)
    })
})

router.get('/:name/:theater', (req, resp, next)=>{
    cin.getRoom(req.params.name, req.params.theater, (err, data)=>{
        if(err) return next(err)
        resp.render('cinemaRoomView', data)
    })
})

router.get('/:name/:theater/session', (req, resp, next)=>{
    cin.getSession(req.params.name, req.params.theater, req.query.date, req.query.hour, (err,data)=>{
        if(err) return next(err)
        resp.render('cinemaSessionMovieName', data)
    })
})

/************************************POSTS************************************/
const cinema = hbs.compile(fs
    .readFileSync('../views/partials/cinema.hbs')
    .toString())

router.post('/', (req, resp, next)=>{
    cinemaCreates.createNewCinema(req.body.name, req.body.city, (err,data)=>{
        if(err) return resp.status(503)
        //resp.redirect('/cinemas')
        resp.status(200).send(cinema(data))
    })
})

router.post('/:name', (req, resp, next)=>{
    cinemaCreates.createNewTheater(req.body.name, req.body.theaterName, req.body.numbOfRows, req.body.seats, (err, data)=>{
        if(err) return next(err)
        resp.redirect('/cinemas/'+data.name)
    })
})


router.post('/:id/delete', (req, resp, next)=>{
    cinemaDeletes.removeCinema(req.params.id, (err, data)=>{
        if(err) return next(err)
        resp.status(200).send(req.params.id)
        // /resp.redirect('/cinemas')
    })
})

// createNewSession(cinema, theater, date, hour, movie, id, cb)
router.post('/:cinemaName/:name', (req, resp, next)=>{
    cinemaCreates.createNewSession(req.params.cinemaName, req.params.name,
        req.body.date, req.body.hour, req.body.movie, req.body.id, (err, data)=>{
            if(err) return next(err)
            resp.redirect('/cinemas/'+ req.params.cinemaName + "/" + req.params.name)
        })
})

router.post('/:cinemaName/:name/delete',(req, resp, next)=>{
    cinemaDeletes.removeTheater(req.body.cinemaName, req.body.roomName,(err, data)=>{
        if(err) return next(err)
        resp.redirect('/cinemas/' + data.name)
    })
})

router.post('/:cinemaName/:roomName/:movie_id/delete', (req, resp, next)=>{
    cinemaDeletes.removeSessionByNameOfMovie(req.body.cinName, req.body.roomName,
        req.body.numberRoom, req.body.cinemaSessionMovieID, (err, data)=>{
            if(err) return next(err)
            resp.redirect('/cinemas/' + req.body.cinName +'/' + req.body.roomName)
    })
})
router.post('/:name/edit', (req, resp, next)=>{
    cinemaEdits.replaceCinema(req.body.newName, req.body.newCity, req.body.name, (err, data)=>{
        if(err) return next(err)
        resp.redirect('/cinemas')
    })
})

router.post('/:cinemaName/:name/editTheater', (req, resp, next)=>{
    cinemaEdits.replaceNameRoom(req.body.cinemaName, req.body.newName,
        req.body.oldRoomName, (err, data)=>{
        if(err) return next(err)
        resp.redirect('/cinemas/' + data.name)
    })
})

router.post('/:cinemaName/:name/:number_room/editNumberOfRows',(req, resp, next)=> {
    cinemaEdits.editValueOfRow(req.body.newNumbRow,req.body.cinName, req.body.roomName,
        req.body.roomNumb, (err, data) => {
            if (err) return next(err)
            resp.redirect('/cinemas/' +req.body.cinName + '/' + req.body.roomName)
        })
})

router.post('/:cinemaName/:name/:number_room/editSeats',(req, resp, next)=> {
    cinemaEdits.editValueOfSeats(req.body.newValSeats,req.body.cinName, req.body.roomName,
        req.body.roomNumb, (err, data) => {
            if (err) return next(err)
            resp.redirect('/cinemas/' + req.body.cinName + '/' + req.body.roomName)
        })
})

router.post('/:cinemaName/:theaterName/:date/:movie_id/editDate', (req, resp, next)=>{
    cinemaEdits.editDate(req.body.newDate, req.body.cinName,
        req.body.roomName, req.body.date, req.body.movieID,(err,data)=>{
            if (err) return next(err)
            resp.redirect('/cinemas/' + req.body.cinName + '/' + req.body.roomName +
                '/session?date=' + req.body.newDate + "&hour="+ req.body.hour)
    })
})

router.post('/:cinemaName/:theaterName/:hour/:movie_id/editHour', (req, resp, next)=>{
    cinemaEdits.editHour(req.body.newHour, req.body.cinName,
        req.body.roomName, req.body.hour, req.body.movieID,(err,data)=>{
            if (err) return next(err)
            resp.redirect('/cinemas/' + req.body.cinName + '/' + req.body.roomName +
                '/session?date=' + req.body.date + "&hour="+ req.body.newHour)
        })
})

router.post('/:cinemaName/:roomName/:movie_name/:movie_id/editIdAndTiTleMovie', (req, resp, next)=>{
    cinemaEdits.editMovieIdAndMovieName(req.body.newNameMovie, req.body.newIdMovie, req.body.cinName,
        req.body.roomName, req.body.movieName, req.body.movieID,(err,data)=>{
            if (err) return next(err)
            resp.redirect('/cinemas/' + req.body.cinName + '/' + req.body.roomName +
                '/session?date=' + req.body.date + "&hour="+ req.body.hour)
        })
})