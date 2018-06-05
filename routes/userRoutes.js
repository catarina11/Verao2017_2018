const express = require('express')
const useRouter = express.Router()
const userService = require('../services/userService')
const passport = require('passport')

module.exports = useRouter
useRouter.get('/login', (req, res) => {
    const ctx = {}
    const msg = req.flash('loginError')
    if(msg)  ctx.loginError = {message: msg}
    res.render('signInUpAdmin',ctx)
})

useRouter.get('/Admin/LoginStaff', (req, res) => {
    const ctx = {}
    const msg = req.flash('loginError')
    if(msg)  ctx.loginError = {message: msg}
    res.render('signInUpStaff',ctx)
})
useRouter.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})

useRouter.post('/login', (req, res, next)=>{
    userService.authenticate(req.body.username, req.body.password, (err, user, info) => {
        if(err) return next(err)
        if(info){
            req.flash('loginError', info)
            return res.redirect('/login')
        }
        req.logIn(user, (err) => {
            if(err) return next(err)
            res.redirect('/Admin/LoginStaff')
        })
    })
})


useRouter.post('/loginStaff', (req, res, next) => {
    userService.authenticateUser(req.body.username, req.body.password, (err, user, info) => {
        if(err) return next(err)
        if(info){
            req.flash('loginError', info)
            return res.redirect('/Admin/LoginStaff')
        }
        req.logIn(user, (err) => {
            if(err) return next(err)
            res.render('principalView', { menuState:{user: req.user.username}})
        })
    })
})

useRouter.post('/registerStaff', (req, res, next) => {
    let user = {
        'username': req.body.username,
        'password': req.body.password,
    }
    if(user.password == '' || user.username == '')
        next(new Error('Invalid Credentials'))
    else
        userService.signin("Admin",user, (err, user, info) => {
            if (err) return next(err)
            if (info) return next(new Error(info))
            userService.authenticateUser( req.body.username, req.body.password, (err, user, info) => {
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