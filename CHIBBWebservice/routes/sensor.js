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

router.get('/status/:id', function (req, res) {
    var getPromise = sensorModel.getStatus(dbConnector.getSession(req), res.locals.username, req.params.id);
    getPromise.then(function (data) {
        res.ok(data);
    });
});

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