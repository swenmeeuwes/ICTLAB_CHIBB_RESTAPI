/**
 * session.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 **/

var driver = require('./driver');

var session = function (promise) {
    return driver.session(promise);
};

module.exports = session;