// Reqs and var init
const mongoose = require("mongoose")
const Trip = require("../models/travlr")
const Model = mongoose.model("trips")

// GET endpoint: /trips - get a list of all trips
const tripsList = async(req, res)=> {
    const query = await Model
        // Find all trip records
        .find({})
        .exec()

        console.log(query)

    // If no query response
    if(!query) {
        // return error
        return res.status(404).json(err)
    }

    // Else, query successful
    else {
        // return all trips
        return res.status(200).json(query)
    }
}

// GET endpoint: /trips/{code} - Single list by code
const tripsFindByCode = async(req, res)=> {
    const query = await Model
        // Find single trip by code
        .find({"code": req.params.tripCode})
        .exec()

        console.log(query)

    // If no query response
    if(!query) {
        // return error
        return res.status(404).json(err)
    }

    // Else, query successful
    else {
        return res.status(200).json(query)
    }
}

// POST endpoint: /trips - Add a new trip
const tripsAddTrip = async(req, res) => {
    try {
        const newTrip = new Trip({
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
        // If validation fails or database hits a snag, catch the real error here safely
        console.error("Error creating trip:", err);
        return res.status(400).json({ error: err.message });
    }
}

module.exports = { tripsList, tripsFindByCode, tripsAddTrip }