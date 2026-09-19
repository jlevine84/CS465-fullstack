// Reqs and var init
const mongoose = require("mongoose");
require("../models/trip"); // Ensures schema is loaded into Mongoose memory
require("../models/log");  // Ensures audit log schema is loaded
const Model = mongoose.model("trips"); // Unified model reference for all CRUD operations
const Log = mongoose.model("logs");   // Audit log model reference

// GET endpoint: /trips - Get a list of all trips
const tripsList = async (req, res) => {
    try {
        const query = await Model
            .find({})
            .exec();

        // If no query response
        if (!query || query.length === 0) {
            return res.status(404).json({ error: "No trips found." });
        }

        // Return all trips
        return res.status(200).json(query);
    } catch (err) {
        console.error("Error retrieving trips:", err);
        return res.status(500).json({ error: err.message });
    }
};

// GET endpoint: /trips/{code} - Single trip by code
const tripsFindByCode = async (req, res) => {
    try {
        const query = await Model
            .find({ "code": req.params.tripCode })
            .exec();

        // If no query response
        if (!query || query.length === 0) {
            return res.status(404).json({ error: "Trip not found with provided code." });
        }

        return res.status(200).json(query);
    } catch (err) {
        console.error("Error finding trip by code:", err);
        return res.status(500).json({ error: err.message });
    }
};

// POST endpoint: /trips - Add a new trip
const tripsAddTrip = async (req, res) => {
    try {
        // Instantiate a new trip record
        const newTrip = new Model({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        // Save to MongoDB
        const savedTrip = await newTrip.save();

        // Generate audit log record
        await Log.create({
            user: req.user ? req.user.email : "System",
            action: "CREATE",
            endpoint: `POST /api/trips`,
            status: "201 Created",
            description: `Created new trip package: ${savedTrip.code}`,
            details: { code: savedTrip.code, name: savedTrip.name }
        });

        // Return 201 Created status
        return res.status(201).json(savedTrip);

    } catch (err) {
        console.error("Error creating trip:", err);
        return res.status(400).json({ error: err.message });
    }
};

// PUT endpoint: /trips/{code} - Edit a specific trip
const tripsUpdateTrip = async (req, res) => {
    try {
        console.log("Locating and updating trip code:", req.params.tripCode);
        
        // Find existing record first to compare values for audit logging
        const existingTrip = await Model.findOne({ "code": req.params.tripCode }).exec();

        if (!existingTrip) {
            return res.status(404).json({ error: "Trip code not found to update." });
        }

        const query = await Model.findOneAndUpdate(
            { "code": req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true, runValidators: true }
        ).exec();

        // Generate audit log record tracking price or general modification
        await Log.create({
            user: req.user ? req.user.email : "System",
            action: "UPDATE",
            endpoint: `PUT /api/trips/${req.params.tripCode}`,
            status: "200 OK",
            description: `Modified details for package ${query.code}`,
            details: {
                previousPrice: existingTrip.perPerson,
                updatedPrice: query.perPerson
            }
        });

        return res.status(200).json(query);

    } catch (err) {
        console.error("Error updating trip:", err);
        return res.status(400).json({ error: err.message });
    }
};

// DELETE endpoint: /trips/{code} - Delete a specific trip
const tripsDeleteTrip = async (req, res) => {
    try {
        const deletedTrip = await Model.findOneAndDelete({ "code": req.params.tripCode }).exec();

        if (!deletedTrip) {
            return res.status(404).json({ error: "Trip code not found to delete." });
        }

        // Generate audit log record
        await Log.create({
            user: req.user ? req.user.email : "System",
            action: "DELETE",
            endpoint: `DELETE /api/trips/${req.params.tripCode}`,
            status: "200 OK",
            description: `Deleted trip package: ${req.params.tripCode}`
        });

        return res.status(200).json({ message: "Trip successfully deleted.", code: req.params.tripCode });

    } catch (err) {
        console.error("Error deleting trip:", err);
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { 
    tripsList, 
    tripsFindByCode, 
    tripsAddTrip, 
    tripsUpdateTrip,
    tripsDeleteTrip 
};