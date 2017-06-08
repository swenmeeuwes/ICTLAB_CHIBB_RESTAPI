/**
 * error-handler.js
 * Created on 30-03-2017
 * @author Swen Meeuwes
 * 
 * Middleware for handling errors produced from routes
 **/

module.exports = function (req, res, next) {
    // Find appropriate error (ResponseWrapperFactory?)
    
    // For now return error
    var errorObject = res.locals.error; // Has 'code' and 'message' properties
    res.interalservererror(errorObject.message);
};