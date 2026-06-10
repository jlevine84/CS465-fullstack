// Reqs and var init
const mongoose = require("mongoose")
require("../models/travlr") // Ensures schema is loaded into Mongoose memory
const Model = mongoose.model("trips") // Unified model reference for all CRUD operations

// GET endpoint: /trips - get a list of all trips
const tripsList = async(req, res)=> {
    try {
        const query = await Model
            // Find all trip records
            .find({})
            .exec()

        console.log(query)

        // If no query response
        if(!query || query.length === 0) {
            // return error
            return res.status(404).json({ error: "No trips found." })
        }

        // Else, query successful
        else {
            // return all trips
            return res.status(200).json(query)
        }
    } catch (err) {
        console.error("Error retrieving trips:", err);
        return res.status(500).json({ error: err.message });
    }
}

// GET endpoint: /trips/{code} - Single list by code
const tripsFindByCode = async(req, res)=> {
    try {
        const query = await Model
            // Find single trip by code
            .find({"code": req.params.tripCode})
            .exec()

        console.log(query)

        // If no query response
        if(!query || query.length === 0) {
            // return error
            return res.status(404).json({ error: "Trip not found with provided code." })
        }

        // Else, query successful
        else {
            return res.status(200).json(query)
        }
    } catch (err) {
        console.error("Error finding trip by code:", err);
        return res.status(500).json({ error: err.message });
    }
}

// POST endpoint: /trips - Add a new trip
const tripsAddTrip = async(req, res) => {
    try {
        // Instantiate a new trip record using the Mongoose model mapping
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
        
        // Return 201 Created status with the newly saved document
        return res.status(201).json(savedTrip);

    } catch (err) {
        // If validation fails or database hits a snag, catch the error
        console.error("Error creating trip:", err);
        return res.status(400).json({ error: err.message });
    }
}

// PUT endpoint: /trips/{code} - Edit a specific trip.
const tripsUpdateTrip = async(req, res)=> {
    try {
        console.log("Locating and updating trip code:", req.params.tripCode);
        console.log("Payload content:", req.body);
        
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
            { new: true, runValidators: true } // Returns the freshly updated document and runs safety validation checks
        ).exec()

        console.log("Database update response:", query);

        // If no query response matched the parameters
        if (!query) {
            // return error
            return res.status(404).json({ error: "Trip code not found to update." });
        } 
        
        // Else, query successful
        else {
            // return updated trip
            return res.status(200).json(query);
        }
    } catch (err) {
        // If validation fails or database hits a snag, catch the error
        console.error("Error updating trip:", err);
        return res.status(400).json({ error: err.message });
    }
}

module.exports = { tripsList, tripsFindByCode, tripsAddTrip, tripsUpdateTrip }