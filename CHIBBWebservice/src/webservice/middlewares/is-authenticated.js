/**
 * isAuthenticated.js
 * Created on 27-03-2017
 * @author Jesse van Breda & Swen Meeuwes
 * 
 * Middleware to check if the user is authenticated
 **/

var jwt = require('jsonwebtoken');

//var secret = require('../providers/token-secret-provider'); // The way it should be :c
var fs = require('fs');
var secret = fs.readFileSync('./assets/token.secret', 'utf8');

module.exports = function (req, res, next) {
    var token = req.query.token;
    jwt.verify(token, secret, function (error, decoded) {
        if (error) {
            // Request is unauthorized
            res.unauthorized(error.message);
        } else if (decoded) {
            // Request is authorized and valid
            // Pass local variables, see: 'http://expressjs.com/en/api.html#res.locals'.
            res.locals.username = decoded.username;
            
            next();
        }
    });
};