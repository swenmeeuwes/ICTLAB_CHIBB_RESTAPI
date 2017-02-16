/**
 * sensor-controller.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 **/

var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res) {
    res.send("Sensor data from " + req.params.id);
});

router.post('/', function(req, res) {
    res.send("POSTED SENSOR!\r\n" + JSON.stringify(req.body));
});

module.exports = router;