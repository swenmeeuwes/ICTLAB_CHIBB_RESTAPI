/**
 * sensor-controller.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 **/

var express = require('express');
var router = express.Router();

var neo4j = require('neo4j-driver').v1;
var driver = require('./../../database/driver');
var session = driver.session();


router.get('/:id', function (req, res) {
    res.send("Sensor data from " + req.params.id);
});

router.post('/', function (req, res) {
    console.log("Post request received from %s", req.id);


    session
            .run("CREATE (a:Sensor {id: {id}, type: {type}})", {id: req.body.id, type: req.body.type})
            .then(function () {

//                session.close();
//                driver.close();

                res.send("POSTED SENSOR!\r\n" + JSON.stringify(req.body));
            });


});

module.exports = router;