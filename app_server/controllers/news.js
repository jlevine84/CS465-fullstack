/* Get news view */
const news = (req, res) => {
    res.render('news', { title: 'News - Travlr Getaways', page: "news" })
}

module.exports = { news }