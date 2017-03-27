/**
 * main.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 **/

var config = require('config');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var routes = require('./routes/router');

var app = express();

// Allow CORS requests for now, should handle this on route level
app.use(cors());

// BodyParser configuration
app.use(bodyParser.json());       // Support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // Support URL-encoded bodies
    extended: true
}));

// Let 'router.js' handle the routing
app.use('/', routes);

// Listen at port defined in the config
var webservice = app.listen(config.get('webservice.port'), function () {
    var host = webservice.address().address;
    var port = webservice.address().port;

    console.log('CHIBB RESTful webservice listening at: %s:%s', host, port);
});