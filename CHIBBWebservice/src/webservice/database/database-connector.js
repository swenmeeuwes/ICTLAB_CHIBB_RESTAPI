/**
 * database-connector.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 **/

var config = require('config');
var neo4j = require('neo4j-driver').v1;

var dbConfig = config.get('dbConfig');
var driver = neo4j.driver(dbConfig.protocol + "://" + dbConfig.bolt_host + ":" + dbConfig.bolt_port, neo4j.auth.basic(dbConfig.db_user, dbConfig.db_password));

var databaseConnector = {};

databaseConnector.getSession = function (requestContext) {
    // Prevent multiple sessions being made in the same requestContext
    if (requestContext.neo4jSession) {
        return requestContext.neo4jSession;
    } else {
        requestContext.neo4jSession = driver.session();
        return requestContext.neo4jSession;
    }
};

module.exports = databaseConnector;