// Var init
var express = require('express');
var router = express.Router();
const ctrlContact = require('../controllers/contact')

/* GET about page */
router.get('/', ctrlContact.contact)

module.exports = router;