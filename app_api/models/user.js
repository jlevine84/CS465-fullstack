// Reqs
const mongoose = require("mongoose")
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// User schema definition
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
})

// User methods for auth
// Method to set the password on this record.
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt,
    1000, 64, 'sha512').toString('hex');
};

// Method to compare entered password against stored hash
userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password,this.salt, 1000, 64, 'sha512').toString('hex');

    return this.hash === hash;
};

// Method to generate a JSON Web Token for the current record
// SECRET stored in .env file
//Token expires an hour from creation
userSchema.methods.generateJWT = function() {
    return jwt.sign({
         // Payload for our JSON Web Token
        _id: this._id,
        email: this.email,
        name: this.name,
    }, process.env.JWT_SECRET,  { expiresIn: '1h' }); 
};

// Export module
const User = mongoose.model("users", userSchema)
module.exports = User