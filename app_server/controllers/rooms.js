/* Get rooms view */
const rooms = (req, res) => {
    res.render('rooms', { title: 'Rooms - Travlr Getaways', page: "rooms" })
}

module.exports = { rooms }