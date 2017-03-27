/**
 * user.js
 * Created on 27-03-2017
 * @author Swen Meeuwes
 * 
 * API user route
 **/

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

var dbConnector = require('../database/database-connector');

//var secret = require('../providers/token-secret-provider'); // The way it could be :c
var fs = require('fs');
var secret = fs.readFileSync('./config/token.secret', 'utf8');

var SHA256 = require('crypto-js/sha256');
var randomString = require('randomstring');

var userModel = require('../models/user-model');

// middleware that is specific to this router
//router.use(function timeLog (req, res, next) {
//  console.log('Time: ', Date.now())
//  next()
//});

// To-do: Finish with query
router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var token = jwt.sign({
        username: username
    }, secret, {expiresIn: '1h'});

    res.ok({token: token});
});

router.get('/temp', function (req, res) {
    var registerPromise = userModel.register(dbConnector.getSession(req));
    registerPromise.then(function (data) {
        data.forEach(function(visitor) {
            console.log(visitor);
        });
    })
    .catch(function (error) {

    });
    
    res.send("");
});

router.get('/register', function (req, res) {
    var requestBody = req.body;
    var salt = randomString.generate(16);

    var password = SHA256(requestBody.password + salt).toString();
});

module.exports = router;