/**
 * driver.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 **/

var config = require('config');
var neo4j = require('neo4j-driver').v1;

var driver = function () {
    var dbConfig = config.get('dbConfig');
    return neo4j.driver(dbConfig.protocol + "://" + dbConfig.host + ":" + dbConfig.port, neo4j.auth.basic(dbConfig.user, dbConfig.password));
};

module.exports = driver();