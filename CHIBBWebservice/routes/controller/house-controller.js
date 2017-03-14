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

            session
                    .run("MATCH (u:User {username:{username}}) CREATE ((u) -[r:Owns]-> (h:House{uid:{id},address:{address}}));", {username: username, id: req.body.id, address: req.body.address})
                    .then(function () {
                        res.status(201);
                        res.send(wrapper(201, "Created", req.body));
                    });
        }
    });
});


module.exports = router;
