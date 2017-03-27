/**
 * record-controller.js
 * Created on 09-03-2017
 * @author Jesse van Breda
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
    console.log("[RecordContoller] POST HTTP request received from %s", req.ip);
    var newSensorData = req.body.recordBatch;
        for(var i = 0; i < newSensorData.length; i++){
        session.run("MATCH (s:Sensor {uid:{uid}}) CREATE ((s) -[r:Has_record]-> (re:Record{timestamp:{timestamp}, sensorState:{sensorState}, sensorBatteryLevel:{sensorBatteryLevel}, unit:{unit}, value:{value} }));",
                {uid: newSensorData[i].id, timestamp: newSensorData[i].timestamp, sensorState: newSensorData[i].sensorState, sensorBatteryLevel: newSensorData[i].sensorBatteryLevel, unit: newSensorData[i].unit, value: newSensorData[i].value})
                .then(function () {
                    res.status(201);
                    res.send(wrapper(201, "Done"));
                })
            }

//    for (var i = 0; i < newSensorData.length; i++) {
//        var attributes;
//        var results = session.run("MATCH (s:Sensor {uid:{uid}}) return s AS Sensor", {uid: newSensorData[i].id});
//        results.then(function (result) {
//            var records = result.records;
//            var recordFieldObjects = records.map(function (item) {
//                return item._fields[i].properties; // Extract fields from the record
//            });
//            attributes = recordFieldObjects[i].attributes;
//        });

    //   }

});

router.get('/:id', function (req, res){
    console.log("[RecordContoller] GET HTTP request received from %s", req.ip); 
    
    var token = req.query.token;
    jwt.verify(token, config.get('token.secret'), function (error, decoded) {
        if (error) {
            res.status(403);
            res.json(wrapper(403, "Forbidden"));
        } else {
            var username = decoded.username;

            var sensor = session.run("MATCH (u:User{username: {username}})-[r:Owns]->(s:Sensor{uid: {id}}) RETURN s AS Sensor;", {username: username, id: req.params.id});
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

module.exports = router;