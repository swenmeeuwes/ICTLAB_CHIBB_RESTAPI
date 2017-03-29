/**
 * sensor-model.js
 * Created on 29-03-2017
 * @author Jesse van Breda & Swen Meeuwes
 * 
 * A model which represents a sensor
 **/

var recordModel = require('./record-model');

var sensorModel = {};

var Sensor = function (properties) {
    this.sid = properties.sid;
    this.hid = properties.hid;
    this.type = properties.type;
    this.attributes = properties.attributes;
};

sensorModel.constructor = Sensor;

// Get all sensors in the database (for admin purposes)
sensorModel.getAllSensors = function(session){
    return new Promise(function (resolve, reject) {
        var sensors = session.run("MATCH (s:Sensor) return s AS Sensor;");
        sensors.then(function (result) {
            if (result.records[0]) {
                var sensorArray = [];
                for (var i = 0; i < result.records.length; i++) {
                    sensorArray.push(new Sensor(result.records[i]._fields[0].properties));
                }
                resolve(sensorArray);
            }
            else {
                resolve([]);
            }
        });
    });
    session.close();  
};

sensorModel.getUserSensors = function(session, username){
    return new Promise(function (resolve, reject) {
        var sensors = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House)-[:Has]->(s:Sensor) RETURN s AS Sensor;", {username: username});
        sensors.then(function (result) {
            if (result.records[0]) {
                var sensorArray = [];
                for (var i = 0; i < result.records.length; i++) {
                    sensorArray.push(new House(result.records[i]._fields[0].properties));
                }
                resolve(sensorArray);
            }
            else {
                resolve([]);
            }
        });
    });
    session.close();    
};

sensorModel.getById = function(session, username, sid){
    return new Promise(function (resolve, reject) {
        var sensors = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House)-[:Has]->(s:Sensor {sid:{sid}}) RETURN s AS Sensor;", {username: username, sid: sid});
        sensors.then(function (result) {
            if (result.records[0]) {
                var sensorArray = [];
                for (var i = 0; i < result.records.length; i++) {
                    sensorArray.push(new Sensor(result.records[i]._fields[0].properties));
                }
                resolve(sensorArray);
            }
            else {
                resolve([], {message: "House does not exist or is not yours!"});
            }
        });
    });
    session.close();
};

sensorModel.createSensor = function(session, username, requestBody){
    return new Promise(function (resolve, reject) {
        var sensor = session.run("MATCH (s:Sensor {sid:{sid}}) return s AS Sensor;", {sid: requestBody.sid});
        sensor.then(function (result) {
            if (result.records[0]) {
                reject({message: "Sensor with that Id already exists!"});
            }
            else {
                var sensor = session.run("MATCH (u:User{username:{username}})-[:Owns]->(h:House{hid:{hid}}) RETURN h AS House;", {username: username, hid: requestBody.hid});
                sensor.then(function(result){
                    if(result.records[0]){
                        var newSensor = session.run("MATCH (h:House {hid:{hid}}) CREATE ((h) -[r:Has]-> (s:Sensor{sid:{sid},type:{type},attributes:{attributes}}));", {hid: requestBody.hid, sid: requestBody.sid, type: requestBody.type, attributes: requestBody.attributes});
                        newSensor.then(function(){
                            resolve(new Sensor(requestBody));
                        });
                    }
                    else {
                        reject({message: "Given house does not exist or is not yours!"});
                    }
                });
            }
        });
    });
    session.close();
};

sensorModel.updateSensor = function(session, username, sid, requestBody){
    return new Promise(function (resolve, reject) {
        var sensor = session.run("MATCH (s:Sensor {sid:{sid}}) return s AS Sensor;", {sid: sid});
        sensor.then(function (result) {
            if (result.records[0]) {
                var sensor = session.run("MATCH (u:User {username:{username}}) -[r:Owns]-> (h:House) -[:Has]-> (s:Sensor {sid:{sid}}) RETURN s AS Sensor;", {username: username, sid: sid});
                sensor.then(function (result) {
                    if (result.records[0]) {
                        var updatedSensor = session.run("MATCH (s:Sensor {sid:{sid}}) SET s += {sid: {newId}, type: {newType}, attributes: {newAttributes}};", {sid: sid, newId: requestBody.sid, newType: requestBody.type, newAttributes: requestBody.attributes});
                        updatedSensor.then(function () {
                            resolve(new Sensor(requestBody));
                        });
                    }
                    else {
                        reject({message: "Sensor with that id is not yours!"});
                    }
                });
            }
            else {
                reject({message: "Sensor with that id does not exist!"});
            }
        });
    });
    session.close();
};

sensorModel.deleteSensor = function(session, username, sid){
    return new Promise(function (resolve, reject) {
        var sensor = session.run("MATCH (s:Sensor {sid:{sid}}) return s AS Sensor;", {sid: sid});
        sensor.then(function (result) {
            if (result.records[0]) {
                var sensor = session.run("MATCH (u:User {username:{username}}) -[r:Owns]-> (h:House) -[:Has]-> (s:Sensor {sid:{sid}}) RETURN s AS Sensor;", {username: username, sid: sid});
                sensor.then(function (result) {
                    if (result.records[0]) {
                        var deletedSensor = session.run("MATCH (u:User {username:{username}}), (h: House), (s:Sensor {sid:{sid}}) OPTIONAL MATCH (u)-[:Owns]-> (h) -[:Has]-> (s) -[:Has_record]-> (allRecords) DETACH DELETE s, allRecords;", {username: username, sid: sid});
                        deletedSensor.then(function () {
                            resolve(new Sensor({sid: sid}));
                        });
                    }
                    else {
                        reject({message: "Sensor with that id is not yours!"});
                    }
                });
            }
            else {
                reject({message: "Sensor with that id does not exist!"});
            }
        });
    });
    session.close();
};

sensorModel.getData = function(session, username, sid){
    return new Promise(function (resolve, reject) {
        var sensors = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House)-[:Has]->(s:Sensor {sid:{sid}}) RETURN s AS Sensor;", {username: username, sid: sid});
        sensors.then(function (result) {
            if (result.records[0]) {
                var sensor = new Sensor(result.records[0]._fields[0].properties);
                var records = session.run("MATCH (s:Sensor {sid:{sid}}) -[:Has_record]-> (re:Record) return re AS Record;", {sid: sid});
                records.then(function(result){
                    if(result.records[0]){
                        var recordsArray = [];
                        for (var i = 0; i < result.records.length; i++) {
                            recordsArray.push(new recordModel.constructor(result.records[i]._fields[0].properties, sensor.attributes));
                        }
                        resolve(recordsArray);
                    }
                    else {
                        resolve([]);
                    }
                });
            }
            else {
                reject({message: "Sensor with that id does not exist!"});
            }
        });
    });
    session.close();
};

module.exports = sensorModel;


