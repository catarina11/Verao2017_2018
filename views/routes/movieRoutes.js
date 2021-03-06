const fs = require("fs");
const hbs = require('hbs')
//const contents = fs.readFileSync("../public/cinemaDB_tests.json");
// Define to JSON type
const contents = fs.readFileSync("../public/cinemaDB_tests.json");
const jsonContent = JSON.parse(contents);
const CinemaObj = require('./../Model/CinemaObj')

const express = require('express')
const router = express.Router()
const movie = require('../services/movieService')

module.exports = router

router.get('/:movie_id', (req, resp, next)=>{
    movie.getIDofMovie(req.params.movie_id, (err, data)=>{
        if(err) return next(err)
        if(req.user!=undefined)
            resp.render('movieView', {cinemas: data, menuState:{user: req.user.username}})
        else
            resp.render('movieView', {cinemas: data})
    })
})

router.get('/allMovies/inExibitionTheaters', (req, resp, next)=>{
    movie.getMoviesInExibition(req.query.page,(err, data)=>{
        if(err) return next(err)
        resp.render('movieInExibitionView', data)
    })
})



