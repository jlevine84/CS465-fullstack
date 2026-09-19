// Reqs and var init
const express = require("express");
const router = express.Router();

// Controllers
const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");
const logsController = require("../controllers/logs");

// Public Auth Routes
router.route("/register")
    .post(authController.register); // POST: Register a new user

router.route("/login")
    .post(authController.login); // POST: Login a user

// Trip Routes (Editors & Admins)
router.route("/trips")
    .get(tripsController.tripsList) // GET: Public access to list all trips
    .post(authController.verifyToken, tripsController.tripsAddTrip); // POST: Add a new trip package

router.route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode) // GET: Public access to view single trip by code
    .put(authController.verifyToken, tripsController.tripsUpdateTrip) // PUT: Update single trip package
    .delete(authController.verifyToken, tripsController.tripsDeleteTrip); // DELETE: Remove single trip package

// Audit Log Routes (Admin-Only Access)
router.route("/logs")
    .get(authController.verifyToken, authController.requireAdmin, logsController.getLogs) // GET: Fetch paginated audit logs
    .post(authController.verifyToken, authController.requireAdmin, logsController.createLog); // POST: Create manual audit log entry

router.route("/logs/:id")
    .get(authController.verifyToken, authController.requireAdmin, logsController.getLogById); // GET: Fetch specific log entry by logID

// User Management Routes (Admin-Only Access)
router.route("/users")
    .get(authController.verifyToken, authController.requireAdmin, authController.getUsers); // GET: Fetch system users list

module.exports = router;