/* Get meals view */
const meals = (req, res) => {
    res.render('meals', {title: 'Meals - Travlr Getaways'})
}

module.exports = { meals }