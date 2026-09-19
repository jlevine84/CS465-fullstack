// Reqs
const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// User schema definition
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["admin", "editor"],
        default: "editor",
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    hash: String,
    salt: String
}, {
    timestamps: true
});

// User methods for auth
// Method to set the password on this record
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    // Upgraded iteration count to 100,000 for stronger key derivation
    this.hash = crypto.pbkdf2Sync(password, this.salt, 100000, 64, "sha512").toString("hex");
};

// Method to compare entered password against stored hash
userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 100000, 64, "sha512").toString("hex");
    return this.hash === hash;
};

// Method to generate a JSON Web Token for the current record
// Includes role in payload so middleware & Angular frontend can enforce permissions
userSchema.methods.generateJWT = function() {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        role: this.role
    }, process.env.JWT_SECRET, { expiresIn: "1h" }); 
};

// Helper method to verify if user is an admin
userSchema.methods.isAdmin = function() {
    return this.role === "admin";
};

// Export module
const User = mongoose.model("users", userSchema);
module.exports = User;