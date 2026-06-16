/* Get about view */
const about = (req, res) => {
    res.render('about', { title: 'About - Travlr Getaways', page: "about"})
}

module.exports = { about }