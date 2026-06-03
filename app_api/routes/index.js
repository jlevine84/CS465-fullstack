// Reqs and var init
const express = require("express")
const router = express.Router()

const tripsController = require("../controllers/trips")

// Get route: All trips
router.route("/trips").get(tripsController.tripsList)

// Get Route: Single trip by code
router.route("/trips/:tripCode").get(tripsController.tripsFindByCode)

module.exports = router