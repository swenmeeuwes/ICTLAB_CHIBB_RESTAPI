/**
 * house.js
 * Created on 27-03-2017
 * @author Jesse van Breda & Swen Meeuwes
 * 
 * API house route
 **/

var express = require('express');
var router = express.Router();

var dbConnector = require('../database/database-connector');

// middleware that is specific to this router
//router.use(function timeLog (req, res, next) {
//  console.log('Time: ', Date.now())
//  next()
//});

router.get('/', function(req, res) {
    res.testsend("yo");
});

module.exports = router;