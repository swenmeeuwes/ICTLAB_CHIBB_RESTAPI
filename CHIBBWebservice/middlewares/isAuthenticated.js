/**
 * isAuthenticated.js
 * Created on 27-03-2017
 * @author Jesse van Breda & Swen Meeuwes
 * 
 * Middleware to check if the user is authenticated
 **/

module.exports = function(req, res, next) {
    console.log("DO THA STUFF BOI");
    
    // if authenticated
    next();
    
    // else
    // No 'next()'
    // Send response
};