/**
 * house-controller.js
 * Created on 12-03-2017
 * @author Jesse van Breda
 **/

var config = require('config');

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

var neo4j = require('neo4j-driver').v1;
var driver = require('./../../database/driver');
var session = driver.session();

var wrapper = require('../model/response-wrapper');

router.post("/", function (req, res) {
    console.log("[HouseController] POST HTTP request received from %s", req.ip);

    var token = req.query.token;
    var username;
    jwt.verify(token, config.get('token.secret'), function (error, decoded) {
        if (error) {
            res.status(403);
            res.json(wrapper(403, "Forbidden"));
        } else {
            username = decoded.username;
            var house = session.run("MATCH (h:House{uid:{id}}) RETURN h AS House;", {id: req.body.id});
            house.then(function (result) {
                var records = result.records;
                var recordFieldObjects = records.map(function (item) {
                    return item._fields[0].properties; // Extract fields from the record
                });
                if(recordFieldObjects.length > 0){
                    res.status(400);
                    res.send(wrapper(400, "Bad Request", {message: "House with that Id already exists!"}));
                }
                else {
                    session
                    .run("MATCH (u:User {username:{username}}) CREATE ((u) -[r:Owns]-> (h:House{uid:{id},address:{address}}));", {username: username, id: req.body.id, address: req.body.address})
                    .then(function () {
                        res.status(201);
                        res.send(wrapper(201, "Created", req.body));
                    });
                }
            }, function (errorMessage, errorCode) {
                // Service unavailable
                res.status(503);
                res.send(wrapper(503, errorMessage));

            });
        }
    });
});

router.delete("/:id", function(req, res){
    console.log("[HouseController] DELETE HTTP request received from %s", req.ip);

    var token = req.query.token;
    var username;
    jwt.verify(token, config.get('token.secret'), function (error, decoded) {
        if (error) {
            res.status(403);
            res.json(wrapper(403, "Forbidden"));
        } else {
            username = decoded.username;
            
            var house = session.run("MATCH (u:User{username:{username}})-[:Owns]->(h:House{uid:{id}}) RETURN h AS House;", {username: username, id: req.params.id});
            house.then(function (result) {
                var records = result.records;
                var recordFieldObjects = records.map(function (item) {
                    return item._fields[0].properties; // Extract fields from the record
                });
                if(recordFieldObjects.length > 0){
                    session
                    .run("MATCH (u:User {username:{username}})-[:Owns]->(h:House {uid: {hid}})-[:Has]-> (allSensors) -[:Has_record]-> (allRecords) DETACH DELETE h, allSensors, allRecords;", {username: username, hid: req.params.id})
                    .then(function () {
                        res.status(202);
                        res.send(wrapper(202, "Accepted", req.body));
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


module.exports = router;
