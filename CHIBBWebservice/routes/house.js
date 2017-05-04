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

var houseModel = require('../models/house-model');

// middleware that is specific to this router
//router.use(function timeLog (req, res, next) {
//  console.log('Time: ', Date.now())
//  next()
//});

router.get('/getall', function(req, res) {
    var getPromise = houseModel.getAllHouses(dbConnector.getSession(req));
    getPromise.then(function (data) {
        res.ok(data);
    });
});

router.get('/', function(req, res){
    var getPromise = houseModel.getUserHouses(dbConnector.getSession(req), res.locals.username);
    getPromise.then(function(data){
        res.ok(data);
    });
});

router.get('/:id', function(req, res){
    var getPromise = houseModel.getById(dbConnector.getSession(req), res.locals.username, req.params.id);
    getPromise.then(function(data){
        res.ok(data);
    });
});

router.post('/', function(req, res){
    var createPromise = houseModel.createHouse(dbConnector.getSession(req), res.locals.username, req.body);
    createPromise.then(function(data){
        res.created({house: data});
    }).catch(function(error){
        res.ok(error.message);
    });
});

router.put('/:id', function(req, res){
    var updatePromise = houseModel.updateHouse(dbConnector.getSession(req), res.locals.username, req.params.id, req.body);
    updatePromise.then(function(data){
        res.ok({updatedHouse: data});
    }).catch(function(error){
        res.ok(error.message);
    });
});

router.delete('/:id', function(req, res){
    var deletePromise = houseModel.deleteHouse(dbConnector.getSession(req), res.locals.username, req.params.id);
    deletePromise.then(function(data){
        res.ok({deletedHouse: data});
    }).catch(function(error){
        res.ok(error.message);
    });
});

module.exports = router;