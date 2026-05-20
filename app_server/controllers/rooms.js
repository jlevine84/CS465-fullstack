/* Get rooms view */
const rooms = (req, res) => {
    res.render('rooms', {title: 'Rooms - Travlr Getaways'})
}

module.exports = { rooms }