/* Get meals view */
const meals = (req, res) => {
    res.render('meals', { title: 'Meals - Travlr Getaways', page: "meals" })
}

module.exports = { meals }