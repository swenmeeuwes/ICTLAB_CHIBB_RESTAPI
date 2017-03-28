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

router.post('/register', function (req, res) {
    var requestBody = req.body;
    var salt = randomString.generate(16);
    var secret = randomString.generate(16);

    var password = SHA256(requestBody.password + salt).toString();

    var registerPromise = userModel.register(dbConnector.getSession(req),
            {
                username: requestBody.username,
                password: password,
                email: requestBody.email,
                salt: salt,
                secret: secret
            });

    registerPromise.then(function (data) {
        res.created({user: data});
    }).catch(function (error) {
        res.ok({error: error.message});
    });
});

// To-do: Finish with query
router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var loginPromise = userModel.login(dbConnector.getSession(req), req.body);
    loginPromise.then(function () {
        var token = jwt.sign({
            username: username
        }, secret, {expiresIn: '1h'});

        res.ok({token: token});

    }).catch(function (error) {
        res.ok({error: error.message});
    });
});

router.get('/getall', function (req, res) {
    var getPromise = userModel.getAll(dbConnector.getSession(req));
    getPromise.then(function (data) {
        if (data.length > 0) {
            res.ok(data);
        }
        else {
            res.nocontent(data);
        }
    });
});

module.exports = router;