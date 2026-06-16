/* Get Homepage */
const index = (req, res) => {
    res.render('index', { title: "Travlr Getaways", page: "home" })
}

module.exports = { index }