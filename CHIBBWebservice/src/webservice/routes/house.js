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

router.get('/', function(req, res){
    var getPromise = houseModel.getUserHouses(dbConnector.getSession(req), res.locals.username);
    getPromise.then(function(data){
        res.ok(data);
    });
});

/**
 * @api {get} /house/:id Get a House
 * @apiVersion 0.0.1
 * @apiName GetHouseById
 * @apiGroup House
 *
 * @apiParam {String} id House unique ID.
 *
 * @apiSuccess {Number} statusCode The reponse status code.
 * @apiSuccess {String} statusMessage A readable response status code.
 * @apiSuccess {String} hid The unique identifier of the House.
 * @apiSuccess {String} address The address of the House.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "statusCode": 200,
 *       "statusMessage": "OK",
 *       "result": [
 *          {
 *              "hid": "i3djTejk35e82",
 *              "address": "Directiekade 2"
 *          }
 *       ],
 *       "resultLength": 1
 *     }
 *
 * @apiError HouseNotFound No House with the provided Id was found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "statusCode": 404,
 *       "statusMessage": "Not Found"
 *     }
 */
router.get('/:id', function(req, res){
    var getPromise = houseModel.getById(dbConnector.getSession(req), res.locals.username, req.params.id);
    getPromise.then(function(data){
        res.ok(data);
    });
});

/**
 * @api {put} /house/ Create a House
 * @apiVersion 0.0.1
 * @apiName CreateHouseById
 * @apiGroup House
 * 
 * @apiParam {String} hid House unique ID.
 * @apiParam {String} address The address of the House.
 *
 * @apiSuccess {Number} statusCode The reponse status code.
 * @apiSuccess {String} statusMessage A readable response status code.
 * @apiSuccess {String} hid The unique identifier of the newly created House.
 * @apiSuccess {String} address The address of the newly created House.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "statusCode": 201,
 *       "statusMessage": "Created",
 *       "result": [
 *          {
 *              "hid": "i3djTejk35e82",
 *              "address": "Directiekade 2"
 *          }
 *       ],
 *       "resultLength": 1
 *     }
 *
 * @apiError HouseNotFound A house with the provided Id already exists
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "statusCode": 409,
 *       "statusMessage": "Conflict"
 *     }
 */
router.post('/', function(req, res){
    var createPromise = houseModel.createHouse(dbConnector.getSession(req), res.locals.username, req.body);
    createPromise.then(function(data){
        res.created({house: data});
    }).catch(function(error){
        res.ok(error.message);
    });
});

/**
 * @api {put} /house/:id Update a House
 * @apiVersion 0.0.1
 * @apiName UpdateHouseById
 * @apiGroup House
 *
 * @apiParam {String} hid House unique ID.
 * @apiParam {String} address The address of the House.
 *
 * @apiSuccess {Number} statusCode The reponse status code.
 * @apiSuccess {String} statusMessage A readable response status code.
 * @apiSuccess {String} hid The unique identifier of the updated House.
 * @apiSuccess {String} address The address of the updated House.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "statusCode": 200,
 *       "statusMessage": "OK",
 *       "result": [
 *          {
 *              "hid": "i3djTejk35e82",
 *              "address": "Directiekade 2"
 *          }
 *       ],
 *       "resultLength": 1
 *     }
 *
 * @apiError HouseNotFound No House with the provided Id was found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "statusCode": 404,
 *       "statusMessage": "Not Found"
 *     }     
 */
router.put('/:id', function(req, res){
    var updatePromise = houseModel.updateHouse(dbConnector.getSession(req), res.locals.username, req.params.id, req.body);
    updatePromise.then(function(data){
        res.ok({updatedHouse: data});
    }).catch(function(error){
        res.ok(error.message);
    });
});

/**
 * @api {delete} /house/:id Delete a House
 * @apiVersion 0.0.1
 * @apiName DeleteHouseById
 * @apiGroup House
 *
 * @apiParam {String} id House unique ID.
 *
 * @apiSuccess {Number} statusCode The reponse status code.
 * @apiSuccess {String} statusMessage A readable response status code.
 * @apiSuccess {String} hid The unique identifier of the deleted House.
 * @apiSuccess {String} address The address of the deleted House.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "statusCode": 200,
 *       "statusMessage": "OK",
 *       "result": [
 *          {
 *              "hid": "i3djTejk35e82",
 *              "address": "Directiekade 2"
 *          }
 *       ],
 *       "resultLength": 1
 *     }
 *
 * @apiError HouseNotFound No House with the provided Id was found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "statusCode": 404,
 *       "statusMessage": "Not Found"
 *     }
 */
router.delete('/:id', function(req, res){
    var deletePromise = houseModel.deleteHouse(dbConnector.getSession(req), res.locals.username, req.params.id);
    deletePromise.then(function(data){
        res.ok({deletedHouse: data});
    }).catch(function(error){
        res.ok(error.message);
    });
});

module.exports = router;