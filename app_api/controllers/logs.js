// Reqs and var init
const mongoose = require("mongoose");
require("../models/log"); // Ensures log schema is loaded in memory
const Log = mongoose.model("logs"); // Unified model reference

// GET endpoint: /logs - Retrieve all logs with pagination & filtering
const getLogs = async (req, res) => {
    try {
        // Query param extraction for pagination and filtering
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const actionFilter = req.query.action;

        // Build filter object
        let filter = {};
        if (actionFilter) {
            filter.action = actionFilter.toUpperCase();
        }

        // Retrieve log records sorted by most recent first
        const logs = await Log.find(filter)
            .sort({ timeStamp: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        // Total count for frontend pagination controls
        const totalLogs = await Log.countDocuments(filter);

        // Return paginated log payload
        return res.status(200).json({
            logs,
            currentPage: page,
            totalPages: Math.ceil(totalLogs / limit),
            totalRecords: totalLogs
        });

    } catch (err) {
        console.error("Error retrieving system logs:", err);
        return res.status(500).json({ error: err.message });
    }
};

// GET endpoint: /logs/{id} - Get a single audit log entry by logID
const getLogById = async (req, res) => {
    try {
        const log = await Log.findOne({ logID: req.params.id }).exec();

        if (!log) {
            return res.status(404).json({ error: "Audit log entry not found." });
        }

        return res.status(200).json(log);
    } catch (err) {
        console.error("Error finding log entry:", err);
        return res.status(500).json({ error: err.message });
    }
};

// POST endpoint: /logs - Helper to manually record custom system events
const createLog = async (req, res) => {
    try {
        const newLog = new Log({
            user: req.user ? req.user.email : (req.body.user || "System"),
            action: req.body.action,
            endpoint: req.body.endpoint || "N/A",
            status: req.body.status || "INFO",
            description: req.body.description,
            details: req.body.details || {}
        });

        const savedLog = await newLog.save();
        return res.status(201).json(savedLog);

    } catch (err) {
        console.error("Error generating manual log:", err);
        return res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getLogs,
    getLogById,
    createLog
};