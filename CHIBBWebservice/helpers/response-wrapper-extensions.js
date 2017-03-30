/**
 * response-wrapper-extensions.js
 * Created on 27-03-2017
 * @author Swen Meeuwes
 * 
 * Provides standardized http response wrappers, 
 * to ensure consistency within the webservice.
 **/

var express = require("express");

// 2xx Success
// 200 OK
express.response.ok = function (resultBody, warningMessage) {
    var response = {};
    response.statusCode = 200;
    response.statusMessage = "OK";
    response.result = resultBody;
    
    if (resultBody.length)
        response.resultLength = resultBody.length;
    
    if (resultBody.warningMessage)
        response.warningMessage = warningMessage;

    this.status(response.statusCode);
    this.json(response);
};

// 201 Created
express.response.created = function (resultBody){
    var response = {};
    response.statusCode = 201;
    response.statusMessage = "Created";
    response.result = resultBody;
    
    if (resultBody.length)
        response.resultLength = resultBody.length;
    
    this.status(response.statusCode);
    this.json(response);
};

// 204 No Content
express.response.nocontent = function (resultBody){
    var response = {};
    response.statusCode = 204;
    response.statusMessage = "No Content";
    response.result = resultBody;
    
    if (resultBody.length)
        response.resultLength = resultBody.length;
    
    this.status(response.statusCode);
    this.json(response);
};

// 4xx Client errors
// 400 Bad Request
express.response.badrequest = function (additionalMessage) {
    var response = {};
    response.statusCode = 400;
    response.statusMessage = "Bad Request";

    if (additionalMessage)
        response.message = additionalMessage;

    this.status(response.statusCode);
    this.json(response);
};

// 401 Unauthorized
express.response.unauthorized = function (additionalMessage) {
    var response = {};
    response.statusCode = 401;
    response.statusMessage = "Unauthorized";

    if (additionalMessage)
        response.message = additionalMessage;

    this.status(response.statusCode);
    this.json(response);
};

// 403 Forbidden
express.response.forbidden = function (additionalMessage) {
    var response = {};
    response.statusCode = 403;
    response.statusMessage = "Forbidden";

    if (additionalMessage)
        response.message = additionalMessage;

    this.status(response.statusCode);
    this.json(response);
};

// 404 Not Found
express.response.notfound = function (additionalMessage) {
    var response = {};
    response.statusCode = 404;
    response.statusMessage = "Not Found";

    if (additionalMessage)
        response.message = additionalMessage;

    this.status(response.statusCode);
    this.json(response);
};

// 5xx Server error
// 500 Internal Server Error
express.response.interalservererror = function (additionalMessage) {
    var response = {};
    response.statusCode = 500;
    response.statusMessage = "Internal Server Error";

    if (additionalMessage)
        response.message = additionalMessage;

    this.status(response.statusCode);
    this.json(response);
};