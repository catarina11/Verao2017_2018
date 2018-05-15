const express = require('express')
const useRouter = express.Router()
const userService = require('../services/userService')
const passport = require('passport')

module.exports = useRouter
useRouter.get('/', (req, res) => {
    const ctx = {}
    const msg = req.flash('loginError')
    if(msg)  ctx.loginError = {message: msg}
    res.render('signInUp',ctx)
})

useRouter.post('/login', (req, res, next) => {
    userService.authenticate(req.body.username, req.body.password, (err, user, info) => {
        if(err) return next(err)
        if(info){
            req.flash('loginError', info)
            return res.redirect('/login')
        }
        req.logIn(user, (err) => {
            if(err) return next(err)
            res.redirect('/')
        })
    })
})



useRouter.post('/register', (req, res, next) => {
    let user = {
        'username': req.body.username,
        'password': req.body.password,
    }
    if(user.password == '' || user.username == '')
        next(new Error('Invalid Credentials'))
    else
        userService.signin(user, (err, user, info) => {
            if (err) return next(err)
            if (info) return next(new Error(info))
            userService.authenticate( req.body.username, req.body.password, (err, user, info) => {
                if(err) return next(err)
                if(info){
                    req.flash('loginError', info)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) return next(err)
                    res.redirect('/')
                })
            })
        })
})

passport.serializeUser(function(user, cb) {
    cb(null, user.username)
})

passport.deserializeUser(function(username, cb) {
    userService.find(username, cb)
})