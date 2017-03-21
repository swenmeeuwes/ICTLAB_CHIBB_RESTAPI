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

var config = require('config');
var jwt = require('jsonwebtoken');

var neo4j = require('neo4j-driver').v1;
var driver = require('./../../database/driver');
var session = driver.session();

var wrapper = require('../model/response-wrapper');

// CRUD
// CREATE
router.post('/', function (req, res) {
    console.log("[SensorController] POST HTTP request received from %s", req.ip);

    var token = req.query.token;
    var username;
    jwt.verify(token, config.get('token.secret'), function (error, decoded) {
        if (error) {
            res.status(403);
            res.json(wrapper(403, "Forbidden"));
        } else {
            username = decoded.username;
            var house = session.run("MATCH (u:User{username:{username}})-[:Owns]->(h:House{uid:{id}}) RETURN h AS House;", {username: username, id: req.body.hid});
            house.then(function (result) {
                var records = result.records;
                var recordFieldObjects = records.map(function (item) {
                    return item._fields[0].properties; // Extract fields from the record
                });
                if(recordFieldObjects.length > 0){
                    session
                    .run("MATCH (h:House {uid:{hid}}) CREATE ((h) -[r:Has]-> (s:Sensor{uid:{sid},type:{type},attributes:{attributes}}));", {hid: req.body.hid, sid: req.body.sid, type: req.body.type, attributes: req.body.attributes})
                    .then(function () {
                        res.status(201);
                        res.send(wrapper(201, "Created", req.body));
                    });
                }
                else {
                    res.status(404);
                    res.send(wrapper(404, "Not found", {errorMessage: "Given House doesn't exist or is not yours!"}));
                }
            }, function (errorMessage, errorCode) {
                // Service unavailable
                res.status(503);
                res.send(wrapper(503, errorMessage));
            });
            

            
        }
    });
});

// READ ALL
router.get('/', function (req, res) {
    console.log("[SensorController] GET HTTP request received from %s", req.ip);

    var token = req.query.token;
    jwt.verify(token, config.get('token.secret'), function (error, decoded) {
        if (error) {
            res.status(403);
            res.json(wrapper(403, "Forbidden"));
        } else {
            var username = decoded.username;

            var sensor = session.run("MATCH (u:User{username: {username}})-[r:Owns]->(h:House)-[r1:Has]->(s:Sensor) RETURN s AS Sensor;", {username: username, id: req.params.id});
            sensor.then(function (result) {
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
        }
    });
});

// READ BY ID
router.get('/:id', function (req, res) {
    console.log("[SensorController] GET HTTP request received from %s", req.ip);

    var token = req.query.token;
    jwt.verify(token, config.get('token.secret'), function (error, decoded) {
        if (error) {
            res.status(403);
            res.json(wrapper(403, "Forbidden"));
        } else {
            var username = decoded.username;

            var sensor = session.run("MATCH (u:User{username: {username}})-[r:Owns]->(h:House)-[r1:Has]->(s:Sensor{uid: {id}}) RETURN s AS Sensor;", {username: username, id: req.params.id});
            sensor.then(function (result) {
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
        }
    });
});

// UPDATE
// TODO (With authentication/ relationship)
router.put('/:id', function (req, res) {
    console.log("[SensorController] PUT HTTP request received from %s", req.ip);

    var token = req.query.token;
    var username;
    jwt.verify(token, config.get('token.secret'), function (error, decoded) {
        if (error) {
            res.status(403);
            res.json(wrapper(403, "Forbidden"));
        } else {
            username = decoded.username;
        }
    });

    var queryParams = req.body;
    queryParams.id = req.params.id;

    // ADD RELATIONSHIP
    var updatedSensors = session.run("MATCH (s:Sensor) WHERE s.uid = {id} SET s.type = {type} RETURN s AS Sensor;", queryParams);
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

    var token = req.query.token;
    jwt.verify(token, config.get('token.secret'), function (error, decoded) {
        if (error) {
            res.status(403);
            res.json(wrapper(403, "Forbidden"));
        } else {
            var username = decoded.username;
            session
                    .run("MATCH (u:User{username: {username}})-[:Owns]->(h:House)-[:Has]->(s:Sensor{uid: {id}})-[:Has_record]->(allRelatedNodes) DETACH DELETE s, allRelatedNodes;", {username: username, id: req.params.id})
                    .then(function () {
                        res.status(200);
                        res.send(wrapper(200, "OK"));
                    });
        }
    });
});

module.exports = router;