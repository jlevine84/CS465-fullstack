// Reqs and var init
const express = require("express");
const router = express.Router();

// Import controllers
const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");
const logsController = require("../controllers/logs");
const usersController = require("../controllers/users");

// Authentication Routes
router.route("/register")
    .post(authController.register); // POST: Register a new user

router.route("/login")
    .post(authController.login); // POST: Authenticate user & return JWT

// Trip Management Routes (Public Read, Protected Write)
router.route("/trips")
    .get(tripsController.tripsList) // GET: Public access to fetch all trips
    .post(authController.verifyToken, tripsController.tripsAddTrip); // POST: Add a new trip package (Editors & Admins)

router.route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode) // GET: Public access to fetch trip by code
    .put(authController.verifyToken, tripsController.tripsUpdateTrip) // PUT: Update existing trip (Editors & Admins)
    .delete(authController.verifyToken, tripsController.tripsDeleteTrip); // DELETE: Remove trip (Editors & Admins)

// Audit Log Routes (Admin-Only Access)
router.route("/logs")
    .get(authController.verifyToken, authController.requireAdmin, logsController.getLogs) // GET: Fetch paginated audit logs
    .post(authController.verifyToken, authController.requireAdmin, logsController.createLog); // POST: Record manual audit log entry

router.route("/logs/:id")
    .get(authController.verifyToken, authController.requireAdmin, logsController.getLogById); // GET: Fetch specific log entry by logID

// User Management Routes (Admin-Only Access)
router.route("/users")
    .get(authController.verifyToken, authController.requireAdmin, usersController.getUsers); // GET: Fetch all registered users

router.route("/users/:id")
    .get(authController.verifyToken, authController.requireAdmin, usersController.getUserById)   // GET: Fetch specific user profile
    .put(authController.verifyToken, authController.requireAdmin, usersController.updateUser)    // PUT: Update user role/status
    .delete(authController.verifyToken, authController.requireAdmin, usersController.deleteUser); // DELETE: Remove user account

module.exports = router;