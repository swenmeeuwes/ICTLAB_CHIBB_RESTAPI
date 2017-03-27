/**
 * route-context.js
 * Created on 27-03-2017
 * @author Jesse van Breda & Swen Meeuwes
 * 
 * A context for defining routes within the API
 **/

var isAuthenticated = require('./middlewares/isAuthenticated');
var routes = require('./routes');

exports.configure = function(router) {   
    // Add routes here
    router.use('/house', isAuthenticated, routes.house);
};