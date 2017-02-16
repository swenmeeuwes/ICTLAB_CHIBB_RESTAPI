/**
 * router.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 **/

var express = require('express');
var router = express.Router();

router.use('/sensor', require('./controllers/sensor-controller'));

module.exports = router;