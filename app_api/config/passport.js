// Reqs and var init
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
require("../models/user") // Ensures user schema is loaded into Mongoose memory
const User = mongoose.model("users") // Unified model reference for authentication

// Passport authentication strategy configuration
passport.use(
    new LocalStrategy({
            usernameField: "email"
        },
        async (username, password, done) => {
            try {
                const query = await User
                    // Find single user record by their email address
                    .findOne({ email: username })
                    .exec()

                console.log("Authentication attempt for user:", username)

                // If no query response
                if (!query) {
                    // return validation error back to passport verification pipeline
                    return done(null, false, {
                        message: "Incorrect username."
                    })
                }

                // If password verification fails using schema instance method
                else if (!query.validPassword(password)) {
                    // return validation error back to passport verification pipeline
                    return done(null, false, {
                        message: "Incorrect password."
                    })
                }

                // Else, verification successful
                else {
                    // return verified user object to proceed with authentication
                    return done(null, query)
                }

            } catch (err) {
                console.error("Error during passport local strategy verification:", err);
                // Return runtime database or system errors safely down the strategy stream
                return done(err);
            }
        }
    )
)