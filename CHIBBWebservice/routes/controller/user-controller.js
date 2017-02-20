/**
 * user-controller.js
 * Created on 17-02-2017
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

var SHA256 = require('crypto-js/sha256');
var randomString = require('randomstring');

router.post("/register", function (req, res) {
    var requestBody = req.body;
    var salt = randomString.generate(16);
    var secret = randomString.generate(16);

    var password = SHA256(requestBody.password + salt).toString();

    console.log("[UserController] POST HTTP request received from %s", req.ip);

    session
            .run("CREATE (u:User {username: {username}, email: {email}, password: {password}, secret: {secret}, salt: {salt}});",
                    {username: requestBody.username, email: requestBody.email, password: password, secret: secret, salt: salt})
            .then(function () {
                res.send(wrapper(201, "Created"));
            });
});

router.post("/login", function (req, res) {
    var requestBody = req.body;
    var username = requestBody.username;
    var password = requestBody.password;

    console.log("[UserController] POST HTTP request received from %s", req.ip);

    if (!username || !password) {
        res.status(400);
        res.send(wrapper(400, "Bad Request"));
    }

    var user = session.run("MATCH (u:User) WHERE u.username = {username} RETURN u;", {username: requestBody.username});
    user.then(function (result) {
        var records = result.records;
        var recordFieldObjects = records.map(function (item) {
            return item._fields[0].properties; // Extract fields from the record
        });
        if (recordFieldObjects.length > 0) {
            var hashedPassword = SHA256(password + recordFieldObjects[0].salt).toString();
            if (recordFieldObjects[0].password === hashedPassword) {
                // Password is correct, provide token
                var token = jwt.sign({
                    username: username,
                    usersecret: requestBody.secret
                }, config.get('token.secret'), {expiresIn: '1h'});

                res.status(200);
                res.send(wrapper(200, "OK", {token: token}));
            } else {
                // Password is incorrect
                res.status(403);
                res.send(wrapper(403, "Forbidden", {message: "Password incorrect"}));
            }
        } else {
            // No such user exists
            res.status(403);
            res.send(wrapper(403, "Forbidden", {message: "User doesn't exist"}));
        }
    });
});

module.exports = router;
