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

var sensorModel = require('../models/sensor-model');

// middleware that is specific to this router
//router.use(function timeLog (req, res, next) {
//  console.log('Time: ', Date.now())
//  next()
//});

// Dangerous route, should be removed and probably not used...
//router.get('/getall', function (req, res) {
//    var getPromise = sensorModel.getAllSensors(dbConnector.getSession(req));
//    getPromise.then(function (data) {
//        if (data.length > 0) {
//            res.ok(data);
//        }
//        else {
//            res.nocontent(data);
//        }
//    });
//});

router.get('/', function (req, res) {
    var getPromise = sensorModel.getUserSensors(dbConnector.getSession(req), res.locals.username);
    getPromise.then(function (data) {
        if (data.length > 0) {
            res.ok(data);
        }
        else {
            res.ok(data);
        }
    });
});

router.get('/house/:id', function (req, res) {
    var getPromise = sensorModel.getSensorsFromHouseId(dbConnector.getSession(req), res.locals.username, req.params.id);
    getPromise.then(function (data) {
        if (data.length > 0) {
            res.ok(data);
        }
        else {
            res.ok(data);
        }
    });
});

/**
 * @api {get} /sensor/id/:id Request Sensor info
 * @apiVersion 0.0.1
 * @apiName GetSensorById
 * @apiGroup Sensor
 *
 * @apiParam {String} id Sensors unique ID.
 *
 * @apiSuccess {Number} statusCode The reponse status code.
 * @apiSuccess {String} statusMessage A readable response status code.
 * @apiSuccess {String} sid The unique identifier of the Sensor.
 * @apiSuccess {String} hid The unique identifier of the House.
 * @apiSuccess {String} location The human-readable location of the Sensor.
 * @apiSuccess {String} type The type of the Sensor.
 * @apiSuccess {String[]} attributes The attributes that the Sensor tracks.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.0 200 OK
 *     {
 *       "statusCode": 200,
 *       "statusMessage": "OK",
 *       "result": [
 *          {
 *              "sid": "2ke98E37YeVh",
 *              "hid": "i3djTejk35e82",
 *              "location": "Livingroom",
 *              "type": "Temperature",
 *              "attributes": [
 *                  "timestamp",
 *                  "unit",
 *                  "value"
 *              ]
 *          }
 *       ],
 *       "resultLength": 1
 *     }
 *
 * @apiError SensorNotFound The id of the Sensor was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.0 404 Not Found
 *     {
 *       "statusCode": 404,
 *       "statusMessage": "Not Found"
 *     }
 */
router.get('/id/:id', function (req, res) {
    var getPromise = sensorModel.getById(dbConnector.getSession(req), res.locals.username, req.params.id);
    getPromise.then(function (data) {
        if (data.length > 0) {
            res.ok(data);
        }
        else {
            res.ok(data);
        }
    });
});

/**
 * @api {get} /sensor/status/:id Request Sensor status
 * @apiVersion 0.0.1
 * @apiName GetSensorStatus
 * @apiGroup Sensor
 *
 * @apiParam {String} id Sensors unique ID.
 *
 * @apiSuccess {Number} batteryLevel Percentage of battery remaining.
 * @apiSuccess {String} status The current status of the requested sensor: Clean (sensor does not exists), Active (running), Intermittent failures (no data for 3 sec), Inactive (no data for 30 sec).
 *
 * @apiSuccessExample Success-Response (sensor exists):
 *     HTTP/1.0 200 OK
 *      {
 *          "statusCode": 200,
 *          "statusMessage": "OK",
 *          "result": {
 *              "sid": "t1",
 *              "status": "Inactive",
 *              "batteryLevel": 65
 *          }
 *      }   
 *
 *  @apiSuccessExample Success-Response (sensor does not exists):
 *     HTTP/1.0 200 OK
 *      {
 *          "statusCode": 200,
 *          "statusMessage": "OK",
 *          "result": {
 *              "sid": "t4",
 *              "status": "Clean",
 *              "batteryLevel": null
 *          }
 *      }   
 *
 */
router.get('/status/:id', function (req, res) {
    var getPromise = sensorModel.getStatus(dbConnector.getSession(req), res.locals.username, req.params.id);
    getPromise.then(function (data) {
        res.ok(data);
    });
});

router.get('/latest/:id', function(req, res){
    var getPromise = sensorModel.getLatestData(dbConnector.getSession(req), res.locals.username, req.params.id);
    getPromise.then(function (data) {
        res.ok(data);
    }).catch(function(error){
        console.log(error);
    })
})

/**
 * @api {get} /sensor/data/:id Request Sensor data
 * @apiVersion 0.0.1
 * @apiName GetSensorData
 * @apiGroup Sensor
 *
 * @apiParam {String} id Sensors unique ID.
 *
 * @apiSuccess {Number} statusCode The reponse status code.
 * @apiSuccess {String} statusMessage A readable response status code.
 * @apiSuccess {Record[]} result An array of records.
 * @apiSuccess {Number} resultLength Length of the result array.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.0 200 OK
 *     {
 *       "statusCode": 200,
 *       "statusMessage": "OK",
 *       "result": [
 *          {
 *              "timestamp": 1496327072,
 *              "unit": "Celcius",
 *              "value": 18
 *          },
 *          {
 *              "timestamp": 1496328072,
 *              "unit": "Celcius",
 *              "value": 16
 *          }
 *       ],
 *       "resultLength": 2
 *     }
 *
 * @apiError SensorNotFound The id of the Sensor was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.0 404 Not Found
 *     {
 *       "statusCode": 404,
 *       "statusMessage": "Not Found"
 *     }
 */
router.get('/data/:id', function (req, res, next) {
    var getPromise = sensorModel.getData(dbConnector.getSession(req), res.locals.username, req.params.id);
    getPromise.then(function (data) {
//        if (data.length > 0) {
        res.ok(data);
//        }
//        else {
//            res.ok(data);
//        }
    })
            .catch(function (error) {
                // only reject case here is: sensor not found
                res.notfound("Sensor with that id does not exist!");
            });
});

router.post('/', function (req, res) {
    var createPromise = sensorModel.createSensor(dbConnector.getSession(req), res.locals.username, req.body);
    createPromise.then(function (data) {
        res.created({sensor: data});
    }).catch(function (error) {
        // Maybe use a error handler module which uses an 'ResponseWrapperFactory' and takes statusCodes + error (objects)
        res.ok({error: error.message}); // Status: OK? should be internal service error?
    });
}); // Maybe error handler middleware? only next if error

router.put('/:id', function (req, res) {
    var updatePromise = sensorModel.updateSensor(dbConnector.getSession(req), res.locals.username, req.params.id, req.body);
    updatePromise.then(function (data) {
        res.ok({updatedSensor: data});
    }).catch(function (error) {
        res.ok(error.message);
    });
});

router.delete('/:id', function (req, res) {
    var deletePromise = sensorModel.deleteSensor(dbConnector.getSession(req), res.locals.username, req.params.id);
    deletePromise.then(function (data) {
        res.ok({deletedSensor: data});
    }).catch(function (error) {
        res.ok(error.message);
    });
});

module.exports = router;