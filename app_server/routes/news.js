// Var init
var express = require('express');
var router = express.Router();
const ctrlNews = require('../controllers/news')

/* GET news page */
router.get('/', ctrlNews.news)

module.exports = router;