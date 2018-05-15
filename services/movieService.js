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
/*obter o titulo do filme*/

module.exports = init

function init(dataSource) {
    const req = dataSource
        ? dataSource
        : require('request')

    return {
        getIDofMovie,
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

    function request(path, cb) {
        limiter.request({url: path, method: 'GET'}, (err, res) => {
            if (err) return cb(err)
            cb(null, JSON.parse(res.body))
        })
    }
}
