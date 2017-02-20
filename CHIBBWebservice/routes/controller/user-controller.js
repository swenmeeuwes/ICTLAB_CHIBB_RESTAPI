/**
 * user-controller.js
 * Created on 17-02-2017
 * @author Swen Meeuwes
 **/

var express = require('express');
var router = express.Router();

var neo4j = require('neo4j-driver').v1;
var driver = require('./../../database/driver');
var session = driver.session();

var wrapper = require('../model/response-wrapper');

var SHA256 = require('crypto-js/sha256');
var randomString = require('randomstring');

router.post("/register", function(req, res){
    var queryParams = req.body;
    var salt = randomString.generate(16);
    var secret = randomString.generate(16);
    
    var password = SHA256(queryParams.password + salt).toString();
    
    console.log("[UserController] POST HTTP request received from %s", req.ip);
    
    session
            .run("CREATE (u:User {username: {username}, email: {email}, password: {password}, secret: {secret}});", 
                    {username: queryParams.username, email: queryParams.email, password: password, secret: secret})
            .then(function(){
                res.send(wrapper(201, "Created", queryParams.username));
            })
})

module.exports = router;
