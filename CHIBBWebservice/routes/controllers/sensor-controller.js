/**
 * sensor-controller.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 **/

var express = require('express');
var router = express.Router();

var neo4j = require('neo4j-driver').v1;
var driver = require('./../../database/driver');
var session = driver.session();

// To-do: Add wrapper
router.get('/:id', function (req, res) {
    console.log("[SensorController] GET HTTP request received from %s", req.ip);

    var result = session.run("MATCH (s:Sensor) WHERE s.id = {id} RETURN s AS Sensor", {id: req.params.id});
    result.then(function (result) {
        var records = result.records;
        var recordFieldObjects = records.map(function (item) {
            return item._fields[0].properties; // Extract fields from the record
        });
        res.send(recordFieldObjects);
    }, function (errorMessage, errorCode) {
        res.send({errorCode: errorCode, errorMessage: errorMessage});
    });
});

router.post('/', function (req, res) {
    console.log("[SensorController] POST HTTP request received from %s", req.ip);

    session
            .run("CREATE (s:Sensor {id: {id}, type: {type}})", req.body)
            .then(function () {
                res.send("POSTED SENSOR!\r\n" + JSON.stringify(req.body));
            });
});

module.exports = router;