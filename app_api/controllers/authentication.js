// Reqs and var init
const mongoose = require("mongoose")
require("../models/user") // Ensures schema is loaded
const User = mongoose.model("users") // Unified model reference
const passport = require("passport")

// POST method for /register endpoint - register a new user
const register = async (req, res) => {
    try {
        // Validate request body to ensure all required params are present
        if (!req.body.name || !req.body.email || !req.body.password) {
            return res.status(400).json({ "message": "All fields required" })
        }

        // Initialize new user document
        const user = new User({
            name: req.body.name,
            email: req.body.email
        })

        // Secure the password using the schema instance method
        user.setPassword(req.body.password)

        // Save the new user to MongoDB
        const savedUser = await user.save()

        // If save is successful, generate and return the JWT
        const token = user.generateJWT()
        return res.status(201).json({ token })

    } catch (err) {
        // Log the error and return a 400 or 500 status depending on the error type
        console.error("Error during user registration:", err)
        
        // Handle MongoDB duplicate key errors (e.g., email already exists)
        if (err.code === 11000) {
            return res.status(409).json({ "message": "Email already registered." })
        }
        
        return res.status(400).json({ "error": err.message })
    }
}

// POST method for /login endpoint - Handle login of user
const login = (req, res)=> {
    try {
        // Validate request body to ensure all required params are present
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ "message": "All fields required" })
        }

        // Delegate authentication to passport module
        passport.authenticate("local", (err, user, info)=> {
            // If authentication error occurs, return the error
            if (err) { return res.status(404).json(err) }

            // If auth succeeded, generate a token and return it
            if (user) { 
                const token = user.generateJWT()
                return res.status(200).json({token})
            }

            // Else, return misc error
            else { return res.status(401).json(info) }
        }) (req, res)
    } catch (err) {
        // Log error to console and return a server error
        console.error("Error during user login execution:", err)
        return res.status(400).json({ "error": err.message })
    }
}

module.exports = { register, login }