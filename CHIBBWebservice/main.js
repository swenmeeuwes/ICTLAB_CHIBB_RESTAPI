/**
 * main.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 **/

var express = require('express');
var bodyParser = require('body-parser');

var routes = require('./routes/router');

var app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({// to support URL-encoded bodies
    extended: true
}));

app.use('/', routes);

app.listen(8081, function () {
    console.log('Example app listening on port 8081!');
});