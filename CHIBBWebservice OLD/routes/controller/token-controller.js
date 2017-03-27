/**
 * token-controller.js
 * Created on 19-02-2017
 * @author Swen Meeuwes
 **/

var config = require('config');

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

var neo4j = require('neo4j-driver').v1;
var driver = require('./../../database/driver');
var session = driver.session();

var wrapper = require('../model/response-wrapper');

router.get('/', function (req, res) {
    console.log("[TokenController] GET HTTP request received from %s", req.ip);

    // IF user not valid
    if (false) {
        res.status(403);
        res.json(wrapper(403, "Forbidden"));
    }

    // IF user valid
    var username = "HENK";
    var usersecret = "asdada";

    var token = jwt.sign({
        username: username,
        usersecret: usersecret
    }, config.get('token.secret'), {expiresIn: '1h'});

    res.status(200);
    res.json(wrapper(200, "OK", {token: token}));
});

router.post('/', function (req, res) {
    console.log("[TokenController] POST HTTP request received from %s", req.ip);

    var token = req.body.token;

    jwt.verify(token, config.get('token.secret'), function (error, decoded) {
        if (error) {
            res.json(wrapper(403, "Forbidden"));
        } else {
            res.json(wrapper(200, "OK"));
        }
    });
});

module.exports = router;