/**
 * house-model.js
 * Created on 27-03-2017
 * @author Jesse van Breda & Swen Meeuwes
 * 
 * A model which represents a house
 **/

var HouseModel = {};

var House = function (properties) {
    this.hid = properties.hid;
    this.address = properties.address;
};

HouseModel.constructor = House;

// Get all houses in the database (for admin purposes)
//HouseModel.getAllHouses = function (session) {
//    return new Promise(function (resolve, reject) {
//        var houses = session.run("MATCH (h:House) return h AS House;");
//        houses.then(function (result) {
//            if (result.records[0]) {
//                var houseArray = [];
//                for (var i = 0; i < result.records.length; i++) {
//                    houseArray.push(new House(result.records[i]._fields[0].properties));
//                }
//                session.close();
//                resolve(houseArray);
//            } else {
//                session.close();
//                resolve([]);
//            }
//        });
//    });
//};

// Get all houses owned by the logged in user
HouseModel.getUserHouses = function (session, username) {
    return new Promise(function (resolve, reject) {
        var houses = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House) RETURN h AS House;", {username: username});
        houses.then(function (result) {
            if (result.records[0]) {
                var houseArray = [];
                for (var i = 0; i < result.records.length; i++) {
                    houseArray.push(new House(result.records[i]._fields[0].properties));
                }
                session.close();                
                resolve(houseArray);
            } else {
                session.close();
                resolve([]);
            }
        });
    });
};

HouseModel.getById = function (session, username, hid) {
    return new Promise(function (resolve, reject) {
        var houses = session.run("MATCH (u:User {username:{username}})-[:Owns]->(h:House {hid: {hid}}) RETURN h AS House;", {username: username, hid: hid});
        houses.then(function (result) {
            if (result.records[0]) {
                var houseArray = [];
                for (var i = 0; i < result.records.length; i++) {
                    houseArray.push(new House(result.records[i]._fields[0].properties));
                }
                session.close();
                resolve(houseArray);
            } else {
                session.close();
                resolve([], {message: "House does not exist or is not yours!"});
            }
        });
    });
};

HouseModel.createHouse = function (session, username, requestBody) {
    return new Promise(function (resolve, reject) {
        var house = session.run("MATCH (h:House {hid:{hid}}) return h AS House;", {hid: requestBody.hid});
        house.then(function (result) {
            if (result.records[0]) {
                session.close();
                reject({message: "House with that Id already exists!"});
            } else {
                var newHouse = session.run("MATCH (u:User {username:{username}}) CREATE ((u) -[r:Owns]-> (h:House{hid:{hid},address:{address}}));", {username: username, hid: requestBody.hid, address: requestBody.address});
                newHouse.then(function () {
                    session.close();
                    resolve(new House(requestBody));
                });
            }
        });
    });
};

HouseModel.updateHouse = function (session, username, hid, requestBody) {
    return new Promise(function (resolve, reject) {
        var house = session.run("MATCH (h:House {hid:{hid}}) return h AS House;", {hid: hid});
        house.then(function (result) {
            if (result.records[0]) {
                var house = session.run("MATCH (u:User {username:{username}}) -[r:Owns]-> (h:House{hid:{hid}}) RETURN h AS House;", {username: username, hid: hid});
                house.then(function (result) {
                    if (result.records[0]) {
                        var updatedHouse = session.run("MATCH (h:House {hid:{hid}}) SET h += {hid: {newId}, address: {newAddress}};", {hid: hid, newId: requestBody.hid, newAddress: requestBody.address});
                        updatedHouse.then(function () {
                            session.close();
                            resolve(new House(requestBody));
                        });
                    } else {
                        session.close();
                        reject({message: "House with that id is not yours!"});
                    }
                });
            } else {
                session.close();
                reject({message: "House with that id does not exist!"});
            }
        });
    });
};

HouseModel.deleteHouse = function (session, username, hid) {
    return new Promise(function (resolve, reject) {
        var house = session.run("MATCH (h:House {hid:{hid}}) return h AS House;", {hid: hid});
        house.then(function (result) {
            if (result.records[0]) {
                var house = session.run("MATCH (u:User {username:{username}}) -[r:Owns]-> (h:House{hid:{hid}}) RETURN h AS House;", {username: username, hid: hid});
                house.then(function (result) {
                    if (result.records[0]) {
                        var deletedHouse = session.run("MATCH (u:User {username:{username}}), (h:House {hid:{hid}}) OPTIONAL MATCH (u)-[:Owns]-> (h) -[:Has]-> (s:Sensor) OPTIONAL MATCH (u)-[:Owns]-> (h) -[:Has]-> (s:Sensor) -[:Has_record]-> (r:Record) DETACH DELETE h, s, r;", {username: username, hid: hid});
                        deletedHouse.then(function () {
                            session.close();
                            resolve(new House({hid: hid}));
                        });
                    } else {
                        session.close();
                        reject({message: "House with that id is not yours!"});
                    }
                });
            } else {
                session.close();
                reject({message: "House with that id does not exist!"});
            }
        });
    });
};

module.exports = HouseModel;