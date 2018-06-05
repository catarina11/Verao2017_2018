const express = require('express')
const path = require('path')
const cinRouter = require('./routes/cinemaRoutes')
const movieRouter = require('./routes/movieRoutes')
const userRoute = require('./routes/userRoutes')


const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')

const cin = require('./services/cinemaGetsService')
/**
 * Setup express Web App
 */
const router = express() // Init an empty pipeline of Middlewares
// view engine setup
router.set('views', path.join(__dirname, 'views'))
router.set('view engine', 'hbs')

router.use(bodyParser.urlencoded({extended: false}))
//router.use(favicon(path.join(__dirname, 'public', 'movieIcon.png')))
router.use(express.static(path.join(__dirname, 'public')))
router.use(cookieParser())
router.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true}))
router.use(flash())
router.use(passport.initialize())
router.use(passport.session())

router.get('/', (req, resp, next) => {
    resp.setHeader('Content-Type', 'text/html')
    if (req.user != undefined)
        resp.render('principalView', {menuState: {user: req.user.username}, cinemas: data.results})
    else
        resp.render('principalView')
})


router.use(userRoute)
router.use('/cinemas', cinRouter)
router.use('/movies', movieRouter)


router.use(function (req, res, next) {
    var err = new Error('Not Found')
    res.status = 404
    next(err)
})

router.use(function (err, req, res, next) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status = err.status || 500
    res.render('error')
})
module.exports = router