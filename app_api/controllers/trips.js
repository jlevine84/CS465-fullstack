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

module.exports = { tripsList, tripsFindByCode }