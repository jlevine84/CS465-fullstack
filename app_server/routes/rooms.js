// Var init
var express = require('express');
var router = express.Router();
const ctrlRooms = require('../controllers/rooms')

/* GET rooms page */
router.get('/', ctrlRooms.rooms)

module.exports = router;