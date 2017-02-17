/**
 * sensor-controller.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 * 
 * To-do: Wrapper (module?) + Response messages with http code + result
 **/

var express = require('express');
var router = express.Router();

var neo4j = require('neo4j-driver').v1;
var driver = require('./../../database/driver');
var session = driver.session();

// CRUD
// CREATE
router.post('/', function (req, res) {
    console.log("[SensorController] POST HTTP request received from %s", req.ip);

    session
            .run("CREATE (s:Sensor {id: {id}, type: {type}});", req.body)
            .then(function () {
                res.send("POSTED SENSOR!\r\n" + JSON.stringify(req.body));
            });
});

// READ
router.get('/:id', function (req, res) {
    console.log("[SensorController] GET HTTP request received from %s", req.ip);

    var result = session.run("MATCH (s:Sensor) WHERE s.id = {id} RETURN s AS Sensor;", {id: req.params.id});
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

// UPDATE
router.put('/:id', function (req, res) {
    console.log("[SensorController] PUT HTTP request received from %s", req.ip);

    var queryParams = req.body;
    queryParams.id = req.params.id;

    var updatedSensors = session.run("MATCH (s:Sensor) WHERE s.id = {id} SET s.type = {type} RETURN s AS Sensor;", queryParams);
    updatedSensors.then(function(result) {
        if(result.records.length > 0)
            res.send("PUT SENSOR!\r\n" + JSON.stringify(result));
        res.send("COULDN'T PUT SENSOR, SENSOR WITH ID DOESN'T EXSIST");
    }, function (errorMessage, errorCode) {
        res.send({errorCode: errorCode, errorMessage: errorMessage});
    });
});

// DELETE
router.delete('/:id', function (req, res) {
    console.log("[SensorController] DELETE HTTP request received from %s", req.ip);

    session
            .run("MATCH (s:Sensor) WHERE s.id = {id} DETACH DELETE s;", {id: req.params.id})
            .then(function () {
                res.send("DELETED SENSOR with id " + req.params.id);
            });
});

module.exports = router;