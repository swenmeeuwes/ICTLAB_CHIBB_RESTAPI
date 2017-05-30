/**
 * sensor-model.js
 * Created on 29-03-2017
 * @author Jesse van Breda & Swen Meeuwes
 * 
 * A model which represents a sensor
 **/

var RecordModel = require('./record-model');

var SensorModel = {};

var Sensor = function (properties) {
    this.sid = properties.sid;
    this.hid = properties.hid;
    this.location = properties.location;
    this.type = properties.type;
    this.attributes = properties.attributes;
};

SensorModel.constructor = Sensor;

// Get all sensors in the database (for admin purposes)
//SensorModel.getAllSensors = function (session) {
//    return new Promise(function (resolve, reject) {
//        var sensors = session.run("MATCH (s:Sensor) return s AS Sensor;");
//        sensors.then(function (result) {
//            if (result.records[0]) {
//                var sensorArray = [];
//                for (var i = 0; i < result.records.length; i++) {
//                    sensorArray.push(new Sensor(result.records[i]._fields[0].properties));
//                }
//                session.close();
//                resolve(sensorArray);
//            } else {
//                session.close();
//                resolve([]);
//            }
//        });
//    });
//};

SensorModel.getUserSensors = function (session, username) {
    return new Promise(function (resolve, reject) {
        var sensors = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House)-[:Has]->(s:Sensor) RETURN s AS Sensor;", {username: username});
        sensors.then(function (result) {
            if (result.records[0]) {
                var sensorArray = [];
                for (var i = 0; i < result.records.length; i++) {
                    sensorArray.push(new Sensor(result.records[i]._fields[0].properties));
                }
                session.close();
                resolve(sensorArray);
            } else {
                session.close();
                resolve([]);
            }
        });
    });
};

SensorModel.getSensorsFromHouseId = function (session, username, hid) {
    return new Promise(function (resolve, reject) {
        var sensors = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House {hid: {hid}})-[:Has]->(s:Sensor) RETURN s AS Sensor;", {username: username, hid: hid});
        sensors.then(function (result) {
            if (result.records[0]) {
                var sensorArray = [];
                for (var i = 0; i < result.records.length; i++) {
                    var properties = new Sensor(result.records[i]._fields[0].properties);
                    properties.hid = hid;
                    
                    sensorArray.push(properties);
                }
                session.close();
                resolve(sensorArray);
            } else {
                session.close();
                resolve([]);
            }
        });
    });
};

SensorModel.getById = function (session, username, sid) {
    return new Promise(function (resolve, reject) {
        var sensors = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House)-[:Has]->(s:Sensor {sid:{sid}}) RETURN s AS Sensor, h AS House;", {username: username, sid: sid});
        sensors.then(function (result) {
            if (result.records[0]) {
                var sensorProperties = result.records[0].get('Sensor').properties;               
                sensorProperties.hid = result.records[0].get('House').properties.hid; // inject hid prop
                
                session.close();
                resolve([new Sensor(sensorProperties)]);
            } else {
                session.close();
                resolve([], {message: "House does not exist or is not yours!"});
            }
        });
    });
};

SensorModel.createSensor = function (session, username, requestBody) {
    return new Promise(function (resolve, reject) {
        var sensor = session.run("MATCH (s:Sensor {sid:{sid}}) return s AS Sensor;", {sid: requestBody.sid});
        sensor.then(function (result) {
            if (result.records[0]) {
                reject({message: "Sensor with that Id already exists!"}); // Resolve -> OK?
            } else {
                var sensor = session.run("MATCH (u:User{username:{username}})-[:Owns]->(h:House{hid:{hid}}) RETURN h AS House;", {username: username, hid: requestBody.hid});
                sensor.then(function (result) {                    
                    if (result.records[0]) {
                        var newSensor = session.run("MATCH (h:House {hid:{hid}}) CREATE ((h) -[r:Has]-> (s:Sensor{sid:{sid},location:{location},type:{type},attributes:{attributes}}));", {hid: requestBody.hid, sid: requestBody.sid, location: requestBody.location, type: requestBody.type, attributes: requestBody.attributes});
                        newSensor.then(function () {
                            session.close();
                            resolve(new Sensor(requestBody));
                        });
                    } else {
                        session.close();
                        reject({message: "Given house does not exist or is not yours!"}); // Not found 404 {code: 404, message: "given house..."}
                    }
                });
            }
        });
    });
};

SensorModel.updateSensor = function (session, username, sid, requestBody) {
    return new Promise(function (resolve, reject) {
        var sensor = session.run("MATCH (s:Sensor {sid:{sid}}) return s AS Sensor;", {sid: sid});
        sensor.then(function (result) {
            if (result.records[0]) {
                var sensor = session.run("MATCH (u:User {username:{username}}) -[r:Owns]-> (h:House) -[:Has]-> (s:Sensor {sid:{sid}}) RETURN s AS Sensor;", {username: username, sid: sid});
                sensor.then(function (result) {
                    if (result.records[0]) {
                        var updatedSensor = session.run("MATCH (s:Sensor {sid:{sid}}) SET s += {sid: {newId}, type: {newType}, attributes: {newAttributes}};", {sid: sid, newId: requestBody.sid, newType: requestBody.type, newAttributes: requestBody.attributes});
                        updatedSensor.then(function () {
                            session.close();
                            resolve(new Sensor(requestBody));
                        });
                    } else {
                        session.close();
                        reject({message: "Sensor with that id is not yours!"});
                    }
                });
            } else {
                session.close();
                reject({message: "Sensor with that id does not exist!"});
            }
        });
    });
};

SensorModel.deleteSensor = function (session, username, sid) {
    return new Promise(function (resolve, reject) {
        var sensor = session.run("MATCH (s:Sensor {sid:{sid}}) return s AS Sensor;", {sid: sid});
        sensor.then(function (result) {
            if (result.records[0]) {
                var sensor = session.run("MATCH (u:User {username:{username}}) -[r:Owns]-> (h:House) -[:Has]-> (s:Sensor {sid:{sid}}) RETURN s AS Sensor;", {username: username, sid: sid});
                sensor.then(function (result) {
                    if (result.records[0]) {
                        var deletedSensor = session.run("MATCH (u:User {username:{username}}), (h: House), (s:Sensor {sid:{sid}}) OPTIONAL MATCH (u)-[:Owns]-> (h) -[:Has]-> (s) -[:Has_record]-> (allRecords) DETACH DELETE s, allRecords;", {username: username, sid: sid});
                        deletedSensor.then(function () {
                            session.close();
                            resolve(new Sensor({sid: sid}));
                        });
                    } else {
                        session.close();
                        reject({message: "Sensor with that id is not yours!"});
                    }
                });
            } else {
                session.close();
                reject({message: "Sensor with that id does not exist!"});
            }
        });
    });
};

SensorModel.getData = function (session, username, sid) {
    return new Promise(function (resolve, reject) {
//        var sensors = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House)-[:Has]->(s:Sensor {sid:{sid}}) RETURN s AS Sensor;", {username: username, sid: sid});
//        sensors.then(function (result) {
//            if (result.records[0]) {
//                var sensor = new Sensor(result.records[0]._fields[0].properties);
                var records = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House)-[:Has]->(s:Sensor {sid:{sid}})-[:Has_record]->(re:Record) return re AS Record, s AS Sensor;", {username: username, sid: sid});
                records.then(function (result) {
                    if (result.records[0]) {
                        var recordsArray = [];
                        var sensor = result.records[0].get('Sensor').properties;
                        for (var i = 0; i < result.records.length; i++) {
                            recordsArray.push(new RecordModel.constructor(result.records[i].get('Record').properties, sensor.attributes));
                        }
                        session.close();
                        resolve(recordsArray);
                    } else {
                        session.close();
                        resolve([]);
                    }
                }).catch(function (error) {
                    session.close();
                    reject({message: "Sensor with that id does not exist!"});
                });
//            } else {
//                reject({message: "Sensor with that id does not exist!"});
//            }
//        });
    });
};

SensorModel.getStatus = function (session, username, sid) {
    return new Promise(function (resolve, reject) {
        // Get latest record from sensor
        var records = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House)-[:Has]->(s:Sensor {sid:{sid}})-[:Has_record]->(r:Record) return r AS Record ORDER BY r.timestamp DESC LIMIT 1;", {username: username, sid: sid});
        records.then(function (result) {
            var status = "Unknown";
            var batteryLevel = null;
            if (result.records[0]) {
                var record = result.records[0].get('Record').properties;
                
                batteryLevel = record.sensorBatteryLevel;
                
                var now = Date.now();
                var latestTimestamp = record.timestamp;
                
//              If a sensor node has not sent sensor data for more than 3
//              seconds it gets status “intermittent failures”, in case
//              sensordata is not received for more than 30 seconds it
//              gets status “inactive”
                if(latestTimestamp < now - 30 * 1000)
                    status = "Inactive";
                else if(latestTimestamp < now - 3 * 1000)
                    status = "Intermittent failures";
                else
                    status = "Active";
            } else {
                // Sensor has no records and thus is 'clean'
                status = "Clean";
            }
            
            session.close();
            resolve({
                sid: sid,
                status: status,
                batteryLevel: batteryLevel
            });
        }).catch(function (error) {
            session.close();
            reject({message: "Sensor with that id does not exist!"});
        });
    });
};

module.exports = SensorModel;


