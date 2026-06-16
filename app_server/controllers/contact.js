/* Get about view */
const contact = (req, res) => {
    res.render('contact', { title: 'Contact Us - Travlr Getaways', page: "contact"})
}

module.exports = { contact }