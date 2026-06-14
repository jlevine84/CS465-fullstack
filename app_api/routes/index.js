// Reqs and var init
const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")

const tripsController = require("../controllers/trips")
const authController = require("../controllers/authentication")

// Method for autheticating JWT
function authenticateJWT(req, res, next) {
    // console.log('In Middleware')
    const authHeader = req.headers['authorization']
    
    // console.log('Auth Header: ' + authHeader)
    if(authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!')
        return res.sendStatus(401)
    }

    let headers = authHeader.split(' ');
    if (headers.length < 1) {
        console.log('Not enough tokens in Auth Header: ' +
        headers.length)
        return res.sendStatus(501)
    }
    
    const token = authHeader.split(' ')[1];
    // console.log('Token: ' + token)

    if (token == null) {
        console.log('Null Bearer Token')
        return res.sendStatus(401)
    }

    // console.log(process.env.JWT_SECRET);

    // console.log(jwt.decode(token));
    const verified = jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) { return res.sendStatus(401).json('Token Validation Error!') }
        req.auth = verified; // Set the auth param to the decoded object
    })

    next(); // We need to continue or this will hang forever
}

// User registration 
router.route("/register")
    .post(authController.register) // POST: Register a new user

// User login authentication
router.route("/login")
    .post(authController.login) // POST: Login a user

// Trip Routes
router.route("/trips")
    .get(tripsController.tripsList) // GET: Get all trips
    .post(authenticateJWT, tripsController.tripsAddTrip) // POST: Add a new trip

// Trip Routes by trip code 
router.route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode) // GET: Single trip by code
    .put(authenticateJWT, tripsController.tripsUpdateTrip) // PUT: Update single trip

module.exports = router