'use strict'
const CinemaObj = require('./../Model/CinemaObj')
const api_key = '30f0dd7f4bfc0d5198885f45d68870f9'
const Ratelimiter = require('request-rate-limiter')
const limiter = new Ratelimiter({
    rate: 40
    ,interval: 10
    ,backofCode: 429
    ,backofTime: 9
    ,maxWaitingTime: 9
});
const movieSearchCache = {}
const moviesInExibitionCache = []
/*obter o titulo do filme*/

module.exports = {
        getIDofMovie,
        getMoviesInExibition
    }

    /*obter as informções do filme a partir do id (chamada à api)
    * verifica se já existe na nossa cache, caso não exista obtemos
    * as informações que queremos do respectivo filme,
    *guardamos na cache (indice do array é o id do filme*/
    function getIDofMovie(id, cb) {
        var movID = id.toString()
        const path = `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`
        if (movieSearchCache[movID])
            cb(null, movieSearchCache[movID])
        else {
            request(path, (error, res) => {
                if (error) return cb(error)
                var movieRes = new CinemaObj.MovieDto(res)
                movieRes.query = id.toString()
                movieSearchCache[id] = movieRes
                cb(null, movieRes)
            })
        }
    }
    
    /*obter os filmes em exibição*/
    function getMoviesInExibition(page, cb) {
        const path = `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&page=${page}`
        var idx=0
      //  for(; idx<moviesInExibitionCache.length; ++idx){
            if (moviesInExibitionCache[idx])
                cb(null, moviesInExibitionCache[idx])
           else {
                request(path, (error, res) => {
                    if (error) return cb(error)
                    var movieRes = new CinemaObj.MovieExibitionDTO(res)
                    if(res.page>1) movieRes.previousPage = 1
                    if(res.page<res.total_pages) movieRes.nextPage = res.page +1
                    moviesInExibitionCache[moviesInExibitionCache.length + 1] = movieRes
                    cb(null, movieRes)
                })
            }
        //}

    }

    function request(path, cb) {
        limiter.request({url: path, method: 'GET'}, (err, res) => {
            if (err) return cb(err)
            cb(null, JSON.parse(res.body))
        })
    }

