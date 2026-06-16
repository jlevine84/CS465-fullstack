// Reqs
require("dotenv").config()
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var handlebars = require('hbs')
require("./app_api/models/db") // Database
const cors = require("cors")
var passport = require("passport")
require("./app_api/config/passport")

// Init express
var app = express()

// Enable CORS
app.use('/api', cors({
	origin: 'http://localhost:4200',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Run app parsers
app.use(logger('dev'))
app.use(express.json()) 
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())

// App route definitions (Imports)
var indexRouter = require('./app_server/routes/index')
var usersRouter = require('./app_server/routes/users')
var travelRouter = require('./app_server/routes/travel')
var roomsRouter = require('./app_server/routes/rooms')
var newsRouter = require('./app_server/routes/news')
var mealsRouter = require('./app_server/routes/meals')
var aboutRouter = require('./app_server/routes/about')
var apiRouter = require("./app_api/routes/index")
var contactRouter = require("./app_server/routes/contact")

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'))
handlebars.registerPartials(__dirname + '/app_server/views/partials')
app.set('view engine', 'hbs')

// HBS helper to make nav responsive
handlebars.registerHelper("equals", function (arg1, arg2, options) {
	return (arg1 === arg2) ? options.fn(this): options.inverse(this)
})

// Bind Routes
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/travel', travelRouter)
app.use('/rooms', roomsRouter)
app.use('/news', newsRouter)
app.use('/meals', mealsRouter)
app.use('/about', aboutRouter)
app.use('/api', apiRouter) 
app.use("/contact", contactRouter)

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
})

// Catch unauthorized error
app.use((err, req, res, next)=> {
	if (err.name === "UnauthorizedError") {
		res.status(401).json({"message": err.name + ": " + err.message })
	}
})

// error handler
app.use(function(err, req, res, next) {
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app