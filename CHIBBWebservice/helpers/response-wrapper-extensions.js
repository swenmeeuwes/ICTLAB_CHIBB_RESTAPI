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
express.response.ok = function (resultBody) {
    var response = {};
    response.statusCode = 200;
    response.statusMessage = "OK";
    response.result = resultBody;
    response.resultLength = resultBody.length ? resultBody.length : 0;
    
    this.status(response.statusCode);
    this.json(response);
};

// 4xx Client errors
// 400 Bad Request
express.response.badrequest = function (additionalMessage) {
    var response = {};
    response.statusCode = 400;
    response.statusMessage = "Bad Request";
    
    if(additionalMessage)
        response.message = additionalMessage;
    
    this.status(response.statusCode);
    this.json(response);
};

// 401 Unauthorized
express.response.unauthorized = function (additionalMessage) {
    var response = {};
    response.statusCode = 401;
    response.statusMessage = "Unauthorized";
    
    if(additionalMessage)
        response.message = additionalMessage;
    
    this.status(response.statusCode);
    this.json(response);
};