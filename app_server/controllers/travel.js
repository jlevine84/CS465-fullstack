// // Var init

const tripsEndpoint = "http://localhost:3000/api/trips"
const options = {
    method: "GET",
    headers: {
        "Accept": "application/json"
    }
}

/* Get travel view with API json data */
const travel = async function(req, res, next) {
    // Use the end point and await a response
    await fetch(tripsEndpoint, options)
        .then((res)=> res.json())
        .then((json)=> {
            // If response successful, check for empty array
            let message = null

            if (!(json instanceof Array)) {
                message = "API lookup error, empty array"
                json = []
            } else {
                if (!json.length) {
                    message = "No trips exist in DB!"
                }
            }

            res.render("travel", { title: "Travlr Getaways", trips: json, page: "travel", message})
        })
        .catch((err)=> {
            // Error encountered
            console.log(err.message)
            res.status(500).send(err.message)
        })
}

module.exports = { travel }