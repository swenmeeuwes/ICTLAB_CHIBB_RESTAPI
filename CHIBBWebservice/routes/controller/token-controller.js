/**
 * token-controller.js
 * Created on 19-02-2017
 * @author Swen Meeuwes
 **/

var config = require('config');

var express = require('express');
var router = express.Router();

var jwt = require('json-web-token');

var neo4j = require('neo4j-driver').v1;
var driver = require('./../../database/driver');
var session = driver.session();

var wrapper = require('../model/response-wrapper');

router.get('/', function (req, res) {
    console.log("[TokenController] GET HTTP request received from %s", req.ip);


    var token = jwt.encode(config.get('token.secret'), {"username": "Bob"}, 'sha256');

    // return the information including token as JSON
    res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
    });
});

router.post('/', function (req, res) {
    console.log("[TokenController] POST HTTP request received from %s", req.ip);

    var token = req.body.token;

    jwt.decode(config.get('token.secret'), token, function (error, decodedPayload, decodedHeader) {
        if (error) {
            res.json({
                success: false,
                message: 'ACCESS DENIED!'
            });
        } else {
            res.json({
                success: true,
                message: 'ACCESS GRANTED!'
            });
        }
    });
});

module.exports = router;