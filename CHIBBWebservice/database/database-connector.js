/**
 * database-connector.js
 * Created on 16-02-2017
 * @author Swen Meeuwes
 * 
 * Wish: Implement a 'database switch' setting an attribute in the config file to 'remote' will use remote database, 'local' will use local db
 *       'neo4j-local-xxx': host/ post/ ...
 *       'neo4j-remote-xxx': ...
 *       'neo4j-env': 'local'/ 'remote' (where 'local' is default)
 **/

var config = require('config');
var neo4j = require('neo4j-driver').v1;

var dbConfig = config.get('dbConfig');
var driver = neo4j.driver(dbConfig.protocol + "://" + dbConfig.host + ":" + dbConfig.port, neo4j.auth.basic(dbConfig.user, dbConfig.password));

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