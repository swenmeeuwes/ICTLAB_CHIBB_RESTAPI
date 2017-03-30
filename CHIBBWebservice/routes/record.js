/**
 * sensor.js
 * Created on 29-03-2017
 * @author Jesse van Breda & Swen Meeuwes
 * 
 * API sensor route
 **/

var express = require('express');
var router = express.Router();

var dbConnector = require('../database/database-connector');

var recordModel = require('../models/record-model');

// middleware that is specific to this router
//router.use(function timeLog (req, res, next) {
//  console.log('Time: ', Date.now())
//  next()
//});

router.post('/', function(req, res){
    var createPromise = recordModel.createData(dbConnector.getSession(req), req.body);
    createPromise.then(function(data){
        res.created({data: data});
    }).catch(function(error){
        res.ok(error.message);
    });
});

module.exports = router;