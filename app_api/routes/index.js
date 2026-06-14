// Reqs and var init
const express = require("express")
const router = express.Router()

const tripsController = require("../controllers/trips")
const authController = require("../controllers/authentication")

// User registration 
router.route("/register")
    .post(authController.register) // POST: Register a new user

// User login authentication
router.route("/login")
    .post(authController.login) // POST: Login a user


// Trip Routes
router.route("/trips")
    .get(tripsController.tripsList) // GET: Get all trips
    .post(tripsController.tripsAddTrip) // POST: Add a new trip

// Trip Routes by trip code 
router.route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode) // GET: Single trip by code
    .put(tripsController.tripsUpdateTrip) // PUT: Update single trip

module.exports = router