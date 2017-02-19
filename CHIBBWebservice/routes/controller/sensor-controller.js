/**
 * sensor-controller.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 * 
 * // FOR ALL HTTP REQUESTS: Should probably set header?
 * res.setHeader('content-type', 'text/plain'); but json
 * USE res.json instead of res.send ?
 **/

var express = require('express');
var router = express.Router();

var neo4j = require('neo4j-driver').v1;
var driver = require('./../../database/driver');
var session = driver.session();

var wrapper = require('../model/response-wrapper');

// CRUD
// CREATE
router.post('/', function (req, res) {
    console.log("[SensorController] POST HTTP request received from %s", req.ip);

    session
            .run("CREATE (s:Sensor {id: {id}, type: {type}});", req.body)
            .then(function () {
                res.status(201);
                res.send(wrapper(201, "Created", req.body));
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
        var statusCode = recordFieldObjects.length > 0 ? 200 : 204;
        res.status(statusCode); // if this is 204, there is no body. Do we want this?
        res.send(wrapper(statusCode, recordFieldObjects.length > 0 ? "OK" : "No content", recordFieldObjects));
    }, function (errorMessage, errorCode) {
        // Service unavailable
        res.status(503);
        res.send(wrapper(503, errorMessage));
    });
});

// UPDATE
router.put('/:id', function (req, res) {
    console.log("[SensorController] PUT HTTP request received from %s", req.ip);

    var queryParams = req.body;
    queryParams.id = req.params.id;

    var updatedSensors = session.run("MATCH (s:Sensor) WHERE s.id = {id} SET s.type = {type} RETURN s AS Sensor;", queryParams);
    updatedSensors.then(function (result) {
        if (result.records.length > 0) {
            res.status(200);
            res.send(wrapper(200, "OK", req.body));
        }
        res.status(404);
        res.send(wrapper(404, "Not found"));
    }, function (errorMessage, errorCode) {
        // Service unavailable
        res.status(503);
        res.send(wrapper(503, errorMessage));
    });
});

// DELETE
router.delete('/:id', function (req, res) {
    console.log("[SensorController] DELETE HTTP request received from %s", req.ip);

    session
            .run("MATCH (s:Sensor) WHERE s.id = {id} DETACH DELETE s;", {id: req.params.id})
            .then(function () {
                res.status(200);
                res.send(wrapper(200, "OK"));
            });
});

module.exports = router;