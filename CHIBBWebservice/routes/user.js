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

// middleware that is specific to this router
//router.use(function timeLog (req, res, next) {
//  console.log('Time: ', Date.now())
//  next()
//});

router.get('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var token = jwt.sign({
        username: username
    }, secret, {expiresIn: '1h'});
    
    res.ok({token: token});
});

module.exports = router;