/**
 * router.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 **/

var express = require('express');
var router = express.Router();
var wrapper = require('./model/response-wrapper');

// Forbid root requests
router.get('/', function (req, res) {
    res.status(403);
    res.json(wrapper(403, "Forbidden"));
});

// Define route controllers here
router.use('/sensor', require('./controller/sensor-controller'));
router.use('/token', require('./controller/token-controller'));
router.use('/user', require('./controller/user-controller'));
router.use('/record', require('./controller/record-controller'))
router.use('/house', require('./controller/house-controller'))

module.exports = router;