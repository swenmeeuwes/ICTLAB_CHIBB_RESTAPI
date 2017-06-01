/**
 * route-context.js
 * Created on 27-03-2017
 * @author Jesse van Breda & Swen Meeuwes
 * 
 * A context for defining routes within the API
 **/

var express = require('express');
var path = require('path');
var isAuthenticated = require('./middlewares/is-authenticated');
var routes = require('./routes');

exports.configure = function(router) {
    // ApiDocs
    router.use('/api', express.static(path.join(__dirname, '/apidoc')));
    
    // Add routes here
    router.use('/house', isAuthenticated, routes.house);
    router.use('/sensor', isAuthenticated, routes.sensor);
    router.use('/user', routes.user);
    router.use('/record', routes.record);
};