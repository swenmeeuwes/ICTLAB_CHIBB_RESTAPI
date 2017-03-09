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
    session.run("MATCH (s:Sensor {uid:{uid}}) CREATE ((s) -[r:has_data]-> (re:Record{timestamp:{timestamp}, sensorState:{sensorState}, sensorBatteryLevel:{sensorBatteryLevel}, unit:{unit}, value:{value} }));",
            {uid: newSensorData[0].id, timestamp: newSensorData[0].timestamp, sensorState: newSensorData[0].sensorState, sensorBatteryLevel: newSensorData[0].sensorBatteryLevel, unit: newSensorData[0].unit, value: newSensorData[0].value})
            .then(function () {
                res.status(201);
                res.send(wrapper(201, "Done"));
            })

//    for (var i = 0; i < newSensorData.length; i++) {
//        var attributes;
//        var results = session.run("MATCH (s:Sensor {uid:{uid}}) return s AS Sensor", {uid: newSensorData[0].id});
//        results.then(function (result) {
//            var records = result.records;
//            var recordFieldObjects = records.map(function (item) {
//                return item._fields[0].properties; // Extract fields from the record
//            });
//            attributes = recordFieldObjects[0].attributes;
//        });

    //   }

});

module.exports = router;