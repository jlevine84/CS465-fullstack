// Reqs and var init
const mongoose = require("mongoose");
require("../models/user"); // Ensures user schema is loaded
require("../models/log");  // Ensures audit log schema is loaded
const User = mongoose.model("users"); // Unified user model reference
const Log = mongoose.model("logs");   // Audit log model reference

// GET endpoint: /users - Retrieve a list of all system users
const getUsers = async (req, res) => {
    try {
        // Find all users excluding sensitive hash & salt fields
        const users = await User.find({})
            .select("-hash -salt")
            .exec();

        // If no records found
        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No system users found." });
        }

        return res.status(200).json(users);
    } catch (err) {
        console.error("Error retrieving system users:", err);
        return res.status(500).json({ error: err.message });
    }
};

// GET endpoint: /users/{id} - Get a single user by MongoDB ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-hash -salt")
            .exec();

        if (!user) {
            return res.status(404).json({ error: "User account not found." });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error("Error finding user:", err);
        return res.status(500).json({ error: err.message });
    }
};

// PUT endpoint: /users/{id} - Update user role, status, or details
const updateUser = async (req, res) => {
    try {
        const { role, status, name } = req.body;

        // Fetch existing record first to record previous state for audit log
        const existingUser = await User.findById(req.params.id).exec();

        if (!existingUser) {
            return res.status(404).json({ error: "User account not found to update." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, role, status },
            { new: true, runValidators: true }
        ).select("-hash -salt").exec();

        // Generate audit log record
        await Log.create({
            user: req.user ? req.user.email : "System",
            action: "UPDATE",
            endpoint: `PUT /api/users/${req.params.id}`,
            status: "200 OK",
            description: `Updated account settings for user: ${updatedUser.email}`,
            details: {
                targetEmail: updatedUser.email,
                previousRole: existingUser.role,
                updatedRole: updatedUser.role,
                previousStatus: existingUser.status,
                updatedStatus: updatedUser.status
            }
        });

        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error updating user account:", err);
        return res.status(400).json({ error: err.message });
    }
};

// DELETE endpoint: /users/{id} - Remove a user account
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id).exec();

        if (!deletedUser) {
            return res.status(404).json({ error: "User account not found to delete." });
        }

        // Generate audit log record
        await Log.create({
            user: req.user ? req.user.email : "System",
            action: "DELETE",
            endpoint: `DELETE /api/users/${req.params.id}`,
            status: "200 OK",
            description: `Deleted system user account: ${deletedUser.email}`,
            details: {
                deletedUserId: req.params.id,
                deletedEmail: deletedUser.email,
                deletedRole: deletedUser.role
            }
        });

        return res.status(200).json({ message: "User account deleted successfully.", id: req.params.id });
    } catch (err) {
        console.error("Error deleting user account:", err);
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};